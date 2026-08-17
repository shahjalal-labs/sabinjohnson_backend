import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./verifyToken";
import { parse } from "url";
import prisma from "../../shared/prisma";
import {
  approveRequest,
  cancelRide,
  endRide,
  getRidesharingById,
  sendRequestToRider,
  startRide,
} from "../modules/ridesharing/ridesharing.service";
import { authService } from "../modules/auth/auth.service";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const connectedUsers = new Map<string, CustomWebSocket>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const { query } = parse(req.url!, true);
    let authToken = req.headers["x-token"] as string;
    if (!authToken && query["x-token"]) {
      authToken = Array.isArray(query["x-token"])
        ? query["x-token"][0]
        : query["x-token"];
    }
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) return;

    const userId = decoded.id;
    ws.userId = userId;
    connectedUsers.set(userId, ws);

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    ws.on("message", async (message: any) => {
      try {
        const {
          type,
          receiverId,
          rideId,
          roomId,
          content,
          requestData,
          cancelReason,
          isOnline,
          longitude,
          latitude,
        } = JSON.parse(message.toString());

        switch (type) {
          case "my-ride-requests":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideRequests = await prisma.ridesharing.findMany({
                where: {
                  riderId: ws.userId,
                  status: "Pending",
                },
                orderBy: {
                  createdAt: "desc",
                },
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      phoneNumber: true,
                    },
                  },
                  rider: {
                    select: {
                      id: true,
                      fullName: true,
                      phoneNumber: true,
                    },
                  },
                  pickupAddress: true,
                  pickupLatitude: true,
                  pickupLongitude: true,
                  destinationAddress: true,
                  destinationLat: true,
                  destinationLong: true,
                  etaMinutes: true,
                  userDistanceKm: true,
                  cost: true,
                  payWith: true,
                  createdAt: true,
                  status: true,
                },
              });

              ws.send(
                JSON.stringify({
                  type: "my-ride-requests",
                  message: "Your ride requests fetched successfully",
                  rideRequests,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "send-ride-request":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }
              if (!requestData) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Request data is required",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(requestData.riderId);

              if (
                !receiverSocket ||
                receiverSocket.readyState !== WebSocket.OPEN
              ) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Receiver is not online",
                  }),
                );
              }

              const rideRequests = await sendRequestToRider(
                userId,
                requestData,
              );

              // send ONLY to receiver
              receiverSocket.send(
                JSON.stringify({
                  type: "ride-requests",
                  message: "You have a new ride request",
                  rideRequests,
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "ride-request-sent",
                  message: "Your ride request has been sent successfully",
                }),
              );
              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "approve-ride-request":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Pending") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only pending ride requests can be approved",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(rideInfo.user.id);

              if (
                !receiverSocket ||
                receiverSocket.readyState !== WebSocket.OPEN
              ) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Receiver is not online",
                  }),
                );
              }

              const rideRequests = await approveRequest(userId, rideId);

              // send ONLY to receiver
              receiverSocket.send(
                JSON.stringify({
                  type: "approved-ride-request",
                  rideInfo: rideInfo,
                  message: "Your ride request has been approved",
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "ride-requests",
                  message: "You have approved a ride request",
                  rideRequests,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "cancel-ride-request":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Pending") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only pending ride requests can be cancelled",
                  }),
                );
              }

              await cancelRide(rideId, userId, cancelReason);

              if (rideInfo.user.id === userId) {
                const receiverSocket = connectedUsers.get(rideInfo.rider.id);
                // send ONLY to receiver
                receiverSocket?.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "User has cancelled the ride request",
                    rideInfo: rideInfo,
                  }),
                );

                ws.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "You have cancelled a ride request",
                    rideInfo: rideInfo,
                  }),
                );
              } else {
                const receiverSocket = connectedUsers.get(rideInfo.user.id);
                // send ONLY to receiver
                receiverSocket?.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "Rider has cancelled the ride request",
                    rideInfo: rideInfo,
                  }),
                );

                ws.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "You have cancelled a ride request",
                    rideInfo: rideInfo,
                  }),
                );
              }

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "start-ride":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Accepted") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only accepted ride requests can be started",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(rideInfo.user.id);

              await startRide(rideId);

              // send ONLY to receiver
              receiverSocket?.send(
                JSON.stringify({
                  type: "start-ride",
                  message: "Your ride request has been started",
                  rideInfo: rideInfo,
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "start-ride",
                  message: "You have started a ride",
                  rideInfo: rideInfo,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "end-ride":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Started") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only started ride requests can be ended",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(rideInfo.user.id);

              await endRide(rideId);

              // send ONLY to receiver
              receiverSocket?.send(
                JSON.stringify({
                  type: "end-ride",
                  message: "Your ride request has been ended",
                  rideInfo: rideInfo,
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "end-ride",
                  message: "You have ended a ride",
                  rideInfo: rideInfo,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "subscribe-room": {
            if (!ws.userId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Authentication required",
                }),
              );
            }
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                }),
              );
            }

            const userIds = [userId, receiverId].sort().join("_");
            const roomInfo = await prisma.room.upsert({
              where: {
                userIds,
              },
              create: {
                user1Id: userId,
                user2Id: receiverId,
                userIds,
              },
              update: {},
              select: {
                id: true,
                user1: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                    phoneNumber: true,
                  },
                },
                user2: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                    phoneNumber: true,
                  },
                },
                messages: {
                  orderBy: { createdAt: "desc" },
                  select: {
                    id: true,
                    content: true,
                    senderId: true,
                    createdAt: true,
                  },
                },
              },
            });

            ws.send(
              JSON.stringify({
                type: "subscribed-room",
                message: "Subscribed to room successfully",
                roomInfo: {
                  id: roomInfo.id,
                  user:
                    roomInfo.user1.id === userId
                      ? roomInfo.user2
                      : roomInfo.user1,
                  message: roomInfo.messages,
                },
              }),
            );

            break;
          }

          case "send-message": {
            if (!ws.userId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Authentication required",
                }),
              );
            }
            if (!receiverId || !roomId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID & room ID is required",
                }),
              );
            }

            const message = await prisma.message.create({
              data: {
                content,
                senderId: userId,
                roomId,
              },
              select: {
                id: true,
                content: true,
                senderId: true,
                createdAt: true,
              },
            });

            const receiverSocket = connectedUsers.get(receiverId);
            receiverSocket?.send(
              JSON.stringify({
                type: "new-message",
                receiverId,
                message: message,
              }),
            );

            ws.send(
              JSON.stringify({
                type: "message-sent",
                message: "Message sent successfully",
              }),
            );

            break;
          }

          case "check-online-status": {
            if (!ws.userId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Authentication required",
                }),
              );
            }
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                }),
              );
            }

            const receiverSocket = connectedUsers.get(receiverId);
            const isOnline = !!receiverSocket && receiverSocket.readyState === WebSocket.OPEN;

            ws.send(
              JSON.stringify({
                type: "online-status",
                receiverId,
                isOnline,
                message: isOnline ? "User is online" : "User is offline",
              }),
            );

            break;
          }

          case "toggle-online": {
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const newOnlineStatus = !!isOnline; // true or false from client message payload

              const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { isOnline: newOnlineStatus },
                select: { id: true, isOnline: true, role: true }
              });

              if (newOnlineStatus && latitude && longitude) {
                if (updatedUser.role === "User") {
                  await authService.userLocationUpdate(userId, { latitude, longitude });
                } else if (updatedUser.role === "Rider") {
                  await authService.riderLocationUpdate(userId, { latitude, longitude });
                } else if (updatedUser.role === "Food_Deliver") {
                  await authService.foodDeliverLocationUpdate(userId, { latitude, longitude });
                }
              }

              ws.send(
                JSON.stringify({
                  type: "toggle-online",
                  message: `You are now ${newOnlineStatus ? 'online' : 'offline'}`,
                  user: updatedUser,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
              ws.send(JSON.stringify({ type: "error", message: "Failed to toggle online status" }));
            }
            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message type",
              }),
            );
        }
      } catch (err) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid JSON format" }),
        );
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss };

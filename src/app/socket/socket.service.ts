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
          coHostLink,
          streamId,
          content,
          requestData,
          cancelReason,
        } = JSON.parse(message.toString());

        switch (type) {
          //send contribution request to another user
          case "add-contributor": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                }),
              );
            }

            // get receiver socket from Map
            const receiverSocket = connectedUsers.get(receiverId);

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

            const senderInfo = await prisma.user.findUnique({
              where: { id: ws.userId },
              select: {
                id: true,
                fullName: true,
                profileImage: true,
              },
            });
            if (!senderInfo)
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Sender not found",
                }),
              );

            // send ONLY to receiver
            receiverSocket.send(
              JSON.stringify({
                type: "contribution-request",
                from: senderInfo,
                link: coHostLink,
                streamId: streamId,
              }),
            );

            break;
          }

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

          case "send-message": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                }),
              );
            }

            const senderInfo = await prisma.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                fullName: true,
                profileImage: true,
              },
            });

            const receiverSocket = connectedUsers.get(receiverId);
            receiverSocket?.send(
              JSON.stringify({
                type: "new-message",
                message: content,
                senderInfo,
              }),
            );

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

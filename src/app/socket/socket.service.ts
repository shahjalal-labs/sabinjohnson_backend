import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./verifyToken";
import { parse } from "url";
import prisma from "../../shared/prisma";
import {
  approveRequest,
  getRidesharingById,
  sendRequestToRider,
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
        const { type, receiverId, coHostLink, streamId, content, requestData } =
          JSON.parse(message.toString());

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

              const ridesharing = await sendRequestToRider(userId, requestData);

              // send ONLY to receiver
              receiverSocket.send(
                JSON.stringify({
                  type: "ride-requests",
                  ridesharing,
                  message: "You have a new ride request",
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

              const receiverSocket = connectedUsers.get(requestData.userId);

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

              const ridesharing = await approveRequest(userId, requestData);

              const rideInfo = await getRidesharingById(requestData.id);

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
                  ridesharing,
                  message: "You accept the request",
                }),
              );
              ws.send(
                JSON.stringify({
                  type: "approved-ride-request",
                  rideInfo,
                  message: "You accept the request",
                }),
              );
              break;
            } catch (error) {
              console.log(error);
            }
            break;

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

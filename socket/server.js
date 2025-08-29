const { log } = require("console");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// store active users
const users = {};

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  // user register with a username
  socket.on("register", (username) => {
    console.log("user registered: ", username);
    users[socket.id] = { username, socketId: socket.id };

    // broadcast updated user to all clients
    io.emit("user_list", Object.values(users));
  });

  // Handle call initiation
  socket.on("call_user", (data) => {
    const { userToCall, from, signal } = data;

    io.to(userToCall).emit("incoming_call", {
      signal,
      from,
      callerName: users[socket.id]?.username,
    });
  });

  // Handle call acceptance
  socket.on("answer_call", (data) => {
    const { to, signal } = data;

    io.to(to).emit("call_accepted", {
      signal,
    });
  });

  // Handle call rejection
  // Expect data: { to: <callerSocketId>, reason }
  socket.on("reject_call", (data) => {
    const { to, reason } = data;
    console.log(`Call rejected by ${socket.id}, notifying caller ${to}`);

    if (to) {
      io.to(to).emit("call_rejected", {
        reason: reason || "Call rejected by user",
      });
    }
  });

  // Handle call end
  socket.on("end_call", (data) => {
    const { to } = data;

    if (to) {
      io.to(to).emit("call_ended");
    }
  });

  // Handle ICE candidates exchange
  socket.on("ice_candidate", (data) => {
    const { to, candidate } = data;

    if (to) {
      io.to(to).emit("ice_candidate", {
        candidate,
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user_list", Object.values(users));
  });
});

const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

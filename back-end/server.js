"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("connected", () => {
    console.log(`Socket ${socket.id} disconnected!`);
  });

  socket.on("joined", (newUser) => {
    console.log(`${newUser} joined the chat!`);
  });

  socket.on("left", (name) => {
    console.log(`${name} left the chat!`);
  });

  socket.on("disconnect", (name) => {
    console.log(`${name} disconnected!`);
  });
});

// End of the Socket

app.get("/", (req, res) => {
  res.send("Hello World");
});

const { User } = require("./models");
const { db } = require("./models");

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    // io.emit("message-added");
    res.status(200).json(user);
  } catch (error) {
    res.send(error);
  }
});

app.get("/messages", async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(200).json(user);
  } catch (error) {
    res.send(error);
  }
});

app.post("/user", async (req, res) => {
  try {
    const data = req.body;
    const check = await User.findOne({ where: { user: data.user } });
    if (check) {
      io.emit("joined", data.user);
      io.emit("message-added");
      res.status(200).json(check);
    } else {
      const newUser = await User.create(data);
      io.emit("joined", newUser.user);
      io.emit("message-added");
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.send(error);
  }
});

app.post("/user/:name", async (req, res) => {
  try {
    const name = req.params.name;
    io.emit("left", name);
    res.send(`${name} left the chat!`);
  } catch (error) {
    res.send(error);
  }
});

app.post("/messages", async (req, res) => {
  try {
    const data = req.body;
    if (data.message === "") {
      io.emit("message-added");
      console.log("Empty message");
      res.status(201).json(users);
    }
    const users = await User.findAll();
    await users.forEach(async (user) => {
      await user.update({
        messages: [
          ...user.messages,
          `${data.name}:${
            data.message
          }:status:unread:date:${Date.now()}:printDate:${new Date(
            Date.now()
          ).toLocaleString()}`,
        ],
      });
    });

    io.emit("message-added");

    res.status(201).json(users);
  } catch (error) {
    res.send(error);
  }
});

db.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server up and running on port ${PORT}`);
    });
  })
  .catch(console.error);





const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
 
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log('sdfsdfsd');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});




const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    console.log(users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log(userId);
  console.log("getUser");
  console.log(users.length);
  console.log(users);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
  console.log(users);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log("addUser");
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
   
    const user = getUser(receiverId);
    console.log(user);
    if (user!=undefined) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
   
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});


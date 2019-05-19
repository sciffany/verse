var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
app.use(express.static("public"));
var pug = require("pug");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/anagram", (req, res) => {
  res.render("anagram.pug");
});

app.get("/crypto", (req, res) => {
  res.render("crypto.pug");
});

// io.on("connection", socket => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
//   socket.on("create", room => {
//     socket.join(room);
//   });
//   socket.on("chat message", function(msg) {
//     console.log("message: " + msg);
//   });
//   socket.broadcast.emit("hi");
// });

http.listen(3000, function() {
  console.log("listening on 3000");
});

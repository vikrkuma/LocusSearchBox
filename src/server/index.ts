import express from "express";

__dirname = process.cwd();

const app = express();

app.get("/", function (_, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/public", express.static(__dirname + "/public"));

app.listen(5555, function () {
  console.log("Server Started on 5555!");
});

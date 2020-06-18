import express from "express";
import bodyParser from "body-parser";
import redis from "../redis-client";
import speechHelper from "../speech_helper";

const MAX_HISTORY_SIZE = 50;

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, authorization, dsi"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/hello", async (req, res) => {  console.log('Hello is called');
  res.send("Nice to meet you!");
});

app.get("/redis/id/:fullname", async (req, res) => {
  const fullname = req.params.fullname;
  const id = await redis.hget("id:lookup", fullname);
  res.send(id);
});

app.get("/redis/history/:username", async (req, res) => {
  const username = req.params.username;
  let data = await redis.lrange(username, 0, -1);
  res.send(data);
});

app.post("/redis/history/:username", async (req, res) => {
  const username = req.params.username;
  const body = JSON.stringify(req.body);
  let size = await redis.rpush(username, body);
  if (size > MAX_HISTORY_SIZE) {
    await redis.ltrim(username, -MAX_HISTORY_SIZE, -1);
    size = MAX_HISTORY_SIZE;
  } 
  res.json({size: size});
});

app.get("/speech/token", async (req, res) => {
  const token = await speechHelper.getToken();
  res.send(token);
});

export const path = "/api";
export const handler = app;

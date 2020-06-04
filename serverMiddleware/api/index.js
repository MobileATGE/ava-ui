import express from "express";
import bodyParser from "body-parser";
import redis from "../redis-client";

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

app.post("/redis/history/:username", async (req, res) => {
  const username = req.params.username;
  const body = req.body;
  const response = await redis.set(username, JSON.stringify(body));
  res.send("Success! 🎉\n");
});

export const path = "/api";
export const handler = app;

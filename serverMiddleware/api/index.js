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

app.get("/hello", async (req, res) => {
  res.send("Nice to meet you!");
});

app.post("/redis/data/:username", async (req, res) => {
  const username = req.params.username;
  const body = req.body;
  await redis.set(username, body);
  const value = await redis.get(username);
  console.log(value);
  res.send("Success! 🎉\n");
});

export const path = "/api";
export const handler = app;

require('dotenv').config();
require("dotenv").config();
const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
const client = new Client(config);

app.use(express.json());
app.use(middleware(config));

// Webhookリクエストを受け取る
app.post("/webhook", (req, res) => {
  const events = req.body.events;

  Promise.all(events.map(handleEvent))
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

// メッセージを処理する
async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  
  try {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: `「${event.message.text}」って言いましたね！`,
    });
  } catch (error) {
    console.error("Message reply failed", error);
    throw new Error("Message reply failed");
  }
}

app.listen(3000, () => console.log("Server running on port 3000"));
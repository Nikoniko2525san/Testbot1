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

app.post("/webhook", (req, res) => {
  const events = req.body.events;
  Promise.all(events.map(handleEvent)).then(() => res.sendStatus(200));
});

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: `「${event.message.text}」って言いましたね！`,
  });
}

app.listen(3000, () => console.log("Server running on port 3000"));
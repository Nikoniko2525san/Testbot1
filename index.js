// 必要なモジュールをインポート
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@line/bot-sdk');
require('dotenv').config();

// Expressの設定
const app = express();
const port = process.env.PORT || 3000;

// LINEのAPI設定
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

// ミドルウェア
app.use(bodyParser.json());

// イベントハンドラ
app.post('/webhook', (req, res) => {
  const events = req.body.events;
  Promise.all(events.map(handleEvent))
    .then(() => res.status(200).send('OK'))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// イベント処理
function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const echo = { type: 'text', text: event.message.text };
    return client.replyMessage(event.replyToken, echo);
  }
  return Promise.resolve(null);
}

// サーバー起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
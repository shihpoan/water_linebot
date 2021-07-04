let linebot = require('linebot');
let express = require('express');

// 初始化 line bot 需要的資訊，在 Heroku 上的設定的 Config Vars，可參考 Step2
let bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// 當有人傳送訊息給 Bot 時
bot.on('message', function (event) {
  // 回覆訊息給使用者 (一問一答所以是回覆不是推送)
  console.log(event);
  var msg = event.message.text;
  var id = event.message.id;
  event.reply(`媽我還不會打字啦嗚嗚`).then((data)=>{
    console.log(msg);
    setTimeout(()=>{
        var userId = 'Uf53deac4585024b18b8f0763cccf28d3';
        var sendMsg = '快教我打字';
        bot.push(userId,sendMsg);
        console.log('send: '+sendMsg);
    },5000);
  }).catch(error=>{
      console.log(error);
  });
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

// Bot 所監聽的 webhook 路徑與 port，heroku 會動態存取 port 所以不能用固定的 port，沒有的話用預設的 port 5000
bot.listen('/', process.env.PORT || 5000, function () {
  console.log('機器人上線啦！');
});
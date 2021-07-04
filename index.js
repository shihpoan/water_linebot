let linebot = require('linebot');
let express = require('express');
var getJSON = require('get-json');
const { response } = require('express');

// 初始化 line bot 需要的資訊，在 Heroku 上的設定的 Config Vars，可參考 Step2
let bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

var timer;
var pm = [];
_getJSON();

_bot();
// 當有人傳送訊息給 Bot 時
// bot.on('message', function (event) {
//   // 回覆訊息給使用者 (一問一答所以是回覆不是推送)
//   console.log(event);
//   var msg = event.message.text;
//   var id = event.source.userId;
//   event.reply(`媽我還不會打字啦嗚嗚`).then((data)=>{
//     console.log(msg);
//     setTimeout(()=>{
//         var userId = id;
//         var sendMsg = '快教我打字';
//         bot.push(userId,sendMsg);
//         console.log('send: '+sendMsg);
//     },5000);
//   }).catch(error=>{
//       console.log(error);
//   });
// });

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

// Bot 所監聽的 webhook 路徑與 port，heroku 會動態存取 port 所以不能用固定的 port，沒有的話用預設的 port 5000
bot.listen('/', process.env.PORT || 5000, function () {
  console.log('機器人上線啦！');
});

function _bot(){
    bot.on('message', (event)=>{
        if(event.message.type == 'text'){
            var msg = event.message.text;
            var replyMsg = '';
            if(msg.indexOf('PM2.5') != -1){ //indexOF == -1 代表尋找的東西不存在
                pm.forEach((e, i)=>{
                    //console.log(event);
                    if(msg.indexOf(e[0]) != -1){
                        replyMsg = e[0] + '的PM2.5數值是' + e[1];
                    }
                });
                if(replyMsg == ''){
                    replyMsg = '媽你打錯地址了';
                    console.log(e[0]);
                }
            }
            else{
                console.log(event);
                var msg = event.message.text;
                var id = event.source.userId;
                event.reply(`媽我還不會打字啦嗚嗚`).then((data)=>{
                    console.log(msg);
                    setTimeout(()=>{
                        var userId = id;
                        var sendMsg = '快教我打字';
                        bot.push(userId,sendMsg);
                        console.log('send: '+sendMsg);
                    },5000);
                }).catch(error=>{
                    console.log(error);
                });
            }

            event.reply(replyMsg).then((data)=>{
                console.log(replyMsg);
            }).catch((error)=>{
                console.log('error');
            });
        }
    });
}

//抓取pm2.5的JSON資料
function _getJSON(){
    clearTimeout(timer);
    getJSON('https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9&sort=ImportDate%20desc&format=json', function(error, response){
        response['records'].forEach(function(e, i){
            pm[i] = [];
            pm[i][0] = e.SiteName;
            pm[i][1] = e['PM2.5'] * 1;
            pm[i][2] = e.PM10 * 1;
        });
    });
    timer = setInterval(_getJSON, 1800000);
}
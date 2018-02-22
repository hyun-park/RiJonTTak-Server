var FCM = require('fcm-node');
var fs = require('fs');
var rawdata = fs.readFileSync('./credentials/RiJonTtak-fcm.json');
var serverKey = JSON.parse(rawdata)["server-key"];

var sendPush = function(fcmKey, msg){
    var pushData = {
        to: fcmKey,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        // notification: {
        //     title: "Hello Node",
        //     body: "Node로 발송하는 Push 메시지 입니다.",
        //     sound: "default",
        //     click_action: "FCM_PLUGIN_ACTIVITY",
        //     icon: "fcm_push_icon"
        // },
        // 메시지 중요도
        priority: "high",
        // App에게 전달할 데이터
        data: msg
    };

    /** 아래는 푸시메시지 발송절차 */
    var fcm = new FCM(serverKey);

    fcm.send(pushData, function(err, response) {
        if (err) {
            console.error('Push메시지 발송에 실패했습니다.');
            console.error(err);
            return;
        }

        console.log('Push메시지가 발송되었습니다.');
        console.log(response);
    });
};


module.exports = function(fcmKey, msg) {
    return sendPush(fcmKey, msg);
}
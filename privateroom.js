$(document).ready(function () {
    $(".header").load('./homepage.html');
    $("#video").load('./streamingvideo.html');

    chatlog = [];

    var firebaseConfig = {
        apiKey: "AIzaSyB-Y3xcqtL9lTYdWhO3cobxoHDhlD9xyUk",
        authDomain: "cs374-dp.firebaseapp.com",
        databaseURL: "https://cs374-dp.firebaseio.com",
        projectId: "cs374-dp",
        storageBucket: "cs374-dp.appspot.com",
        messagingSenderId: "170901201583",
        appId: "1:170901201583:web:bc3ec2869361d7dd0cea5a",
        measurementId: "G-71SP52TR8F"
    };

    function writeToDatabase(writer,content) {
        var newmsg = firebase.database().ref('/privatechat/').push();
        let today = new Date();
        newmsg.set({
            title: getData("title"),
            host : getData("host"),
            hour: today.getHours(),
            min : today.getMinutes(),
            writer: writer,
            content: content,
        });
    }



    function doesFileExist(urlToFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', urlToFile, false);
        xhr.send();
         
        if (xhr.status == "404") {
            return false;
        } else {
            return true;
        }
    }

    function getData(param) {
        var url = location.href;
        var params = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
        for (var i = 0; i < params.length; i++) {
            let tmp = params[i].split('=')[0];
            if (tmp.toUpperCase() == param.toUpperCase()) {
                return decodeURIComponent(params[i].split('=')[1]);
            }
        }

    }

    function initRoom() {
        let title = getData("title");
        let host = getData("host");
        let secure = getData("option");
        let prfLink = './images/profile/profile_'+host+'.png';
        let chk = doesFileExist(prfLink);
        if(!chk) {
            prfLink = './images/profile/profile_default.png';
        }
        let roomtitle = document.getElementById("roomTitle");
        roomtitle.innerHTML = '<img src = "'+prfLink+'"  height="40px" class = "lcklogo">';
        roomtitle.innerHTML += '<span style = "margin : 10px">'+title+'</span>';
        roomtitle.innerHTML += '<span style = "float : right; font-size : large">host : '+host+'</span>';
    }

    function readFromDatabase() {
        let msgdiv = document.getElementById("msglog");
        msgdiv.innerHTML = "";
        return firebase.database().ref('/privatechat/').once('value',function(snapshot) {
          var myValue = snapshot.val();
          var keyList = Object.keys(myValue);
          var cnt = 0;
          for(var i = 0; i<keyList.length; i++) {
            var myKey = keyList[i];
            if(myValue[myKey].title != getData("title") || myValue[myKey].host != getData("host")) {
                continue;
            }
            let msg = document.createElement("div");
            msg.className = "msg";
            let time;
            if(myValue[myKey].hour < 10) {
                time = "0" + myValue[myKey].hour+":";
            } else {
                time = myValue[myKey].hour+":";
            }
            if(myValue[myKey].min < 10) {
                time += "0" + myValue[myKey].min;
            } else {
                time += myValue[myKey].min;
            }
            
            msg.innerHTML = myValue[myKey].content + "-" + myValue[myKey].writer + " at " + time;
            msgdiv.appendChild(msg);

          }
  
        });
      }


    function submitMsg() {
        let inputBox = document.getElementById("message_data");
        if(inputBox.value == "") {
            return;
        }
        writeToDatabase("Me",inputBox.value);
        readFromDatabase();
        inputBox.value = "";
    }

    function bindEvents() {
        var sendBtn = document.getElementById("message_button");
        sendBtn.onclick = function() {
            submitMsg();
        }
    }

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    //showMsg();
    readFromDatabase();
    initRoom();
    bindEvents();

});

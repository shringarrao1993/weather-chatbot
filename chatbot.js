
var conditionString;
var speechString;
var text = null;
var flag = 0;
var additionText;
var diaResponse;
var http;
var counter = 0;
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;
//on loading the window
$(window).load(function () {
    $messages.mCustomScrollbar();
    setTimeout(function () {
        fakeMessage();
        //userTextTry(flag);
    }, 100);
});
// for updating scroll bar
function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}
// to function is to set date
function setDate() {
    d = new Date()
    if (m != d.getMinutes()) {
        m = d.getMinutes();
        $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
}
//after inserting a message in a message-box
/*function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 1000 + (Math.random() * 20) * 100);
}*/

//on submiting message and clicking enter it calls insertMessage function.

//onclick function
$('.message-submit').click(function () {
  if (text == null){
    flag = 0;
    console.log("start here");
    //fetches the input value and creates a chat card
    text = $('.message-input').val();
    console.log("The text is 1:" + text);
    $('<div class="message message-personal"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
    //calls the main function
    console.log("calling user try 1");
    userTextTry();
    //console.log("calling user try 2");
    //userTextTry();
    //clear the input value
    $('.message-input').val('');

  } else {
    console.log("The flag value is: "+flag);
    additionText = $('.message-input').val();
    $('<div class="message message-personal"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span>' + additionText + '</div>').appendTo($('.mCSB_container')).addClass('new');
    text = text + " " + additionText;
    dialogFlowGet(text);
    $('.message-input').val('');
    /*if (flag > 2){
      text = null;
    }*/
  }

});

// on pressing the enter key
/*$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    userTextTry();
    return false;
  }
})*/

var Fake = [
    'Hello, How can I help you?',
    'Nice to meet you',
    'How are you?',
    'Not too bad, thanks'
]

function fakeMessage() {
    if ($('.message-input').val() != '') {
        return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();

    setTimeout(function () {
        $('.message.loading').remove();
        $('<div class="message new"><figure class="avatar"><img src="img/chat_logo.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        updateScrollbar();
        i++;
    }, 1000 + (Math.random() * 20) * 100);

}



function userTextTry() {

    //alert(text);

    //calling post function
    console.log("function call 1");
    dialogFlowGet(text);
    //dialogFlowPost(text);
    //dialogFlow(text);
    //window.setTimeout(dialogFlow(text), 2500);

};

function dialogFlowPost(text) {
    http = new XMLHttpRequest();
    var num = Math.floor(Math.random() * 90000) + 10000;
    var url = 'https://api.dialogflow.com/v1/query?v=20150910';
    var dataPostBody = {
        "contexts": [
            "shop"
        ],
        "lang": "en",
        "query": "Weather in Berlin today",
        "sessionId": "12345"
    }
    dataPostBody.query = text;
    dataPostBody.sessionId = num.toString();
    //console.log("The query is 2: ");
    //console.log(dataPostBody.query);
    var postBodyString = JSON.stringify(dataPostBody);
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Authorization', 'Bearer 54185c9cb2894ff9af002a9c0174ffa1');
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            //console.log("The http response is: 3 ");
            // console.log(http.responseText);
            // console.log("the post is hit here 4");

            diaResponse = http.responseText;
            // console.log("The diaResponse is 5:");
            //  console.log(diaResponse);
            event.preventDefault();
            //  console.log(typeof(diaResponse));
            var diaResponseJson = JSON.parse(diaResponse);
            conditionString = diaResponseJson.result.metadata.intentName;
            //  console.log("The intent is 6:");
            //  console.log(conditionString);
            /* if (conditionString == "Weather") {
            //     console.log("7");
                 accuWeather();
             } else {
                 ///defaultWeather();
            //     console.log("Will call default weather 7");
             }*/
            diaResponse = null;
        }

    };
    http.send(postBodyString);
};

function dialogFlowGet(text) {
    http = new XMLHttpRequest();
    var num = Math.floor(Math.random() * 90000) + 10000;
    var url = 'https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=' + text + '&sessionId=' + num + '&timezone=Germany/Berlin';
    console.log("text is: " + text);
    http.open('GET', url, true);
    http.setRequestHeader('Authorization', 'Bearer 54185c9cb2894ff9af002a9c0174ffa1');
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log("The http response is: 3 ");
            console.log(http.responseText);
            console.log("the post is hit here 4");

            diaResponse = http.responseText;
            console.log("The diaResponse is 5:");
            console.log(diaResponse);
            event.preventDefault();
            console.log(typeof (diaResponse));
            var diaResponseJson = JSON.parse(diaResponse);
            conditionString = diaResponseJson.result.metadata.intentName;
            speechString = diaResponseJson.result.fulfillment.speech;
            console.log("The intent is 6:");
            console.log(conditionString);

            accuWeather(conditionString);

            diaResponse = null;
        }

    };
    http.send();
}

function accuWeather(conditionString) {
    var data = new XMLHttpRequest();

    data.onreadystatechange = function () {
        if (data.readyState == 4 && data.status == 200) {
            var accJSONobj = JSON.parse(data.response);
            console.log(accJSONobj);


            var final_temp_min = accJSONobj.DailyForecasts[0].Temperature.Minimum.Value;
            var final_temp_max = accJSONobj.DailyForecasts[0].Temperature.Maximum.Value;
            var final_sunrise = accJSONobj.DailyForecasts[0].Sun.Rise;
            var final_sunSet = accJSONobj.DailyForecasts[0].Sun.Set;
            var final_temp_feel_max = accJSONobj.DailyForecasts[0].RealFeelTemperature.Maximum.Value;
            var final_temp_feel_min = accJSONobj.DailyForecasts[0].RealFeelTemperature.Minimum.Value;
            var final_rain_prob = accJSONobj.DailyForecasts[0].Day.RainProbability;
            var final_snow_prob = accJSONobj.DailyForecasts[0].Day.SnowProbability;
            var final_precipitation_prob = accJSONobj.DailyForecasts[0].Day.PrecipitationProbability;
            var final_ice_prob = accJSONobj.DailyForecasts[0].Day.IceProbability;
            var final_windspeed = accJSONobj.DailyForecasts[0].Day.Wind.Speed.Value;

            var riseSlice = final_sunrise.slice(11, 16);
            var setSlice = final_sunSet.slice(11, 16);

            var accuVariable_final_temp_min = "Min Temperature is : " + final_temp_min + "C <br />";
            var accuVariable_final_temp_max = "Max Temperature is : " + final_temp_max + "C <br />";
            var accuVariable_final_sunrise = "SunRise : " + riseSlice + "<br />";
            var accuVariable_final_sunSet = " SunSet : " + setSlice + "<br />";
            var accuVariable_final_temp_feel_max = " Max Real Feel Temperature is : " + final_temp_feel_max + "C" + "<br />";
            var accuVariable_final_temp_feel_min = " Min Real Feel Temperature is : " + final_temp_feel_min + "C" + "<br />";
            var accuVariable_final_rain_prob = " Rain Probability is : " + final_rain_prob + "%" + "<br />";
            var accuVariable_final_snow_prob = " Snow Probability is : " + final_snow_prob + "%" + "<br />";
            var accuVariable_final_precipitation_prob = " Precipitation Probability is : " + final_precipitation_prob + "%" + "<br />";
            var accuVariable_final_hail_prob = " Hail Probability is : " + final_ice_prob + "%" + "<br />";
            var accuVariable_final_windspeed = " Wind Speed is : " + final_windspeed + "km/h";

             if (conditionString == "Weather" && !speechString.includes("place") && !speechString.includes("time")) {

                var accuVariable = accuVariable_final_temp_min + accuVariable_final_temp_max + accuVariable_final_sunrise + accuVariable_final_sunSet + accuVariable_final_temp_feel_max + accuVariable_final_temp_feel_min + accuVariable_final_rain_prob + accuVariable_final_snow_prob + accuVariable_final_windspeed;
                cardPrint(accuVariable);
                text = null;

                    //Below function is if the temperature, place and time is correctly specified
            } else if (conditionString == "Temperature" && !speechString.includes("place") && !speechString.includes("time")) {

                var tempVariable = accuVariable_final_temp_min + accuVariable_final_temp_max + accuVariable_final_temp_feel_max + accuVariable_final_temp_feel_min;
                cardPrint(tempVariable);
                text = null;
                    //Below function is if the place is not correctly specified
            }else if (conditionString == "Sun" && text.includes("rise") && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_sunrise);
                text = null;
            }
            else if (conditionString == "Sun" && text.includes("set") && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_sunSet);
                text = null;
            } else if (conditionString == "Sun" && !text.includes("set") && !text.includes("rise") && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_sunrise + accuVariable_final_sunSet);
                text = null;
            }  else if (conditionString == "Snow" && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_snow_prob);
                text = null;
            } else if (conditionString == "Rain" && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_rain_prob);
                text = null;
            } else if (conditionString == "Precipitation" && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_precipitation_prob);
                text = null;
            } else if (conditionString == "Hail" && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_hail_prob);
                text = null;
            } else if (conditionString == "Wind_speed" && !speechString.includes("place") && !speechString.includes("time")) {

                cardPrint(accuVariable_final_windspeed);
                text = null;
            } else if (speechString.includes("place") || speechString.includes("time")){

              //flag = flag + 1;
              cardPrint(speechString);
              //additionTextFunction();

            } else if (conditionString == "Default Fallback Intent"){

                /*cardPrint(speechString);
                var cardElements = document.getElementsByClassName("message message-personal new");
                var cardSize = cardElements.length;
                cardElements[cardSize-1] + cardElements[cardSize-2];
                */
                cardPrint(speechString);

            }

        }
    };
    data.open('GET', "http://dataservice.accuweather.com/forecasts/v1/daily/1day/171708?apikey=rlm9YVvd3xjLQGJ9RBvNWRH6pnM1nUG4&details=true&metric=true", true);
    data.send();
};

/*function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
    setTimeout(function() {
      accuWeather();
    }, 1000 + (Math.random() * 20) * 100);
  }*/

function defaultWeather() {
    var diaResponseJson = JSON.parse(diaResponse);
    conditionString = diaResponseJson.result.metadata.intentName;
    document.getElementById("Default").innerHTML = conditionString;

    document.getElementById("TempMin").innerHTML = "";
    document.getElementById("TempMax").innerHTML = "";
    document.getElementById("Headline").innerHTML = "";
    document.getElementById("Category").innerHTML = "";
    document.getElementById("Date").innerHTML = "";
    document.getElementById("SunRise").innerHTML = "";
    document.getElementById("SunSet").innerHTML = "";
    document.getElementById("RealFeelMax").innerHTML = "";
    document.getElementById("RealFeelMin").innerHTML = "";
    document.getElementById("RainProb").innerHTML = "";
    document.getElementById("SnowProb").innerHTML = "";
    document.getElementById("windspeed").innerHTML = "";
}

function cardPrint(variable){
    $('<div class="message loading new"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
                updateScrollbar();

                setTimeout(function () {
                    $('.message.loading').remove();
                    $('<div class="message new"><figure class="avatar"><img src="img/chat_logo.png" /></figure>' + variable + '</div>').appendTo($('.mCSB_container')).addClass('new');
                    setDate();
                    updateScrollbar();
                    i++;
                }, 1000 + (Math.random() * 20) * 100);

}

function checkPlaceTime(){
    if (speechString.includes("place") || speechString.includes("time") ){
        cardPrint(speechString);
    }
}

function additionTextFunction(){
  $('.message-submit').click(function () {
      additionText = $('.message-input').val();
      $('<div class="message message-personal"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
      text = text + " " + additionText;
      dialogFlowGet(text);
      $('.message-input').val('');
  });
}

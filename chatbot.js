
var conditionString;
var speechString;
var text = null;
var flag = 0;
var additionText;
var diaResponse;
var diaResponseJson;
var http;
var time;
var place;
var number;
var accuLocationID;
var accuLocationJSONobj;
var counter = 0;
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;
//on loading the window
$(window).load(function () {
    $messages.mCustomScrollbar();
    setTimeout(function () {
        fakeMessage();
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

//onclick function
$('.message-submit').click(function () {
    if (text == null || text == "") {
        flag = 0;
        //fetches the input value and creates a chat card
        text = $('.message-input').val();
        $('<div class="message message-personal"><figure class="avatar1"><img src="img/team.png" /></figure><span></span>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
        //calls the main function
        setDate();
        userTextTry();
        //clear the input value
        $('.message-input').val('');

    } else {
        additionText = $('.message-input').val();
        $('<div class="message message-personal"><figure class="avatar1"><img src="img/team.png" /></figure><span></span>' + additionText + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        text = text + " " + additionText;
        dialogFlowGet(text);
        $('.message-input').val('');
    }

});

// on pressing the enter key
$(window).on('keydown', function (e) {
    if (e.which == 13) {
        if (text == null || text == "") {
            flag = 0;
            //fetches the input value and creates a chat card
            text = $('.message-input').val();
            $('<div class="message message-personal"><figure class="avatar1"><img src="img/team.png" /></figure><span></span>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
            //calls the main function
            setDate();
            userTextTry();
            //clear the input value
            $('.message-input').val('');

        } else {
            additionText = $('.message-input').val();
            $('<div class="message message-personal"><figure class="avatar1"><img src="img/team.png" /></figure><span></span>' + additionText + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            text = text + " " + additionText;
            dialogFlowGet(text);
            $('.message-input').val('');

        }
        return false;
    }
})

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

    //calling post function
    dialogFlowGet(text);

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
    var postBodyString = JSON.stringify(dataPostBody);
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Authorization', 'Bearer 54185c9cb2894ff9af002a9c0174ffa1');
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            diaResponse = http.responseText;
            event.preventDefault();
            var diaResponseJson = JSON.parse(diaResponse);
            conditionString = diaResponseJson.result.metadata.intentName;
            diaResponse = null;
        }

    };
    http.send(postBodyString);
};

function dialogFlowGet(text) {

    if (text == "") {
        cardPrint("Please type your message and hit the send button");
    }
    http = new XMLHttpRequest();
    var num = Math.floor(Math.random() * 90000) + 10000;
    var url = 'https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=' + text + '&sessionId=' + num + '&timezone=Germany/Berlin';
    http.open('GET', url, true);
    http.setRequestHeader('Authorization', 'Bearer 54185c9cb2894ff9af002a9c0174ffa1');
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {


            diaResponse = http.responseText;

            event.preventDefault();

            var diaResponseJson = JSON.parse(diaResponse);
            conditionString = diaResponseJson.result.metadata.intentName;
            speechString = diaResponseJson.result.fulfillment.speech;
            place = diaResponseJson.result.parameters["geo-city"];
            time = diaResponseJson.result.parameters.time;
            number = diaResponseJson.result.parameters.number;



            if (speechString.includes("place") || speechString.includes("city") || speechString.includes("time") || conditionString == "Default Fallback Intent" || conditionString == "Default Welcome Intent" || diaResponseJson.result.action.includes("smalltalk")) {

                accuWeather('171708');
            }

            else {
                getAccuLocationID();

            }

            diaResponse = null;

        }

    };
    http.send();
}

function getAccuLocationID() {
    var dataLocationKey = new XMLHttpRequest();

    dataLocationKey.onreadystatechange = function () {
        if (dataLocationKey.readyState == 4 && dataLocationKey.status == 200) {
            accuLocationJSONobj = JSON.parse(dataLocationKey.response);

            accuLocationID = accuLocationJSONobj[0].Key;

            if (time == "today") {
                accuWeather(accuLocationID);
            } else {
                openWeatherMap();
            }

        }
    };
    dataLocationKey.open('GET', "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=rlm9YVvd3xjLQGJ9RBvNWRH6pnM1nUG4&q=" + place + "&language=en-us", true);
    dataLocationKey.send();
}

function accuWeather(accuLocationID) {

    var dataAccuWeather = new XMLHttpRequest();
    var urlAccu = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/" + accuLocationID + "?&apikey=rlm9YVvd3xjLQGJ9RBvNWRH6pnM1nUG4&details=true&metric=true";
    dataAccuWeather.open('GET', urlAccu, true);
    dataAccuWeather.onreadystatechange = function () {
        if (dataAccuWeather.readyState == 4 && dataAccuWeather.status == 200) {
            var accJSONobj = JSON.parse(dataAccuWeather.response);


            accuAppropriatePrint(accJSONobj);

        }
    };

    dataAccuWeather.send();

}

function openWeatherMap() {
    var dataOpenWeather = new XMLHttpRequest();
    var url = "https://community-open-weather-map.p.rapidapi.com/forecast?q=" + place + "&units=metric";
    dataOpenWeather.open('GET', url, true);
    dataOpenWeather.setRequestHeader('X-RapidAPI-Key', '2ca62a3fadmsh88190a092f022e7p18ab19jsn070537c6a2b0');
    dataOpenWeather.onreadystatechange = function () {//Call a function when the state changes.
        if (dataOpenWeather.readyState == 4 && dataOpenWeather.status == 200) {

            var OpenWeatherResponse = dataOpenWeather.responseText;
            //console.log(OpenWeatherResponse);
            var OpenWeatherResponseJson = JSON.parse(OpenWeatherResponse);

            openWeatherAppropriatePrint(OpenWeatherResponseJson);
        }

    };
    dataOpenWeather.send();
}

function cardPrint(variable) {
    $('<div class="message loading new"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();
    if (conditionString == "Default Fallback Intent" || conditionString == "Default Welcome Intent" || speechString.includes("place") || speechString.includes("time")) {
        setTimeout(function () {
            $('.message.loading').remove();
            $('<div class="message new"><figure class="avatar"><img src="img/chat_logo.png" /></figure>' + variable + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            updateScrollbar();
            i++;
        }, 1000); //+ (Math.random() * 20) * 100);
    } else {
        setTimeout(function () {
            $('.message.loading').remove();
            $('<div class="message new"><figure class="avatar"><img src="img/chat_logo.png" /></figure>' + variable + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            updateScrollbar();
            i++;
        }, 1000); //+ (Math.random() * 20) * 100);
    }

}

function checkPlaceTime() {
    if (speechString.includes("place") || speechString.includes("time")) {
        cardPrint(speechString);
    }
}

function additionTextFunction() {
    $('.message-submit').click(function () {
        additionText = $('.message-input').val();
        $('<div class="message message-personal"><figure class="avatar"><img src="img/chat_logo.png" /></figure><span></span>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
        text = text + " " + additionText;
        dialogFlowGet(text);
        $('.message-input').val('');
    });
}

function accuAppropriatePrint(accJSONobj) {

    var printMessage = 'The ' + conditionString + ' details in ' + place + ' for ' + number + ' ' + time + ':<br />';

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

    var weatherHeading = "Weather Details : <br><hr>";
    var tempText = "<i><b>TEMPERATURE</b></i><br/>";
    var accuVariable_final_temp_min = "-Min Temperature is : " + final_temp_min + " °C <br />";
    var accuVariable_final_temp_max = "-Max Temperature is : " + final_temp_max + " °C <br />";
    var sunText = "<i><b>SUN</b></i><br/>";
    var accuVariable_final_sunrise = "-SunRise at : " + riseSlice + "<br />";
    var accuVariable_final_sunSet = " -SunSet at : " + setSlice + "<br />";
    var realText = "<i><b>REAL FEELS</b></i><br/>";
    var accuVariable_final_temp_feel_max = "-Max Real Feel Temperature is : " + final_temp_feel_max + " °C" + "<br />";
    var accuVariable_final_temp_feel_min = "-Min Real Feel Temperature is : " + final_temp_feel_min + " °C" + "<br />";
    var probText = " <i><b>PROBABILITY</b></i><br/>";
    var accuVariable_final_rain_prob = "-Rain Probability is : " + final_rain_prob + " % " + "<br />";
    var accuVariable_final_snow_prob = "-Snow Probability is : " + final_snow_prob + " % " + "<br />";
    var accuVariable_final_precipitation_prob = "-Precipitation Probability is : " + final_precipitation_prob + " % " + "<br />";
    var accuVariable_final_hail_prob = "-Hail Probability is : " + final_ice_prob + " % " + "<br />";
    var accuVariable_final_windspeed = "-Wind Speed is : " + final_windspeed + "km/h";


    var textSunRise = weatherHeading + accuVariable_final_sunrise;
    var textSunSet = weatherHeading + accuVariable_final_sunSet;
    var textRiseSet = weatherHeading + accuVariable_final_sunrise + accuVariable_final_sunSet;
    var textSnowProb = weatherHeading + accuVariable_final_snow_prob;
    var textRainProb = weatherHeading + accuVariable_final_rain_prob;
    var textPrecProb = weatherHeading + accuVariable_final_precipitation_prob;
    var textHailProb = weatherHeading + accuVariable_final_hail_prob;
    var textWindSpeed = weatherHeading + accuVariable_final_windspeed;


    if (conditionString == "Weather" && !speechString.includes("place") && !speechString.includes("city") && !speechString.includes("time")) {

        var accuVariable = printMessage + weatherHeading + tempText + accuVariable_final_temp_min + accuVariable_final_temp_max + sunText + accuVariable_final_sunrise + accuVariable_final_sunSet + realText + accuVariable_final_temp_feel_max + accuVariable_final_temp_feel_min + probText + accuVariable_final_rain_prob + accuVariable_final_snow_prob + accuVariable_final_windspeed;
        cardPrint(accuVariable);
        text = null;

        //Below function is if the temperature, place and time is correctly specified
    } else if (conditionString == "Temperature" && !speechString.includes("place") && !speechString.includes("time")) {

        var tempVariable = printMessage + weatherHeading + accuVariable_final_temp_min + accuVariable_final_temp_max + accuVariable_final_temp_feel_max + accuVariable_final_temp_feel_min;
        cardPrint(tempVariable);
        text = null;
        //Below function is if the place is not correctly specified
    } else if (conditionString == "Sun" && text.includes("rise") && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textSunRise);
        text = null;
    }
    else if (conditionString == "Sun" && text.includes("set") && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textSunSet);
        text = null;
    } else if (conditionString == "Sun" && !text.includes("set") && !text.includes("rise") && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textRiseSet);
        text = null;
    } else if (conditionString == "Snow" && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textSnowProb);
        text = null;
    } else if (conditionString == "Rain" && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textRainProb);
        text = null;
    } else if (conditionString == "Precipitation" && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textPrecProb);
        text = null;
    } else if (conditionString == "Hail" && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textHailProb);
        text = null;
    } else if (conditionString == "Wind_speed" && !speechString.includes("place") && !speechString.includes("time")) {

        cardPrint(printMessage + textWindSpeed);
        text = null;
    } else if (speechString.includes("place") || speechString.includes("city") || speechString.includes("time")) {

        //flag = flag + 1;
        cardPrint(speechString);
        //additionTextFunction();

    } else if (conditionString == "Default Fallback Intent") {

        /*cardPrint(speechString);
        var cardElements = document.getElementsByClassName("message message-personal new");
        var cardSize = cardElements.length;
        cardElements[cardSize-1] + cardElements[cardSize-2];
        */
        cardPrint(speechString);

    } else if (conditionString == "Default Welcome Intent") {

        cardPrint(speechString);
        text = null;
    }
    else if (diaResponseJson.result.action.includes("smalltalk")) {

        cardPrint(speechString);
        text = null;
    }
}

function openWeatherAppropriatePrint(OpenWeatherResponseJson) {

    var printMessage = 'The ' + conditionString + ' details in ' + place + ' for ' + number + ' ' + time + ':<br />';

    cardPrint(printMessage);

    var index = 0;
    var looper = 0;
    var multiplier = 0;
    var loopLength;
    var i = 0;
    var weather = "";

    if (time == "tomorrow") {
        index = 2;
        looper = 1;
        multiplier = 1;
        i = 1;
    } else if (time.includes("week")) {
        index = 1;
        looper = 7;
        i = 0;
        if (number == null || number == "") {
            multiplier = 1;
        } else {
            multiplier = number;
        }
    } else {
        index = 1;
        looper = 1;
        i = 0;
        if (number == null || number == "") {
            multiplier = 1;
        } else {
            multiplier = number;
        }
    }

    loopLength = (index * looper * multiplier) - 1;

    //cardPrint('The ' + conditionString + ' details in ' + place + ' for ' + number + ' ' + time + ':<br />');

    for (i; i <= loopLength; i++) {

        var final_temp_min = OpenWeatherResponseJson.list[i].main.temp_min;
        var final_temp_max = OpenWeatherResponseJson.list[i].main.temp_max;
        var final_temp = OpenWeatherResponseJson.list[i].main.temp;
        var final_humidity = OpenWeatherResponseJson.list[i].main.humidity;
        var final_pressure = OpenWeatherResponseJson.list[i].main.pressure;
        var final_sea_level = OpenWeatherResponseJson.list[i].main.sea_level;
        var final_weather_main = OpenWeatherResponseJson.list[i].weather[0].main;
        var final_weather_description = OpenWeatherResponseJson.list[i].weather[0].description;
        var final_clouds = OpenWeatherResponseJson.list[i].clouds.all;
        var final_windspeed = OpenWeatherResponseJson.list[i].wind.speed;
        var final_wind_deg = OpenWeatherResponseJson.list[i].wind.deg;

        var weatherHeading = "Weather Details : <br><hr>";
        var accuVariable_final_weather_main = "-The weather looks : " + final_weather_main + "<br />";
        var accuVariable_final_weather_description = "-The weather looks : " + final_weather_description + "<br />";
        var tempText = "<i><b>TEMPERATURE</b></i><br/>";
        var accuVariable_final_temp = "-Temperature is : " + final_temp + " °C <br />";
        var accuVariable_final_temp_min = "-Min Temperature is : " + final_temp_min + " °C <br />";
        var accuVariable_final_temp_max = "-Max Temperature is : " + final_temp_max + " °C <br />";
        var humidityText = "<i><b>HUMIDITY</b></i><br/>";
        var accuVariable_final_humidity = "-Humidity is : " + final_humidity + "<br />";
        var pressureText = "<i><b>PRESSURE</b></i><br/>";
        var accuVariable_final_pressure = "-Pressure is: " + final_pressure + "<br />";
        var seaText = "<i><b>SEA LEVEL</b></i><br/>";
        var accuVariable_final_sea_level = "-Sea level is: " + final_sea_level + "<br />";
        var probText = " <i><b>PROBABILITY</b></i><br/>";
        var accuVariable_final_clouds = "-Cloud Probability is : " + final_clouds + " % " + "<br />";
        var windText = " <i><b>WIND DETAILS</b></i><br/>";
        var accuVariable_final_windspeed = "-Wind Speed is : " + final_windspeed + "km/h" + "<br />";
        var accuVariable_final_winddeg = "-Wind Degree is : " + final_wind_deg + "degrees";


        var textWeather = weatherHeading + accuVariable_final_weather_main + accuVariable_final_weather_description;
        var textTemperature = tempText + accuVariable_final_temp + accuVariable_final_temp_min + accuVariable_final_temp_max;
        var defaultText = "We dont provide that information for multiple days<br /> We only have the following details:<br />" + humidityText + accuVariable_final_humidity + pressureText + accuVariable_final_pressure + seaText + accuVariable_final_sea_level + probText + accuVariable_final_clouds;
        var textWindSpeed = windText + accuVariable_final_windspeed + accuVariable_final_winddeg;


        if (conditionString == "Weather" && !speechString.includes("place") && !speechString.includes("time")) {

            var j = i + 1;
            cardPrint("Day " + j + ": " + textWeather);
            text = null;
            //Below function is if the temperature, place and time is correctly specified
        } else if (conditionString == "Temperature" && !speechString.includes("place") && !speechString.includes("time")) {

            //var tempVariable =  weatherHeading + accuVariable_final_temp_min + accuVariable_final_temp_max + accuVariable_final_temp_feel_max + accuVariable_final_temp_feel_min;
            var j = i + 1;
            cardPrint("Day " + j + ": " + textTemperature);
            text = null;
            //Below function is if the place is not correctly specified
        } else if (conditionString == "Wind_speed" && !speechString.includes("place") && !speechString.includes("time")) {

            var j = i + 1;
            cardPrint("Day " + j + ": " + textWindSpeed);
            text = null;
        } else {
            var j = i + 1;
            cardPrint("Day " + j + ": " + defaultText);
            text = null;
        }

    }


}



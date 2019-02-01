//var APP_ID = 'amzn1.ask.skill.eea5d54f-9d79-4c03-9e84-e99afb892b72';
var APP_ID = 'amzn1.ask.skill.2abcbdb3-2b64-46d0-9c9a-4f02c986d640';
var AlexaSkill = require('./AlexaSkill');
var ROSLIB = require('roslib')


var ros = new ROSLIB.Ros({
    url : 'ws://43d8eed4.ngrok.io'
});

var talk = 'not connected';
ros.on('connection', function() {
    console.log('Connected to websocket server.');
    talk = 'connected to octopus';
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    console.log('Connection to websocket server closed.');
});

var speech = new ROSLIB.Topic({
    ros : ros,
    name : '/speech_recognition',
    messageType : 'std_msgs/String' 
});

var helpText = "I can tell her to either walk, sit or stand. You can also be nice by saying hi. Which one do you want?";

var TM = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TM.prototype = Object.create(AlexaSkill.prototype);
TM.prototype.constructor = TM;

TM.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Session Started");
};

TM.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechOutput = "Hello, I am Nao's friend!, " + helpText;
    var repromptText = helpText;
	
    response.ask(speechOutput, repromptText);
};

TM.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Session Closed");
};

TM.prototype.intentHandlers = {
    "AMAZON.StopIntent": function (intent, session, response) {
        var msg = new ROSLIB.Message({
            data : 'sit' // intent.slots.Message.value
        });
        
        speech.publish(msg);
        response.tell('Nao, Sit');
	    response.ask('');
    },
    
    "AMAZON.HelpIntent": function (intent, session, response) {
        var msg = new ROSLIB.Message({
            data : 'stand' // intent.slots.Message.value
        });
        
        speech.publish(msg);
        response.tell('stand');
	    response.ask('');
    },
    //"AMAZON.StopIntent": function (intent, session, response) {
    //    response.tell('good night');
    //},
    "AMAZON.CancelIntent": function (intent, session, response) {
        var msg = new ROSLIB.Message({
            data : 'walk' // intent.slots.Message.value
        });
        speech.publish(msg);
        response.tell('Nao! Please start walking');
        response.ask('');
    },
        "AMAZON.NavigateHomeIntent": function (intent, session, response) {
        var msg = new ROSLIB.Message({
            data : 'hi' // intent.slots.Message.value
        });
        speech.publish(msg);
        response.tell('Seems like you got your self a friend! Shorty');
        response.ask('');
    },
    "AMAZON.forwardIntent": function (intent, session, response) {
        var msg = new ROSLIB.Message({
            data : 'move forward' // intent.slots.Message.value
        });
        speech.publish(msg);
        response.tell('moving forward');
        response.ask('');
    }
};


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the TM skill.
    var tm = new TM();
    console.log('WFSFSDFS');
    console.log('WFSFSDFS');
    tm.execute(event, context);
};

// 
var $dOut = $('#date'),
    $hOut = $('#hours'),
    $mOut = $('#minutes'),
    $sOut = $('#seconds'),
    $ampmOut = $('#ampm');
var months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

var days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

function update(){
  var date = new Date();
  
  var ampm = date.getHours() < 12
             ? 'AM'
             : 'PM';
  
  var hours = date.getHours() == 0
              ? 12
              : date.getHours() > 12
                ? date.getHours() - 12
                : date.getHours();
  
  var minutes = date.getMinutes() < 10 
                ? '0' + date.getMinutes() 
                : date.getMinutes();
  
  var seconds = date.getSeconds() < 10 
                ? '0' + date.getSeconds() 
                : date.getSeconds();
  
  var dayOfWeek = days[date.getDay()];
  var month = months[date.getMonth()];
  var day = date.getDate();
  var year = date.getFullYear();
  
  var dateString = dayOfWeek + ', ' + month + ' ' + day + ', ' + year;
  
  $dOut.text(dateString);
  $hOut.text(hours);
  $mOut.text(minutes);
  $sOut.text(seconds);
  $ampmOut.text(ampm);
} 

update();
window.setInterval(update, 1000);

var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
updateTime();
function updateTime() {
    var cd = new Date();
    clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
    clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
};

function zeroPadding(num, digit) {
    var zero = '';
    for(var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}
 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDvIW0dlVW1EYkFU8eQlUHl4nyOubzcpCM",
    authDomain: "train-f8519.firebaseapp.com",
    databaseURL: "https://train-f8519.firebaseio.com",
    projectId: "train-f8519",
    storageBucket: "",
    messagingSenderId: "817567863041"
  };
  firebase.initializeApp(config);

var dataRef = firebase.database();

// Initial Values
var Train = "";
var Destination = "";
var firstTime = "";
var Frequency = "";

// Capture Button Click
$("#add-train").on("click", function() {

Train = $("#train-input").val().trim();
Destination = $("#destination-input").val().trim();
firstTime = moment($("#time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
Frequency = $("#frequency-input").val().trim();

	// Push
  dataRef.ref().push({

    Train: Train,
    Destination: Destination,
    firstTime: firstTime,
    Frequency: Frequency,
    // dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

// console.log successful add
console.log("train added");

// clear text
$("#train-input").val("");
$("#destination-input").val("");
$("#time-input").val("");
$("#frequency-input").val("");

   // No refresh
  return false;
  });

// firebase event for when user add train data
  dataRef.ref().on("child_added", function(childSnapshot, prevChildKey) {


  // storing into variables
  var tTrain = childSnapshot.val().Train;
  var tDestination = childSnapshot.val().Destination;
  var tFrequency = childSnapshot.val().Frequency;
  var tFirstTime = childSnapshot.val().firstTime;

 // calculate the frequency time
var differenceInTime = moment().diff(moment.unix(tFirstTime), "minutes");
var tRemainder = moment().diff(moment.unix(tFirstTime), "minutes") % tFrequency;
var tMinutes = tFrequency - tRemainder;

// calculate arrival time
var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

console.log(tMinutes);

// add train data to html table
$("#Schedule > tbody").append("<tr><td>" + tTrain + "</td><td>" + tDestination + "</td><td>" + tFrequency + " min</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});

 
$(document).ready(function() {
    // initialize firebase


    var config = {
        apiKey: "AIzaSyBVaU9GeZpepaCpzKhC6hD5a85Uq2kbG4w",
        authDomain: "train-schedule-13462.firebaseapp.com",
        databaseURL: "https://train-schedule-13462.firebaseio.com",
        projectId: "train-schedule-13462",
        storageBucket: "train-schedule-13462.appspot.com",
        messagingSenderId: "514028467740"
    };
    // Initialize Firebase
    firebase.initializeApp(config);

    // a var to represent the database
    var database = firebase.database();

    // button to submit the user given info
    $("#trainInfoBtn").on("click", function(event) {
        event.preventDefault(); //no button reset
        console.log("hi");
        //set user input values to variables
        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();

        //converts user input to usable info
        var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("X");

        var frequency = $("#freq").val().trim();

        //current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // console.log(trainName);
        // console.log(destination);
        // console.log(firstTime);
        // console.log(frequency);
        // console.log(currentTime);



        //gathers together all our new train info
        var newTrain = {

            train: trainName,
            trainGoing: destination,
            trainComing: firstTime,
            everyXMin: frequency
        };


        //uploads newTrain to firebase
        database.ref().push(newTrain);
        //*push* adds to info already in firebase. *set* overwrites preexisting info

        //clears elements before adding new text
        $("#name").val("");
        $("#dest").val("");
        $("#firstTime").val("");
        $("#freq").val("");

        //supposed to prevent from moving to a new page... idk how
        return false;

    }); //end of onclick

    //figure out what this does
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
        //store in variables
        var trainName = childSnapshot.val().train;
        var destination = childSnapshot.val().trainGoing;
        var firstTime = childSnapshot.val().trainComing;
        var frequency = childSnapshot.val().everyXMin;

        // 		console.log(trainName);
        // 		console.log(destination);
        // 		console.log(firstTime);
        // 		console.log(frequency);
        var timeArr = firstTime.split(":");

        //makes first train time neater
        var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]); //calculate difference between times
        var difference = moment().diff(trainTime, "minutes");
        console.log(difference);
        //time apart(remainder)
        var trainRemain = difference % frequency;

        console.log("helltrain");
        console.log(frequency);
        console.log(trainRemain);
        //minutes until arrival
        var minUntil = frequency - trainRemain;

        //next arrival time
        var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');
        console.log("something")
            //adding info to DOM table 
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");

    });
});
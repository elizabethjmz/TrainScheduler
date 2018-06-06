/**************** GLOBAL VARIABLES ****************/

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAOFZUiETdPDG6hyMZrSpoFlYUKkciF2Rw",
        authDomain: "trainscheduler-3bddf.firebaseapp.com",
        databaseURL: "https://trainscheduler-3bddf.firebaseio.com",
        projectId: "trainscheduler-3bddf",
        storageBucket: "",
        messagingSenderId: "681959393805"
    };

    firebase.initializeApp(config);

    var database = firebase.database();


/******************* FUNCTIONS *******************/
    //Function to display trains added to train scheduler table
    var display = function () {
        
        $(".add_new").empty();
        
        database.ref("/Trains").on("child_added", function(snapshot){
          
            var tFrequency = snapshot.val().frequency;
            console.log(tFrequency);

            // First Train
            var firstTime = snapshot.val().firstTrain;
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

            // Current Time
            var currentTime = moment();

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

            // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;

            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");

            var newRow = $("<tr>");
            var newTd = "<th>"+ snapshot.val().trainName + "</th>" + "<td>"+ snapshot.val().destination + "</td>" + "<td>"+ snapshot.val().frequency + "</td>"  + "<td>"+ moment(nextTrain).format("LT") + "</td>" + "<td>"+ tMinutesTillTrain + "</td>";
            newRow.append(newTd);
            $(".add_new").append(newRow);
        });

    }

/********************* CALLS *********************/
display();

$("#submit").on("click", function(){

    event.preventDefault();
    //Get values from input fields
    var trainName = $("#train_name").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = $("#frequency").val().trim();
    var firstTrain = $("#start_time").val().trim();
    //Add values to firebase
    database.ref("/Trains").push( {
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrain : firstTrain,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  
    display();
    //To clear fields after submit
    $("#train_name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#start_time").val("");
  
  });
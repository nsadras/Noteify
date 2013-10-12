var dancer = new Dancer();
var array = 0;
var note;
var notes = [{scientific: function(){return "R";}, "duration": 1}];
var index = 0;
var prev2 = "";
var scientific = "";
var pause_count = 0;
var last_time = 0;
var last_note = 0;
var last_ampl = 0.000001;
var MIN_LENGTH = 8;
var VOLUME_THRESHOLD = .01;
// var SAMPLING_RATE = 22050; //change this to your computer's sampling rate
var SAMPLING_RATE = 24000; //change this to your computer's sampling rate

var LOW_NOTE = "C4", HIGH_NOTE = "C6";


// These are the final results
var notesarr = [];
var durations = [];

// This starts the playing/parsing
function getNotes(url, callback) {
  // dancer.load({ src: '/data/?file=' + url });
  // dancer.setVolume(0);
  dancer.load({ src: url }); //TODO remove
  dancer.play();

  dancer.after(0, function(){
  // console.log(dancer.getSpectrum());
  array = dancer.getSpectrum();
  console.log(dancer.getTime());
  if(last_time == dancer.getTime())
    pause_count++;
  last_time = dancer.getTime();

  var merged = false;
  var temp = fuzzy_index(array);
  var freq = temp[0] * SAMPLING_RATE / 512, ampl = temp[1];

////
  var note;
  if(freq == 0 || isNaN(freq)){
    note = {scientific: function(){return "R";}};
  } else{
    note = teoria.note.fromFrequency(freq).note;
  }

  console.log(note.scientific());

  if(note.scientific() != last_note || // if new note
    (ampl - last_ampl) / last_ampl > 3){ // or 3 times louder

    // create new note
    index++;
    notes[index] = {"note": note, "duration" : 1};

    // maybe save current note
    // debugger;
    if(index > 1 && notes[index-1].duration >= MIN_LENGTH && ((QUARTER > 0) || last_note != 0)){
      if(QUARTER < 0){
        QUARTER = notes[index].duration;
      }

      var temp = parseNote(notes[index]);
      callback(temp[0], temp[1]);
    }
  } else{
    // increment current note
    notes[index].duration++;
  }
  last_note = note.scientific();
  last_ampl = ampl;

  if(pause_count > 10 || dancer.getTime() > 30){
    dancer.pause();
    return;
  }


////
  //console.log(freq);
  // if(!isNaN(freq) && freq > 0){
  //   pause_count = 0;
  //   note = teoria.note.fromFrequency(freq);
  //   if(scientific == note.note.scientific()){
  //     notes[index]["duration"] += 1; 
  //     console.log(scientific);
  //   } else {
  //     index++;
  //     scientific = note.note.scientific() + "\t~" + result[1];
  //     notes[index] = {};
  //     notes[index]["note"] = scientific;
  //     notes[index]["duration"] = 1;
  //     console.log(note.note.scientific());

  //     if(notes[index-1].duration >= MIN_LENGTH){
  //       document.writeln(notes[index-1].note + "--" + notes[index-1].duration + "\n");
  //     }
  //   }
  // } else{
  //   if(freq == 0){
  //     console.log("gap");
  //     index++;
  //     notes[index] = {};
  //     notes[index]["note"] = "tongue";
  //     notes[index]["duration"] = 1;
  //     scientific = 0;

  //     if(notes[index-1].duration >= MIN_LENGTH){
  //       document.writeln(notes[index-1].note + "--" + notes[index-1].duration + "\n");
  //     }
  //   }

  //   if(pause_count > 30 || dancer.getTime() > 10){
  //     dancer.pause();
  //     // console.log("FILTERED, BITCHEEEEES!!!!");
  //     filter(notes);
  //     convert(notes)
  //     for(var i = 0; i < notesarr.length; i++){
  //       console.log(notesarr[i][0] + " " + durations[i]);
  //     }
  //     callback(notesarr, durations);
  //   }
  // }
  });

function parseNote(note){
  //figure out length
  var length;
  if(note.duration < QUARTER * 0.5){
    length = '8';
  } else if(note.duration < QUARTER * 1.5){
    length = 'q';
  } else if(note.duration < QUARTER * 3){
    length = 'h';
  } else{ //if(note.duration < QUARTER * 5){
    length = 'w';
  }

  if(note.note.scientific() == "R"){
    return ["c/5", length + "r"];
  } else{
    return [process(note.note.scientific()), length];
  }
}

// function filter(array){

//   for(var i = 1; i < array.length; i++){
//     //console.log(array[i]["duration"]);
//     if(array[i]["duration"] < MIN_LENGTH && array[i]["note"] != "tongue"){
//       array.splice(i,1);
//       if(i > 1 && array[i]["note"] == array[i-1]["note"]){ //merge
//         array[i]["duration"] += array[i-1]["duration"];
//         array.splice(i-1,1);
//       }
//       i--;
//     }
//   }
//   for(var i = 1; i < array.length; i++){
//     if(array[i]["note"] == "tongue"){
//       array.splice(i,1);
//       i--;
//     }
//   }
//     //return array;
//   }
  function fuzzy_index(array){
    var max = 0;
    var a = 0;
    for(var i = 0; i < array.length; i++){
      if(array[i] > max){
        max = array[i];
        a = i;
      }
    }
    if(array[a] < VOLUME_THRESHOLD){
      return[0, 0];
    }
    var b = a + (array[a+1] > array[a-1] ? 1 : -1);
    return [(array[a] * a + array[b] * b) / (array[a] + array[b]), array[a] + array[b]];
  }

  var QUARTER = -1;

  // function convert(array){
  //   // hackily sets quarter note length to the second item.
  //   // QUARTER = notes[2].duration;
  //   for(var i = 1; i < array.length; i++){
  //     var note = notes[i];
  //     console.log(note);
  //     notesarr[i-1] = [process(note.note)];
  //     if(note.duration < QUARTER * 0.5){
  //       durations[i-1] = '8';
  //     } else if(note.duration < QUARTER * 1.5){
  //       durations[i-1] = 'q';
  //     } else if(note.duration < QUARTER * 3){
  //       durations[i-1] = 'h';
  //     } else if(note.duration < QUARTER * 5){
  //       durations[i-1] = 'w';
  //     }
  //   }
  // }

  // Converts A5 to a/5
  function process(note){
    note = note.toLowerCase();
    return note.slice(0, -1) + '/' + (parseInt(note.slice(-1)));
  }
}

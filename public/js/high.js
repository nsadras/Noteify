var dancer = new Dancer();
var note;
var notes = [{scientific: function(){return "R";}, "duration": 1}];
var index = 0;
var pause_count = 0;
var last_time = 0;
var last_note = 0;
var last_ampl = 0.000001;
var MIN_LENGTH = 8;
var VOLUME_THRESHOLD = .01;
var QUARTER = -1;
// var SAMPLING_RATE = 22050; //change this to your computer's sampling rate
var SAMPLING_RATE = 24000; //change this to your computer's sampling rate

// This starts the playing/parsing
function getNotes(url, callback) {
  // dancer.load({ src: '/data/?file=' + url });
  // dancer.setVolume(0);
  console.log("HI");
  dancer.load({ src: url }); //TODO remove
  dancer.play();

  dancer.after(0, function(){
  // console.log(dancer.getSpectrum());
  var array = dancer.getSpectrum();
  // console.log(dancer.getTime());
  if(last_time == dancer.getTime())
    pause_count++;
  last_time = dancer.getTime();

  var merged = false;
  var temp = fuzzy_index(array);
  var freq = temp[0] * SAMPLING_RATE / 512, ampl = temp[1];

  var note;
  if(freq == 0 || isNaN(freq)){
    note = {scientific: function(){return "R";}};
  } else{
    note = teoria.note.fromFrequency(freq).note;
  }

  // console.log(note.scientific());

  if(note.scientific() != last_note || // if new note
    (ampl - last_ampl) / last_ampl > 3){ // or 3 times louder

    // create new note
    index++;
    notes[index] = {"note": note, "duration" : 1};

    // maybe save current note
    // debugger;
    var last = notes[index-1];
    if(index > 1 && last.duration >= MIN_LENGTH && ((QUARTER > 0) || last_note != 0)){
      if(QUARTER < 0 && last.note.scientific() != "R"){
        QUARTER = last.duration;
        console.log("~~~~~" + last.note.scientific() + QUARTER + "~~~~~")
      }
      console.log(last.note.scientific(), last.duration);

      var temp = parseNote(last);
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

  // Converts A5 to a/5
  function process(note){
    note = note.toLowerCase();
    return note.slice(0, -1) + '/' + (parseInt(note.slice(-1)) - 1);
  }
}

var Cfg = {'thumbnail_width':200};
var video_id = "";
var video_title = "";

//gets the video details, called if there is a valid id
function getVideoDetails(id) {
	var url = generateUrl(id);
	$.ajax(
		{
			"url":url,
			"dataType":"xml",
			"success": updateVideoContents,
      "error": showErrorMessage
		}
	);
}

function showErrorMessage(data) {
  console.log("ERROR");
  $('.videocontents').attr('style', "min-height:190px");
  $('.videothumbnail').text("");
  $('.videothumbnail').append("<img src='/images/sadface.jpg' width='200'></img>");
  $('.videodetails').text("");
  $('.videodetails').append("<p>Oops! Something went wrong, most likely an invalid video link. Please enter a valid video link.</p>");
  $('#facebookG').addClass('inactive');
}

//updates the contents on the task screen
function updateVideoContents(data) {
  console.log("SUCCESS");
	var title = $(data).find("title:first").text();
  video_title = title;
	var duration = $(data).find("content").eq(2).attr('duration');
	var thumbnail_url = $(data).find("thumbnail").eq(0).attr('url');
	var thumbnail_height = $(data).find("thumbnail").eq(0).attr('height');
	var thumbnail_width = $(data).find("thumbnail").eq(0).attr('width');
	var height = thumbnail_height * Cfg['thumbnail_width'] / thumbnail_width;
	$('.videocontents').attr('style', 'min-height:' + height + 'px');
  $('.videodetails').attr('style', 'min-height:' + height + 'px');
	$('.videocontents').removeClass('inactive');
	$('.videothumbnail').text("");
	$('.videodetails').text("");
	$('.videothumbnail').append("<img src='" + thumbnail_url + "' width='200'></img>")
	$('.videodetails').append("<p><b>Title:</b> " + title + "</p>");
	$('.videodetails').append("<p><b>Duration:</b> " + duration + " seconds</p>");
  $('.videodetails').append("<button value='Noteify!' class='submitbutton'>Noteify!</button>");
  $('.submitbutton').click(
    submitData
  );
  $('#facebookG').addClass('inactive');
}

// function that is called when the submit button is pressed
function submitData() {
  $(".videocontents").addClass('inactive');
  $(".searchbar").attr("readonly", "readonly");
  $("#facebookG").removeClass('inactive');
  $(".logospacer").addClass('inactive');
  $.ajax( 'score', {
    data:{'url': "http://www.youtube.com/watch?v=" + video_id},
    dataType:"JSON",
    type:"GET",
    success: function(data) {
      getNotes(data.musicUrl, function(notes, durations) {
        $(".reloadbuttondiv").removeClass('inactive');
        $(".canvasdiv").removeClass("inactive");
        drawSheetMusic(notes, durations);
      });
    }
  });
}

/*************** SEARCHBAR JAVASCRIPT **********/

//generates the url to get data from
function generateUrl(id) {
	return "https://gdata.youtube.com/feeds/api/videos/" + id;
}

//grabs the id from the search bar and returns it, or returns an empty string if there is none
function processSearchBar() {
  var text = $('.searchbar').val();
  if(text.indexOf('youtube.com/watch?v=') == -1) {
    return "";
  }
  else {
    return text.substring(text.indexOf('watch?v=') + 8,text.indexOf('watch?v=') + 19);
  }
}

//initializes the searchbar logic for parsing ids
$(document).ready(
  function() {
  $('.searchbar').on('input',
	  function() {
      id = processSearchBar();
      if(id != "") {
        $('#facebookG').removeClass('inactive');
        getVideoDetails(id);
        video_id = id;
      }
		}
  )
});


var noteQueue = [];
var durationQueue = [];
var stanzaIndex = 0;
var durationQueueLength = 0;
function addNoteAndDuration(note, duration) {

}

function durationMapper(duration) {
  if(duration == "8" || duration == "8r") {

  }
  if(duration == "q" || duration == "qr") {

  }
  if(duration == "h" || duration == "hr") {
    
  }
}

//draws the sheet music!
function drawSheetMusic(notes, durations) {
  // var stanza = 0;
  // for(var i = 0; i < notes.length; i++) {
  // var notes = data['notes']
  // var durations = data['durations']

  // var notes = [["a/4"],["b/4"],["c/4"],["d/4"],["c/4"],["f/4"],["e/4"],["g/4"],["a/4"],["c/5"],["e/5"],["e/5"]];
  // var durations = ["q", "q", "h", "q", "qr", "q","q","w","q","hr","q","q"];

  // }
  $('#facebookG').addClass('inactive');
  $(".searchbar").addClass('inactive');
  $('.sheetmusictitlediv').append("<p class='sheetmusictitle'>" + video_title + "</p>");
    // var notesarr = [["c/4"],["d/4"],["b/4"],["e/4"]];
    // var notesarr = [["c/5"],["g/4"],["a/4"],["g/4"]];
    // var durations = ["q", "q", "qr", "q"];
    // drawStanza(notesarr, durations, 0);
  var index = 0;
  var currentDuration = 0;
  var stanzaNotes = [];
  var stanzaDurations = [];

  //iterates through an array of stanzas and durations and draws the sheet music!
  for(var i = 0; i < notes.length; i++) {
    var noteDuration = durations[i];
    var note = notes[i];
    stanzaNotes.push(note);
    if(noteDuration == "q" || noteDuration == "qr") {
      currentDuration++;
      stanzaDurations.push(noteDuration);
    }
    else if(noteDuration == "h" || noteDuration == "hr") {
      if(currentDuration == 3) {
        currentDuration++;
        if(noteDuration == "h") {
          stanzaDurations.push("q");
          durations[i] = "q";
        }
        else {
          stanzaDurations.push("qr");
          durations[i] = "qr";
        }
        i--;
      }
      else {
        currentDuration+=2;
        stanzaDurations.push(noteDuration);
      }
    }
    else if(noteDuration == "w" || noteDuration == "wr") {
      if(currentDuration != 0) {
        currentDuration = 4;
        //TODO: Do SEGMENTING OF WHOLE NOTES
      }
      else {
        stanzaDurations.push(noteDuration);
        currentDuration += 4;
      }
    }

    if(currentDuration == 4) {
      drawStanza(stanzaNotes, stanzaDurations, index);
      index++;
      stanzaNotes = [];
      stanzaDurations = [];
      currentDuration = 0;
    }
  }

  if(currentDuration != 4) {
    var remainingDuration = 4 - currentDuration;

    var lastDuration = "";
    var lastNote = ["g/4"];
    stanzaNotes.push(lastNote);
    if(remainingDuration == 1) {
      lastDuration = "qr";
    }
    else if(remainingDuration == 2) {
      lastDuration = "hr";
    }
    else {
      stanzaDurations.push("hr");
      lastDuration = "qr";
      stanzaNotes.push(lastNote);
    }
    stanzaDurations.push(lastDuration);
    drawStanza(stanzaNotes, stanzaDurations, index);
  }
}

function drawStanza(stanzaNotes, stanzaDurations, number)
{
  var notes = [];
  for(var i = 0; i < stanzaNotes.length; i++) {
    notes.push(new Vex.Flow.StaveNote({keys:stanzaNotes[i], duration:stanzaDurations[i]}));
  }

  var id = "canvas" + number;
  $(".canvasdiv").append("<canvas width='550' height='100' id='" + id + "'>");
  var id_string = "#" + id;
  var canvas = $(id_string)[0];
  var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
  var ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(10, 0, 500);
  stave.addClef("treble").setContext(ctx).draw();
  // Create a voice in 4/4
  // if(endStanza) {
  //   var barEnd = new Vex.Flow.BarNote();
  //   stave.addModifier("barnote").setContext(ctx).draw();
  // }

  var voice = new Vex.Flow.Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });
  // Add notes to voice
  voice.addTickables(notes);
  // Format and justify the notes to 500 pixels
  var formatter = new Vex.Flow.Formatter().
    joinVoices([voice]).format([voice], 500);
  // Render voice
  voice.draw(ctx, stave);
}

// $(document).ready(
//   function() {
//     $(".canvasdiv").removeClass("inactive");
//     var notes = [["c/4"],["d/4"],["b/4"],["e/4"],["f/4"]];
//     var durations = ["q", "q", "qr", "8", "8"];
//     for(var i = 0; i < 5; i++) {
//       drawStanza(notes, durations, i);  
//     }
//   }
// );
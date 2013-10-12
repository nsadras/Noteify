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
  $(".canvasdiv").removeClass("inactive");
  $(".videocontents").addClass('inactive');
  $(".searchbar").attr("readonly", "readonly");
  $("#facebookG").removeClass('inactive');
  $(".reloadbuttondiv").removeClass('inactive');
  $(".logospacer").addClass('inactive');
  // $.ajax(
  //   {
  //     data:{'video_id':video_id},
  //     dataType:"JSON",
  //     type:"POST",
  //     success:drawSheetMusic
  //   }
  // );
  drawSheetMusic(5);

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

//draws the sheet music!
function drawSheetMusic(notes) {
  // var stanza = 0;
  // for(var i = 0; i < notes.length; i++) {

  // }
  $('#facebookG').addClass('inactive');
  // $(".searchbar").removeAttr("readonly");
  $(".searchbar").addClass('inactive');
  $('.sheetmusictitlediv').append("<p class='sheetmusictitle'>" + video_title + "</p>");
    var notesarr = [["c/4"],["d/4"],["b/4"],["e/4"]];
    var durations = ["q", "q", "qr", "q"];
    drawStanza(notesarr, durations, 0);
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
//     var notes = [["c/4"],["d/4"],["b/4"],["e/4"]];
//     var durations = ["q", "q", "qr", "q"];
//     for(var i = 0; i < 5; i++) {
//       drawStanza(notes, durations, i);  
//     }
//   }
// );
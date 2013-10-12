var Cfg = {'thumbnail_width':200};
var video_id = "";

//gets the video details, called if there is a valid id
function getVideoDetails(id) {
	var url = generateUrl(id);
	$.ajax(
		{
			"url":url,
			"dataType":"xml",
			"success": updateVideoContents
		}
	);
}

//updates the contents on the task screen
function updateVideoContents(data) {
	var title = $(data).find("title:first").text();
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
  console.log("HELLO");
  $(".videocontents").addClass('inactive');
  $(".searchbar").attr("readonly", "readonly");
  $("#facebookG").removeClass('inactive');
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
function fillInVideoRow(response){
		$(response).find("atom\\:entry, entry").each(function(index){
			  var $entry = $(this);
			  var entry = $entry[0];
			  var id =  videoIdArray[index];
			  var duration = $(entry.getElementsByTagNameNS('http://gdata.youtube.com/schemas/2007', 'duration')[0]).attr("seconds");
			  var title = $(entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'title')[0]).text();
			  var description = $(entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'description')[0]).text();
			  var $row = $("#video-row-"+id);
			  
			  if (typeof duration == "undefined") {
				  duration = 0;
				  title = "這部影片不存在";
				  description = "";
				  $row.find("span.row-image>img").attr("src", "/img/404-anime-girl.jpg");
			  }
			  $row.find("span.video-time").text(toSimpleTime(duration));
			  $row.find("div.line-title").text(title);
			  $row.find("div.line-description").text(description);
		  });
	}
function onYoutubeApiLoad() {
	$(document).ready(function(){
		youtubeBatchProcessing(videoIdArray, fillInVideoRow);
});	
}
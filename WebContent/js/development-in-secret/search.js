function getVideoIdArrayFromUrl(){
	videoIdArray = [];
	
	if (window.location.toString().indexOf('?') != -1) {
		var para = window.location.toString().split('?')[1].split('&');
		for(var i = 0;i < para.length;i++){
			if(para[i].match(/^v=/)){
				videoIdArray.push(para[i].split("=")[1]);
			}
		}
	}
	
	return videoIdArray;
}


function makeVideoRow(index,id, duration, title, description, searchResponse){
	  var domString = '<div id="video-row-' 
	                + id 
	                + '" class="video-row"><span class="row-image"><img style="width:120px;height:90px;" src="http://img.youtube.com/vi/'
	                + id
	                +'/mqdefault.jpg"><span class="video-time">'
	                + toSimpleTime(duration)
	                +'</span></span><div class="row-middle"><div class="row-line line-title">'
	                + title+'</div><div class="row-line line-description">'
	                + description 
	                +'</div></div><div class="row-right"><div class="row-line line-like"></div><div class="row-line line-author"></div></div></div></div>';
	  $videoRow =  $(domString);
	  if($.inArray( id , searchResponse.inDatabase) != -1){
		  $videoRow.find("div.row-middle").append($('<a href="/learn/'+id+'/'+searchResponse.index[index]+'"><div class="line-action">勉強</div></a>'));
		  $videoRow.find("div.row-right div.line-like").text(searchResponse.view[index]+" 次觀看");
		  $videoRow.find("div.line-author").html(searchResponse.author[index]+" 編");
	  }else {
		  $videoRow.find("div.row-middle").append($('<a href="/edit/'+id+'"><div class="line-action">編輯</div></a>'));
		  $videoRow.find("div.row-right div.line-like").text("0  次觀看");
		  $videoRow.find("div.line-author").text("未編輯");
		  
	  }
	  return $videoRow;

	}



function appendVideoRow(response){
	var notEditedVideos = [];
	$(response).find('atom\\:entry, entry').each(function(index){
		  var $entry = $(this);
		  var entry = $entry[0];
		  var id =  videoIdArray[index];
		  var duration = $(entry.getElementsByTagNameNS('http://gdata.youtube.com/schemas/2007', 'duration')[0]).attr("seconds");
		  var title = $(entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'title')[0]).text();
		  var description = $(entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'description')[0]).text();
		  var isInDatabase = false;
		  for (var i = 0;i < searchResponse.inDatabase.length;i++){
			  if (searchResponse.inDatabase[i] == id) {
				  makeVideoRow(i,id, duration, title, description, searchResponse).appendTo("#container");
				  isInDatabase = true;
			  }
		  }
		  if (!isInDatabase) {
			  notEditedVideos.push(makeVideoRow(index,id, duration, title, description, searchResponse));
		  }
	  });
	
	for(var i = 0;i < notEditedVideos.length;i++){
		notEditedVideos[i].appendTo("#container");
	}
	setUpSearchPager();
	
}

function youtubeV3BatchProcessing(videoIdArray){
	var keyword = $("#keyin").val();
	var request = gapi.client.youtube.search.list({
	    q: keyword,
	    part: 'snippet',
	    type: 'video',
	    maxResults : 50,
	    order : 'relevance',
	    videoDuration : 'medium'

	  });
	request.execute(function(response){
		if(response.items){
			var notEditedVideos = [];
			var inDataBaseIndex = 0;
	        for(var i = 0; i < response.items.length;i++){
	        	var index = videoIdArray.indexOf(response.items[i].id.videoId);
	        	if (index != -1) {
	        		var id =  response.items[i].id.videoId;
	      		  	var duration = '5'; // because there's not duration in item
	      		  	var title = response.items[i].snippet.title;
	      		  	var description = response.items[i].snippet.description;
	      		  if($.inArray( id , searchResponse.inDatabase) != -1){
	      			  makeVideoRow(inDataBaseIndex,id, duration, title, description, searchResponse).appendTo("#container");
	      			  inDataBaseIndex++;
	      		  }else {
	      			  notEditedVideos.push(makeVideoRow(-1,id, duration, title, description, searchResponse)); 			  
	      		  }	        		
	        	}  
	          }
	        for(var i = 0;i < notEditedVideos.length;i++){
	    		notEditedVideos[i].appendTo("#container");
	    	}
	        }
		
		
	});
}



function setUpSearchPager() {
	var keyin = $("#keyin").val();
	if ( isYoutubeUrl(keyin) || keyin == "") return;

	var request = gapi.client.youtube.search.list({
	    q: keyin,
	    part: 'snippet',
	    type: 'video',
	    maxResults : 50,
	    order : 'relevance',
	    videoDuration : 'medium'

	  });
	request.execute(function(response){
		if(response.items){
			var numberInPage = 5;
			var boxIndex = 0;
			var linkPrefix = "/search?";
			var link = linkPrefix;
			var videoIdArray = getVideoIdArrayFromUrl();
			for (var i = 0;i < response.items.length;i++) {
				boxIndex++;
				link += ("v=" + response.items[i].id.videoId + "&");
				if (boxIndex % numberInPage == 0) {
					link += ("q=" + keyin);
					var $node = $("#pager-box-prototype").clone().attr("id", "");
					$node.attr("href", link);
					$node.find("span").text((boxIndex/numberInPage));
					if ($.inArray(response.items[i].id.videoId, videoIdArray) != -1)$node.css("background-color", "#bbb");
					$node.show().appendTo($("#pager"));
					link = linkPrefix;
				}
				
			}
	        
	    }
		
		
	});
	
}


function onYoutubeApiLoad() {
	// youtube api is loaded, then make sure DOM is OK
	$(document).ready(function(){
		videoIdArray = getVideoIdArrayFromUrl();
		//youtubeV3BatchProcessing(videoIdArray);
		// because Youtube V3 api cannot get duration from search.list api,not shift now, use atom+xml v2 api
		youtubeBatchProcessing(videoIdArray, appendVideoRow);

	});	
}


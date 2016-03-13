function makeEntry(videoId){
	return '<entry><id>http://gdata.youtube.com/feeds/api/videos/'+videoId+'?v=2</id></entry>'; 
}

function youtubeBatchProcessing(videoIdArray, callback){
	var requestString = '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:batch="http://schemas.google.com/gdata/batch" xmlns:yt="http://gdata.youtube.com/schemas/2007"><batch:operation type="query" />';
	for(var i = 0;i < videoIdArray.length;i++){
		requestString += makeEntry(videoIdArray[i]);
	}	
	requestString += '</feed>';
	$.ajax({
		  type: "POST",
		  url: 'http://gdata.youtube.com/feeds/api/videos/batch',
		  data:requestString,
		  dataType:"xml",
		  contentType:"application/atom+xml",
		  success: callback
		});
}

function iso8601TimeToSeconds(time){
	indexOfM = time.indexOf("M");
	minute = parseInt(time.substring(2, indexOfM));
	second = parseInt(time.substring(indexOfM+1));
	return minute*60+second;
}

function sendUrlToServer(videoId, response){
	if(videoId == "null" || !response.items)return;
	setupYoutubePlayer(videoId);
    $.post( "/youtubeurl", {videoId : videoId, title: response.items[0].snippet.title, description : response.items[0].snippet.description, duration : toSimpleTime(iso8601TimeToSeconds(response.items[0].contentDetails.duration)) } , drawVisibleWaveform, "json");
}

function drawVisibleWaveform(ret){
  if(ret.status == "fail"){
	if (ret.reason == "too long"){
		$("#announcement-text").text("影片時間超過10分鐘！暫不支援。");
	} else {
		$("#announcement-text").text(decodeURIComponent(ret.reason));
	}
	$("#screen").add("#announcement").fadeIn("fast");
	$("#loading").hide();
    //var reasonNode = decodeURIComponent(ret.reason).replace(/\+/g, " ").replace(/\\/g, '');
    //$("#graph").html("status:" + ret.status + "<br> reason:"+  reasonNode+ "<br>");// may customize to different error output
    return;
  }
  /* <MSAR> 
  if (ret.data.id) {
	  youtube.videoId = ret.data.id;
	  youtube.player.loadVideoById(ret.data.id);
	  youtube.player.pauseVideo();
  }
  /* <MSAR> */
  waveform.data = ret.data;

  var size = { width: 1000, height: 280 };
  size.width = waveform.data.min.length || size.width;
  var scaleFactor = size.height/65536.0;

  var NS="http://www.w3.org/2000/svg";
  var svg=document.getElementById("svg");
  svg.setAttribute("width", size.width);
  svg.setAttribute("height", size.height);
  //graph.insertBefore(svg, graph.childNodes[0]);

  
  waveform.timelineNode = $("<div id='timeline-offset'></div>").width(1).height($("#svg").height()).prependTo("#graph");
  //$("<div id='select-area'></div>").width(0).height($("#svg").height()).prependTo("#graph");
  $("<div id='select-area-start' class='select-line'></div><div id='select-area'></div><div id='select-area-end' class='select-line'></div>").width(0).height($("#svg").height()).prependTo("#graph");
  $("#select-area-start").mousedown(function(){waveform.isSelectAreaStartMouseDown = true;});
  $("#select-area-end").mousedown(function(){waveform.isSelectAreaEndMouseDown = true;});
  waveform.globalSvg = document.getElementById("svg");
  waveform.globalGraph = $("#graph");
  waveform.svgOriginalWidth = size.width;
  waveform.endNodeIndex = waveform.globalGraph.width();

  for(var i = 0; i < waveform.globalGraph.width();i++){
    svgRect = document.createElementNS(NS,"rect");
    svgRect.setAttributeNS(null,"x",i);
    svgRect.setAttributeNS(null,"y",size.height/2-waveform.data.max[i]*scaleFactor);
    svgRect.setAttributeNS(null,"width",1);
    svgRect.setAttributeNS(null,"height",(Math.abs(waveform.data.min[i])+waveform.data.max[i])*scaleFactor);
    svg.appendChild(svgRect);
  }

  
  
  $("#edit").show();
  $("#timestamp").show();
  $("#control").show();
  $("#svg").show();
  
  placeTimeStamp(100, waveform.data.sample_rate, waveform.data.samples_per_pixel, waveform.data.duration, waveform.data.number_of_channel);
  verticalScaleHandler(41, $("#vertical-scale div.scale-bar"));
  
  

  restoreSubtitles(ret.subtitles);
  if (ret.isPublic) {
	  $("#publish").tooltip( "option", "content", "取消發佈" );
	  $("#publish-mask").show();
  }
   
  $("#loading").hide();
  
  
  if (edit.currentEditIndex > 0)changeRowFocus(getSubtitleRow(edit.currentEditIndex));
  
  
  
  
  
   
}



function toSimpleTime(t){
  time = parseInt(t);
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  var hours = Math.floor(time / 3600);

  var secondStr = seconds.toString();
  var minuteStr = minutes.toString();

  if(hours == 0 && minutes == 0){
    if(secondStr.length == 1){
      return "0:0"+secondStr;
    }else if(secondStr.length == 2){
      return "0:"+secondStr;
    }
  }else if(hours == 0){
    if(secondStr.length == 1){
      secondStr = "0"+secondStr;
    }
    return minuteStr + ":" + secondStr;
  }else {
    if(secondStr.length == 1){
      secondStr = "0"+secondStr;
    }
    if(minuteStr.length == 1){
      minuteStr = "0"+minuteStr;
    }
    return hours.toString() + ":" + minuteStr + ":" + secondStr;
  }
}

function getEnvVar() {
	if (window.location.href.indexOf("localhost") != -1) {
		var envvar = {urlPrefix : "http://localhost:8080/",
				clientId : "491270377673854" ,
				loginSuffix : "oauth/authorize/facebook/test"};
		return envvar;
	} else {
		var envvar = {urlPrefix : "http://www.wutadove.com/",
				clientId : "396120470510136",
				loginSuffix : "oauth/authorize/facebook"};
		return envvar;
	}
}


function redirectToSearchAdaptor(videoIdArray, keyin){
	var envVar = getEnvVar();
	var searchUrl = envVar.urlPrefix + "search?";
	for(var i = 0;i < videoIdArray.length;i++){
		searchUrl += ("v="+ videoIdArray[i] + "&");
	}
	searchUrl += ("q="+encodeURIComponent(keyin));
	window.location.href = searchUrl;
	
}

function getVideoInfoFromYoutube(videoId, callback, errorCallback){
	  $.ajax({
	  type: "GET",
	  url: 'http://gdata.youtube.com/feeds/api/videos/'+videoId+'?v=2&alt=jsonc',
	  dataType:"json",
	  success: callback,
	  error : function(response){
		  errorCallback(videoId, response);
	  }
	});
}

function isYoutubeUrl(keyin) {
	var parts = keyin.split(/\s+/);
	if(parts.length == 1 && /(^https?:\/\/)?www\.youtube\.com\/watch\?/.test(parts[0]) )return true;
	return false;
}

function searchInYoutube(keyin){
  var videoIdArray = [];
  if(isYoutubeUrl(keyin) ){// it's Youtube url
    var paras = keyin.split('?')[1].split('&');    
    for(var i = 0;i < paras.length;i++){
      if(/^v=/.test(paras[i])){
        videoIdArray.push(paras[i].split('=')[1]);
        break;
      }
    }

    if(videoIdArray.length > 0){
    	redirectToSearchAdaptor(videoIdArray, keyin);
    	
    }
  }else {
	var keyword = keyin;	
	var request = gapi.client.youtube.search.list({
	    q: keyword,
	    part: 'snippet',
	    type : 'video',
	    order : 'relevance',
	    maxResults : 5,
	    videoDuration : 'medium'

	    
	  });
	request.execute(function(response) {
		if(response.items){
	          for(var i = 0; i < response.items.length;i++){
	        	  videoIdArray.push(response.items[i].id.videoId);
	          }	
	          if(videoIdArray.length > 0){
	        	  redirectToSearchAdaptor(videoIdArray, keyin);
	          }
	        }
	  });
	  
	  
	
    /* Youtube v2 api, has been deprecated since 2014 March 
    var keyword = encodeURIComponent(keyin);
    var numberOfResult = 6;
    var yt_url = 'http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results='+numberOfResult+'&v=2&alt=jsonc';
    $.ajax({
      type: "GET",
      url: yt_url,
      dataType:"jsonp",
      success: function(response){
    	  //console.log(response);
    	  
        if(response.data.items){
          for(var i = 0; i < response.data.items.length;i++){
        	  videoIdArray.push(response.data.items[i].id);
          }
          if(videoIdArray.length > 0){
        	  redirectToSearchAdaptor(videoIdArray, keyin);
          }
        }
      }
    });*/
  }
}
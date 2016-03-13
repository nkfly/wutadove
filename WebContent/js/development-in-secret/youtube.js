function setupYoutubePlayer(vid){
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  $(tag).prependTo("body");

  youtube.videoId = vid;

  //$("#search-result").empty();
  $("#graph").css("display", "inline-block");
  $("#result").css("display", "inline-block");
}

function onYouTubeIframeAPIReady() {
  youtube.player = new YT.Player('player', {
    height: '285',
    width: '330',
    videoId: youtube.videoId,
    playerVars: {
        wmode: "opaque"
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  $("#player").addClass("youtube-player");
}


 function onPlayerReady(event) {
  event.target.setPlaybackQuality("small");
}



 function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    youtube.isPlaying = true;
    clearTimeout(waveform.timelineOffsetHandler);
    youtube.currentTimeRecord = youtube.player.getCurrentTime();
    
    if(waveform.isClickNewTimelineOffset){
      youtube.player.seekTo(waveform.timelineOffset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor, true);
    }else {
      waveform.timelineOffset = Math.floor( (youtube.player.getCurrentTime()/waveform.timeElapsedPerPixel)*waveform.horizontalScaleFactor/100 );
    }
    
    
    if(waveform.timelineOffset < $("#graph").scrollLeft() || waveform.timelineOffset > ($("#graph").scrollLeft()+waveform.globalGraph.width())){
      $("#graph").scrollLeft(waveform.timelineOffset-waveform.timelineOffset% $("#graph").width() );
    }

    waveform.timelineOffsetHandler = setInterval(function(){
    var currentTime = youtube.player.getCurrentTime();  
    if(waveform.isClickNewTimelineOffset){
      clearTimeout(waveform.timelineOffsetHandler);
      youtube.player.seekTo(waveform.timelineOffset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor, true);
      waveform.isClickNewTimelineOffset = false;      
      //control.isLoop = false;
      //return;// because there will be second time entering YT.PlayerState.PLAYING
    //}else if(Math.floor(youtube.player.getCurrentTime()/waveform.timeElapsedPerPixel*waveform.horizontalScaleFactor/100) <= waveform.timelineOffset) {
    }else if(currentTime == youtube.currentTimeRecord ) {
    	waveform.timelineOffset += waveform.horizontalScaleFactor/100;
    }else {
    	youtube.currentTimeRecord = currentTime;
    	waveform.timelineOffset = Math.floor(currentTime/waveform.timeElapsedPerPixel*waveform.horizontalScaleFactor/100);
    }
    
    if(control.isLoop && isSelecting()){
      var greaterSelectionOffset = waveform.selectionEndOffset > waveform.selectionStartOffset ? waveform.selectionEndOffset : waveform.selectionStartOffset;
      if (waveform.timelineOffset > greaterSelectionOffset) {
    	  var smallerSelectionOffset = waveform.selectionEndOffset < waveform.selectionStartOffset ? waveform.selectionEndOffset : waveform.selectionStartOffset; 
    	  youtube.player.seekTo(smallerSelectionOffset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor, true);
    	  waveform.timelineOffset = smallerSelectionOffset;
          graphScroll(smallerSelectionOffset, greaterSelectionOffset-smallerSelectionOffset);
      }	
    }else if (waveform.isSetAnchor && $("#select-area-start").is(":visible")) {
    	if (waveform.timelineOffset < waveform.selectionStartOffset) {
    		$("#select-area-end").css("left", waveform.timelineOffset-3);
    		$("#select-area").css("left",waveform.timelineOffset).width(waveform.selectionStartOffset-waveform.timelineOffset);
    	}else {
    		$("#select-area-end").css("left", waveform.timelineOffset);
    		$("#select-area").css("left",waveform.selectionStartOffset).width(waveform.timelineOffset - waveform.selectionStartOffset);
    	}
    	
    	waveform.selectionEndOffset = waveform.timelineOffset;
    	var $nextSelectedArea = $("#selected-area-"+waveform.pseudoNodeIndex);
    	if ($nextSelectedArea.length && waveform.selectionEndOffset >= $nextSelectedArea.position().left+$("#graph").scrollLeft()){
    		waveform.timelineOffset = $nextSelectedArea.position().left+$("#graph").scrollLeft();
    		youtube.player.seekTo(waveform.timelineOffset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor, true);
    		pauseVideo();
    		$("#select-area-end").css("left", waveform.timelineOffset);
    		$("#select-area").css("left",waveform.selectionStartOffset).width(waveform.timelineOffset - waveform.selectionStartOffset);
    		waveform.selectionEndOffset = waveform.timelineOffset;
    		
    	}
    }
    if(Math.floor(waveform.timelineOffset) >= ($("#graph").scrollLeft()+$("#graph").width()) ||  Math.floor(waveform.timelineOffset) < $("#graph").scrollLeft()){
      waveform.timelineOffset = Math.floor(currentTime/waveform.timeElapsedPerPixel)*waveform.horizontalScaleFactor/100;
      $("#graph").scrollLeft(waveform.timelineOffset);

    }
    
    waveform.timelineNode.css("left",waveform.timelineOffset);

  }, waveform.timeElapsedPerPixel*1000);

  }else if (event.data == YT.PlayerState.PAUSED){
    clearTimeout(waveform.timelineOffsetHandler);
    //if(!youtube.isSeeking)control.isLoop = false;
    control.isLoop = false;
    $("#loop-mask").hide();
    $("#loop").tooltip( "option", "content", "循環播放" );
    //if(!youtube.isSeeking)waveform.timelineOffset = 0;
    youtube.isPlaying = false;
  }
}
 
function pauseVideo(){
  youtube.player.pauseVideo();
		
}
function stopVideo() {
  youtube.player.stopVideo();
}
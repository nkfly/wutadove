function toSrtTime(youtubeVideoTime){// seconds
    var separate = youtubeVideoTime.toString().split('.');
    var seconds = parseInt(separate[0]);
    var time = "";
    var mod = '' + seconds%60;
    if(mod.length == 1)time = ':0' + mod;
    else if(mod.length == 2)time =':' + mod;
    seconds = Math.floor(seconds/60);

    mod = '' + seconds%60;
    if(mod.length == 1)time = ':0' + mod + time;
    else if(mod.length == 2)time = ':' + mod + time;
    seconds = Math.floor(seconds/60);

    mod = '' + seconds%60;
    if(mod.length == 1)time = '0' + mod + time;
    else if(mod.length == 2)time = mod + time;

    time += ',';
    var milli;
    for(milli = 0;milli < separate[1].length && milli < 3;milli++){
      time += separate[1][milli];
    }
    for(;milli < 3;milli++){
      time += '0';
    }
    
    return time;

  }

function toSecond(srtTime){
    var split = srtTime.split(",");
    var integerPart = split[0].split(":");
    var floatPart = parseFloat( split[1])/1000;
    var seconds = 0;
    seconds += parseInt(integerPart[0])*60*60;
    seconds += parseInt(integerPart[1])*60;
    seconds += parseInt(integerPart[2]);
    seconds += floatPart;
    return seconds;


}

  function loop(youtubeTimeStart ,youtubeTimeStop){
	
		clearTimeout(control.loopHandler);
	    waveform.timelineOffset = waveform.selectionStartOffset;
	    waveform.timelineNode.css("left",waveform.timelineOffset);
	    youtube.player.seekTo(youtubeTimeStart, true);
	    waveform.isClickNewTimelineOffset = false;
	    control.loopHandler = setInterval(function(){
	        waveform.timelineOffset = waveform.selectionStartOffset;
	        waveform.timelineNode.css("left",waveform.timelineOffset);
	        youtube.player.seekTo(youtubeTimeStart, true);
	      }, Math.floor(1000*(parseFloat(youtubeTimeStop) - parseFloat(youtubeTimeStart) ) ));
    
  }
  
  function verticalScaleHandler(offsetY,$scaleBar){
	  verticalScale( -10*offsetY+610 ,  Math.floor($("#graph").scrollLeft()*100/waveform.horizontalScaleFactor), Math.floor($("#graph").scrollLeft()+waveform.globalGraph.width())*100/waveform.horizontalScaleFactor);
      $scaleBar.css({"top":offsetY+8, "height" : 64-offsetY});
      waveform.verticalScaleFactor = -10*offsetY+610;
      control.isChangeVerticalScaleFactor = true;
	  
  }

  function visibleVerticalHandler(event){
        // when scale-icon offsetY to sacle-adjust-container is 56, that is 50%
        // when scale-icon offsetY to sacle-adjust-container is 0, that is 610%
        // 50 = 56x + b
        // 610 = 0x + b
        // x = -10, b = 610
        if(control.verticalIsMouseDown || event.type == "click"){
          var offsetY = event.pageY-$("#video").offset().top-$("#vertical-adjust").position().top-8;
          if(offsetY > 56)offsetY = 56;
          else if(offsetY < 0)offsetY = 0;
          verticalScaleHandler(offsetY, $(this).find("div.scale-bar"));

        }
      }



      function adjustTimestamp(horizontalScale){
        var timestamps = $("#timestamp>span");
        var absoluteX = 0;
        var pixelsPerSecond = 1/waveform.timeElapsedPerPixel;
        var scaledTimePeriod = 1*horizontalScale/100;// 1 for 1 second
        for(var i = 0;i < timestamps.length;i++){
          $(timestamps[i]).css({left:absoluteX});
          absoluteX += (pixelsPerSecond*scaledTimePeriod);
        }
    
    
      }

      

      function selectedAreaHorizontalScale(scalePercent){

        for(var index = 1; index <= edit.numberOfRow;index++){
            var start = Math.floor( toSecond($("#subtitle-body").children(":nth-child("+index+")").children(":nth-child(2)").text())/waveform.timeElapsedPerPixel);
            var end = Math.floor( toSecond($("#subtitle-body").children(":nth-child("+index+")").children(":nth-child(3)").text())/waveform.timeElapsedPerPixel);
            var scale = scalePercent/100;
            $("#selected-area-"+index).width((end-start)*scale).css("left",start*scale);
            $("#selected-area-start-"+index).css("left",start*scale-3);
            $("#selected-area-end-"+index).css("left",end*scale);
        }
      }

      function visibleHorizontalHandler(event){
        // when scale-icon offsetY to sacle-adjust-container is 56, that is 50%
        // when scale-icon offsetY to sacle-adjust-container is 0, that is 610%
        // 50 = 56x + b
        // 610 = 0x + b
        // x = -10, b = 610
        if(control.horizontalIsMouseDown || event.type == "click"){
          var offsetY = event.pageY-$("#video").offset().top-$("#horizontal-adjust").position().top-8;
          if(offsetY > 56)offsetY = 56;
          else if(offsetY < 0)offsetY = 0;

          var scalePercent = -10*offsetY+610;

          if(youtube.isPlaying){
            horizontalScale( scalePercent , 0, waveform.globalSvg.childNodes.length);
          }
          else if(scalePercent < waveform.horizontalScaleFactor)horizontalScale( scalePercent , Math.floor($("#graph").scrollLeft()*100/waveform.horizontalScaleFactor), Math.floor($("#graph").scrollLeft()+$("#graph").width())*100/scalePercent);
          else {
            var smallerScale = scalePercent < waveform.horizontalScaleFactor ? scalePercent: waveform.horizontalScaleFactor;
            horizontalScale( scalePercent , Math.floor($("#graph").scrollLeft()*100/waveform.horizontalScaleFactor), Math.floor($("#graph").scrollLeft()+waveform.globalGraph.width())*100/smallerScale);
          }


          

          $("#svg").width(waveform.svgOriginalWidth*scalePercent/100);
          adjustTimestamp(scalePercent);
          selectedAreaHorizontalScale(scalePercent);
          hideSelectArea();
          if(edit.currentEditIndex >= 1 && edit.currentEditIndex <= edit.numberOfRow)moveToSelectedArea($("#selected-area-"+edit.currentEditIndex));

          $(this).find("div.scale-bar").css({"top":offsetY+8, "height" : 64-offsetY});
          waveform.horizontalScaleFactor = scalePercent;
          // $("#select-area").width( waveform.horizontalScaleFactor/100*(waveform.selectionEndOffset- waveform.selectionStartOffset) );
          // $("#select-area").css( "left" , waveform.horizontalScaleFactor/100*(waveform.selectionStartOffset) );
          reorganizeWaveform();
          $("#timeline-offset").width(scalePercent/100);
          control.isChangeHorizontalScaleFactor = true;

        }
      }

function add(event){
  if( isSelecting() && !isRepeatAddSelectedArea()){
    recordRow(edit.currentEditIndex);
    getSubtitleRow(edit.currentEditIndex).removeClass("focus-row");
    $("#selected-area-"+edit.currentEditIndex).removeClass("focus");
    editPanelReset();

    var previousNodeIndex = recordSelectArea();
    moveToSelectedArea($("#selected-area-"+(previousNodeIndex+1)));
    var targetRow = getSubtitleRow(previousNodeIndex);
    if(previousNodeIndex == 0){
      targetRow = getSubtitleRow(1).clone(true,true).show().prependTo($("#subtitle-body"));
    }else {
      targetRow = getSubtitleRow(1).clone(true,true).show().insertAfter(getSubtitleRow(previousNodeIndex));
    }
    scrollToRow(targetRow);
    hideSelectArea();
    
    edit.currentEditIndex = previousNodeIndex+1;
    
    fillInSubtitleRow($("#selected-area-"+edit.currentEditIndex), targetRow, true, previousNodeIndex+1,
    		toSrtTime(pixelToSecond(waveform.selectionStartOffset)),
    		toSrtTime(pixelToSecond(waveform.selectionEndOffset)),
    				"");
    edit.changed[edit.currentEditIndex] = true;
    recordRow(edit.currentEditIndex);
    
    
    
//    $("#selected-area-"+edit.currentEditIndex).addClass("focus");
//    $(targetRow).addClass("focus");
//    $(targetRow).find("div.index").html(previousNodeIndex+1);
//    $(targetRow).children(":nth-child(2)").html(  ) ;
//    $(targetRow).children(":nth-child(3)").html( toSrtTime(waveform.selectionEndOffset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor ) );
//    $(targetRow).children(":nth-child(4)").html( "" );
//
//    $("#footer-japanese-sentence").focus();

    
    

    edit.numberOfRow++;
    
    for (var i = edit.currentEditIndex+1;i <= edit.numberOfRow;i++){
    	update(i,true);
    }
    
    waveform.isSetAnchor = false;
    $("#anchor-annotation").hide();
    $("#anchor-mask").hide();
    $("#loop-mask").hide();
    control.isLoop = false;
    

    /* send to server to say add has been made
    The index of the added row is (previousNodeIndex+1)
    send to server to say add has been made*/

  }
}

function deleteConfirm(){
    if(isEditing() && confirm("你確定要刪除第"+edit.currentEditIndex+"筆歌詞？")){
    	
//       $('#curtain').css({ opacity: 0.7, 'width':$(document).width(),'height':$(document).height()});
//       $('body').css({'overflow':'hidden'});
//       $('#confirm-delete').css({'display': 'block'});
      deleteRow();
      editPanelReset();
      $("#loop-mask").hide();
      control.isLoop = false;
    }
     
}

  function deleteRow(){
    
    $("#selected-area-"+edit.currentEditIndex).remove();
    $("#selected-area-start-"+edit.currentEditIndex).remove();
    $("#selected-area-end-"+edit.currentEditIndex).remove();
    for(var index =edit.currentEditIndex+1 ; index <= edit.numberOfRow; index++ ){
      getSubtitleRow(index).children("div.index").text((index-1).toString());
      $("#selected-area-"+index).attr("id","selected-area-"+(index-1));
      $("#selected-area-start-"+index).attr("id","selected-area-start-"+(index-1));
      $("#selected-area-end-"+index).attr("id","selected-area-end-"+(index-1));
    }
    getSubtitleRow(edit.currentEditIndex).remove();
    
    
    for (var i = edit.currentEditIndex;i < edit.numberOfRow;i++){
    	update(i,true);
    }
    
    $.ajax({
	    type: "POST",
	    url: "delete/"+youtube.videoId+"/"+edit.numberOfRow,
	    dataType:"json",
	    success: function(response){
	    }
	  });

    /* send to server to say delete has been made
    The index of the deleted row is edit.currentEditIndex
    send to server to say delete has been made*/

    edit.currentEditIndex = 0;
    edit.numberOfRow = edit.numberOfRow-1;
    waveform.focusSelectAreaIndex = 0;
    waveform.isFocusSelectedArea = false;
    waveform.selectionStartOffset = waveform.timelineOffset;
    waveform.selectionEndOffset = waveform.timelineOffset;

    

  }

function prevRow(){
    if(edit.currentEditIndex-1 >= 1)changeRowFocus(getSubtitleRow(edit.currentEditIndex-1));
}

function nextRow(){
    if(edit.currentEditIndex+1 <= edit.numberOfRow)changeRowFocus(getSubtitleRow(edit.currentEditIndex+1));
}      

function isEditing(){
    return (edit.currentEditIndex >= 1 && edit.currentEditIndex <= edit.numberOfRow);
}
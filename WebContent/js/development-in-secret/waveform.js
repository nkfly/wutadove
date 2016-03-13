function drawNewWaveform(startNodeIndex, endNodeIndex){
  var height = $("#svg").height();
  var scaleFactor = (height/65536.0)*(waveform.verticalScaleFactor/100);// normalization * scaleup
  for(var i = startNodeIndex;i < endNodeIndex && i < waveform.data.min.length;i++){
    var svgRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    svgRect.setAttributeNS(null,"x",i*waveform.horizontalScaleFactor/100);
    svgRect.setAttributeNS(null,"y",height/2-waveform.data.max[i]*scaleFactor);
    svgRect.setAttributeNS(null,"width",1*waveform.horizontalScaleFactor/100);
    svgRect.setAttributeNS(null,"height",(Math.abs(waveform.data.min[i])+waveform.data.max[i])*scaleFactor);
    
    waveform.globalSvg.appendChild(svgRect);
  }
  
  waveform.endNodeIndex = (endNodeIndex > waveform.data.min.length ? waveform.data.min.length : endNodeIndex);
}
function reorganizeWaveform(){
  // if(waveform.visibleStart < $("#graph").scrollLeft()){
  //   drawNewWaveform();
  // }
  if(waveform.endNodeIndex < Math.floor(($("#graph").scrollLeft()+$("#graph").width())*100/waveform.horizontalScaleFactor )){
    drawNewWaveform(waveform.globalSvg.childNodes.length, Math.floor(($("#graph").scrollLeft()+$("#graph").width())*100/waveform.horizontalScaleFactor));
  }
}

function pixelOffsetToNodeIndex(pixelOffset){
  return Math.floor(pixelOffset/waveform.horizontalScaleFactor*100);
}

function screenXsetToNodeIndex(screenX){
  return pixelOffsetToNodeIndex(screenX+$("#graph").scrollLeft());
}

function placeTimeStamp(horizontalScalePercent, sampleRate, samplesPerPixel, duration, numberOfChannel){
  waveform.timeElapsedPerPixel = (1/sampleRate)*(samplesPerPixel/numberOfChannel);
  var pixelsPerSecond = 1/waveform.timeElapsedPerPixel;
  
  var absoluteX = 0;
  var scaledTimePeriod = 1*horizontalScalePercent/100;// 1 for 1 second
  var remainder;
  for(var seconds = 0;seconds <= duration+1;seconds += scaledTimePeriod){
    remainder = (seconds%60).toString();
    if(remainder.length == 1)remainder = "0" + remainder;

    $("<span class='timestamp'></span>")
    .text(Math.floor(seconds/60).toString() + ":" + remainder)
    .css({left:absoluteX})
    .appendTo($("#timestamp"));
    absoluteX += (pixelsPerSecond*scaledTimePeriod );
  }

}

function secondToMinute(second){
  var remainder = (second%60).toString();
  if(remainder.length == 1)remainder = "0" + remainder;
  return Math.floor(second/60).toString() + ":" + remainder;
}

function verticalScale(percent, startNodeIndex, endNodeIndex){
  var height = $("#svg").height();
  var scaleFactor = height/65536.0;
  var heightScale = percent/100.0;
  for(var i = startNodeIndex ;i < endNodeIndex && waveform.globalSvg.childNodes.length;i++){
    if(waveform.globalSvg.childNodes[i] != null){
      waveform.globalSvg.childNodes[i].setAttributeNS(null,"y",height/2-heightScale*waveform.data.max[i]*scaleFactor);
      waveform.globalSvg.childNodes[i].setAttributeNS(null,"height",(Math.abs(waveform.data.min[i])+waveform.data.max[i])*scaleFactor*heightScale);

    }
  }
}

function horizontalScale(percent, startNodeIndex, endNodeIndex){
  var widthScale = percent/100;
  for(var i = startNodeIndex ;i < endNodeIndex && waveform.globalSvg.childNodes.length;i++){
    if(waveform.globalSvg.childNodes[i] != null){
      waveform.globalSvg.childNodes[i].setAttributeNS(null,"x",i*widthScale);
      waveform.globalSvg.childNodes[i].setAttributeNS(null,"width",widthScale);

    }
    
  }

  //waveform.horizontalScale = percent;

}

function getMouseOnGraphOffset(event){
  return $("#graph").scrollLeft()-$("#container").offset().left+event.pageX;
}

function determineSelectArea(selectAreaEndOffset){
  waveform.selectionEndOffset = selectAreaEndOffset;
  if(waveform.selectionEndOffset < waveform.selectionStartOffset){
    $("#select-area").css("left",waveform.selectionEndOffset ).width(waveform.selectionStartOffset- waveform.selectionEndOffset );
  }else {
    $("#select-area").css("left", waveform.selectionStartOffset).width(waveform.selectionEndOffset - waveform.selectionStartOffset);
  }

}



function isInSvg(event){
  var svgOffsetY = event.pageY+$(document).scrollTop()-$("#graph").offset().top;
  return ( 0 <= svgOffsetY && svgOffsetY <= $("#svg").height());

}

function getPseudoNodeIndex(offset){
  var pseudoNodeIndex = 1;
  for(;pseudoNodeIndex <= edit.numberOfRow;pseudoNodeIndex++){
    if(offset < $("#graph").scrollLeft()+$("#selected-area-"+pseudoNodeIndex).position().left )break;
  }
  return pseudoNodeIndex;
}

function mouseoverSelectedArea(offset){
  // console.log(waveform.pseudoNodeIndex);
  if(waveform.pseudoNodeIndex > 1 && waveform.pseudoNodeIndex <= edit.numberOfRow){    
    if(offset > $("#selected-area-"+waveform.pseudoNodeIndex).position().left+$("#graph").scrollLeft() ||
      offset < $("#selected-area-"+(waveform.pseudoNodeIndex-1)).position().left+$("#graph").scrollLeft()+$("#selected-area-"+(waveform.pseudoNodeIndex-1)).width())return true;
  }else if(waveform.pseudoNodeIndex == 1 && waveform.pseudoNodeIndex <= edit.numberOfRow){
    if(offset > $("#selected-area-"+waveform.pseudoNodeIndex).position().left+$("#graph").scrollLeft())return true;
  }else if(waveform.pseudoNodeIndex == edit.numberOfRow+1 && edit.numberOfRow > 0){
    if(offset < $("#selected-area-"+(waveform.pseudoNodeIndex-1)).position().left+$("#graph").scrollLeft()+$("#selected-area-"+(waveform.pseudoNodeIndex-1)).width())return true;
  }
  return false;
}
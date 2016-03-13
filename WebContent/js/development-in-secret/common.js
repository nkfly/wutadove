var youtube = {
        videoId : null,
        player : null,
        startTime : 0,
        endTime : 0,
        isPlaying : false,
        isSeeking : false,
        currentTimeRecord : 0

      };
var control = {
        isLoop : false,
        loopHandler : null,
        verticalIsMouseDown : false,
        isChangeVerticalScaleFactor : false,
        horizontalIsMouseDown : false,
        isChangeHorizontalScaleFactor : false
        
      };
var waveform = {
    prevScrollLeft : 0,
    timelineOffsetHandler : 0,
    timelineOffset : 0,
    timelineNode : null,
    globalSvg : null,
    svgOriginalWidth : null,
    globalGraph : null,
    timeElapsedPerPixel : null,
    endNodeIndex : 0,
    data : null,
    horizontalScaleFactor : 100,
    verticalScaleFactor : 100,
    isClickNewTimelineOffset : false,
    isSelectionMouseDown : false,
    selectionStartOffset : 0,
    selectionEndOffset :0,
    isAdjustStartSelectLine : false,
    isAdjustEndSelectLine : false,
    focusSelectAreaIndex : 0,
    isSelectAreaStartMouseDown:false,
    isSelectAreaEndMouseDown:false,
    isFocusSelectedArea:false,
    isSetAnchor : false,
    pseudoNodeIndex: 0,
    
    leftScrollHandler : null,
    rightScrollHandler : null,

      };

var edit = {
  numberOfRow : 0,
  currentEditIndex : 0,
  index : 1,
  isShowVocab : false,
  changed : {},
  lengthLimitOfSentence : 20,
  isJapaneseSentenceChanged : false

};

var slide = {
  index : 1,
  numberOfItem : 3,
  handler : 0,
  isChanging : false

};

var loading = {
  status:"more",
  index : 0

};

var tooltipInit = {
		
			 
		      // place tooltip on the right edge
		      position:  position = { my: 'left center', at: 'right+10 center-20', collision: "fit" },
		 
		      // a little tweaking of the position
		      offset: [-2, 10],
		 
		      // use the built-in fadeIn/fadeOut effect
		      effect: "fade",
		 
		      // custom opacity setting
		      opacity: 0.7,
		      tooltipClass: "custom-tooltip",
		 
		      
};



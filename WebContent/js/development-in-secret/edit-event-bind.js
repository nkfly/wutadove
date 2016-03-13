function init(){
        var containerWidth = $("#container").width();
        $("#graph").width(containerWidth/3*2-50);
        $("#subtitle-body div.subtitle-text").width(containerWidth-280);
        $("div.subtitle-head div.subtitle-text").width(containerWidth-280);
        $("#footer-header>div.subtitle-text").add("#edit-footer input.subtitle-sentence").width(280);
        var y = window.innerHeight|| document.clientHeight|| document.getElementById('body').clientHeight;
        $("#edit").height(y-44-330-140);
      }
      
      $(document).ready(function() {
    	$.fn.tooltip.noConflict();
    	
        init();
        
        $("#comment").popover({ 
    		html : true,
    		template : '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
    	    content: function() {
    	    	return '<div class="grammar">'
    	    	+'<div class="panel panel-default">'
    	    	+'<div class="panel-heading">'
    	    	+'附註<button type="button" class="close close-popover"><span aria-hidden="true">×</span></button>'
    	    	+'</div><textarea rows="4" >'
    	    	+ $(this).attr('data-popover')
    	    	+'</textarea></div></div>';
    	    },
    	    placement: function() {
    	    	return "bottom";
    	    },
    	    trigger : 'manual'
    	}).click(function(e){
    		 $(this).popover('toggle');
    		 e.stopPropagation();
    	}).attr("title", "附註");
        
        $('#comment').on('hide.bs.popover', function () {
        	var comment = $(this).next().find('textarea').val();
        	if (comment != $(this).attr('data-popover')){
        		$(this).attr('data-popover', comment);
            	$.ajax({
      			  type: "POST",
      			  url: '/edit/update/comment/'+youtube.videoId,
      			  data:{comment : comment}
      			},"json");
        	}
        });
        
        
        $("#control>div.button").tooltip(tooltipInit);
        
        window.onbeforeunload = function () {
            if(isChanged(edit.currentEditIndex)){
    			recordRow(edit.currentEditIndex);
            }
        };
        
        /* mousewheel */
        $("#footer-body").add("#graph").mousewheel(function (event, delta) {
                            // now attaching the mouse wheel plugin and scroll by the 'delta' which is the
                            // movement of the wheel - so we multiple by an arbitrary number.
                            this.scrollLeft -= (delta * 20);
        });
        
        
        /* input binding */
        $("#keyin").keydown(function(event){
          if(event.keyCode == 13){
            searchInYoutube($(this).val());
          }
        });
        $("input.submit").click(function(event){
          searchInYoutube($("#keyin").val());
        });
        
        /* anchor */
        $("#anchor").click(setAnchor);
                
        /* publish */
        $("#publish").click(function(event){
    		recordRow(edit.currentEditIndex, false);
        	if ($("#publish-mask").is(":visible")) {
        		$(this).tooltip( "option", "content", "發佈" );
        		$("#publish-mask").hide();
        		$.ajax({
        			  type: "POST",
        			  url: '/edit/unpublish/'+youtube.videoId
        			},"json");
        	} else {
        		$(this).tooltip( "option", "content", "取消發佈" );
        		$("#publish-mask").show();
        		$.ajax({
      			  type: "POST",
      			  url: '/edit/publish/'+youtube.videoId
      			},"json");
        	}
        });
        
    	// dismiss popover when click outside popover
    	$("body").on("click", function(e) {
    		if (typeof $("#comment").attr("aria-describedby") !== 'undefined'){
    			$("#comment").popover('toggle');
    		}
    	});
    	// close button in popover
    	$("#control").on("click", ".close-popover", function(e) {
    		if (typeof $("#comment").attr("aria-describedby") !== 'undefined'){
    			$("#comment").popover('toggle');
    		}
    	}).on("click", "div.popover", function(e) {
    		e.stopPropagation();
    	});
        
        

        /* next 
        $("#next").click(nextRow);
        */
        /* prev 
        $("#prev").click(prevRow);
        */

        /* delete */
        $("#delete").click(deleteConfirm);

        /* Row */
        $("div.subtitle-row").click(function(event){
          changeRowFocus($(this));
          $("#footer-japanese-sentence").focus();
        });

        /* edit footer japanese sentence bind */
        $("#footer-japanese-sentence").keyup(function(event){
          if(!isChangeText(event) || !isEditing() // ctrl+c
        		  || ((event.ctrlKey||event.metaKey ) && event.keyCode == 67)
        		  || ((event.ctrlKey||event.metaKey ) && event.keyCode == 65) // ctrl+a
        		  || ((event.ctrlKey||event.metaKey ) && event.shiftKey)
        		  || ((event.ctrlKey||event.metaKey ) && event.altKey))return;
          if(!edit.isShowVocab){
            $(this).after(getJapaneseVocab());
            $("#footer-chinese-sentence").after(getChineseVocab());
            edit.isShowVocab = true;
          }
          var newVal = $(this).val();
          getSubtitleRow(edit.currentEditIndex).children(":nth-child(4)").text( newVal );
          //$(this).next().val(newVal);
          
          adjustVocabularyWidth($(this).index()+1+1);
          $(this).nextAll().each(function(index){
        	  validateFooterInput($(this));
        	  //$(this).tooltip("close");
          });
          
        }).focusout(determineGrammar)
        .on("input", function(e){
        	validateFooterInput($(this));
        	hasChanged();
        	edit.isJapaneseSentenceChanged = true;
        	});
        //.tooltip(tooltipInit);
        
        /* edit footer chinese sentence bind */
        $("#footer-chinese-sentence")
        .on("input", function(e){
        	validateFooterInput($(this));
        	hasChanged();
        	});
        //.tooltip(tooltipInit);


        /* add */

        $("#add").click(add);

        /*  loop */ 
        $("#loop").click(function(){
          if ($("#loop-mask").is(":visible")) {
        	  control.isLoop = false;
        	  $("#loop-mask").hide();
        	  $("#loop").tooltip( "option", "content", "循環播放" );
          } else {
        	  if( isSelecting() ){
                  waveform.timelineOffset = waveform.selectionStartOffset;
                  waveform.timelineNode.css("left",waveform.timelineOffset);
                  control.isLoop = true;
                  youtube.player.playVideo();
                  $("#loop-mask").show();
                  $(this).tooltip( "option", "content", "停止循環播放" );
                }
       	  }
          
        });
        
        $("#body").mousemove(function(event){
        	if (waveform.isSelectionMouseDown || waveform.isAdjustStartSelectLine || waveform.isAdjustEndSelectLine
        			|| waveform.isSelectAreaStartMouseDown || waveform.isSelectAreaEndMouseDown ) {
        		event.preventDefault();
            	event.stopPropagation();
            	return;
        	} 
        	
        });                  
        
        $("#graph").mousedown(function(event){
        	
          if(!isInSvg(event))return;
          
          var offset = getMouseOnGraphOffset(event);
          
          if (waveform.isSetAnchor && !waveform.isSelectAreaStartMouseDown && !waveform.isSelectAreaEndMouseDown) {
        	if(mouseoverSelectedArea(offset))return;
        	waveform.pseudoNodeIndex = getPseudoNodeIndex(offset);
            waveform.timelineOffset = offset;
            waveform.timelineNode.css("left",waveform.timelineOffset);
            determineSelectArea(offset);
            if (waveform.selectionStartOffset > offset) {
            	waveform.selectionEndOffset = $("#graph").scrollLeft()+$("#select-area").position().left-3;	
            } else {
            	waveform.selectionEndOffset = $("#graph").scrollLeft()+$("#select-area").position().left+$("#select-area").width();
            }
            $("#select-area-end").css({"display":"inline-block","left":waveform.selectionEndOffset});
            waveform.isClickNewTimelineOffset = true;
          }else if( !waveform.isSelectAreaStartMouseDown && !waveform.isSelectAreaEndMouseDown
            && !waveform.isAdjustStartSelectLine && !waveform.isAdjustEndSelectLine
            && !waveform.isFocusSelectedArea){
            hideSelectArea();
            waveform.pseudoNodeIndex = getPseudoNodeIndex(offset);
            waveform.selectionStartOffset = offset;
            waveform.timelineOffset = offset;
            waveform.timelineNode.css("left",waveform.timelineOffset);
            waveform.isClickNewTimelineOffset = true;
            waveform.isSelectionMouseDown = true;
          }else if( waveform.isSelectAreaStartMouseDown ||waveform.isSelectAreaEndMouseDown){
            if(waveform.isSelectAreaStartMouseDown)waveform.pseudoNodeIndex = getPseudoNodeIndex(offset+3);
            else if(waveform.isSelectAreaEndMouseDown)waveform.pseudoNodeIndex = getPseudoNodeIndex(offset-3);
            waveform.timelineOffset = offset;
            waveform.timelineNode.css("left",waveform.timelineOffset);
            waveform.isClickNewTimelineOffset = true;
          }else if(waveform.isAdjustStartSelectLine || waveform.isAdjustEndSelectLine){
            hideSelectArea();
            waveform.timelineOffset = offset;
            waveform.timelineNode.css("left",offset);
            waveform.isClickNewTimelineOffset = true;
          }
            
        }).mousemove(function(event){
          var offset = getMouseOnGraphOffset(event);
          if(waveform.isSelectAreaStartMouseDown){
            if(mouseoverSelectedArea(offset)) {
            	clearScrollHandler();
            	return;
            }
            determineScroll(offset);
            resizeSelectAreaFromStartOffset(offset);            

          }else if(waveform.isSelectAreaEndMouseDown ){
            if(mouseoverSelectedArea(offset)) {
            	clearScrollHandler();
            	return;	
            }
            determineScroll(offset);
            resizeSelectAreaFromEndOffset(offset);

          }else if(waveform.isAdjustStartSelectLine ){
            if(waveform.focusSelectAreaIndex != 1 && offset < $("#graph").scrollLeft()+$("#selected-area-"+(waveform.focusSelectAreaIndex-1)).position().left+$("#selected-area-"+(waveform.focusSelectAreaIndex-1)).width() ){
            	clearScrollHandler();
            	return;
            }
            determineScroll(offset);
            adjustSelectedAreaFromStartLine(offset);


          }else if(waveform.isAdjustEndSelectLine ){
            if(waveform.focusSelectAreaIndex != edit.numberOfRow && offset > $("#graph").scrollLeft()+$("#selected-area-"+(waveform.focusSelectAreaIndex+1)).position().left ){
            	clearScrollHandler();
            	return;	
            }
            
            determineScroll(offset);
            adjustSelectedAreaFromEndLine(offset);

              
            
          }else if(waveform.isSelectionMouseDown ){
            if(mouseoverSelectedArea(offset)) {
            	clearScrollHandler();
            	return;
            }
            determineScroll(offset);
            
            determineSelectArea(offset);
			
            $("#select-area-start").css({"display":"inline-block","left":$("#graph").scrollLeft()+$("#select-area").position().left-3});
            $("#select-area-end").css({"display":"inline-block","left":$("#graph").scrollLeft()+$("#select-area").position().left+$("#select-area").width()});
            
          }
          
        }).mouseup(function(event){

          if(!isInSvg(event))return;
          var offset = getMouseOnGraphOffset(event);
          if(waveform.isSelectAreaStartMouseDown){
        	  clearScrollHandler();
            if(mouseoverSelectedArea(offset)){
              if (offset < waveform.selectionEndOffset) {
            	  waveform.timelineOffset = $("#selected-area-"+(waveform.pseudoNodeIndex-1)).position().left+$("#graph").scrollLeft()+$("#selected-area-"+(waveform.pseudoNodeIndex-1)).width();  
              } else {
            	  waveform.timelineOffset = $("#selected-area-"+(waveform.pseudoNodeIndex)).position().left+$("#graph").scrollLeft();
              }
            }else waveform.timelineOffset = offset;
            waveform.timelineNode.css("left",waveform.timelineOffset);
            resizeSelectAreaFromStartOffset(waveform.timelineOffset);
          }else if(waveform.isSelectAreaEndMouseDown){
        	clearScrollHandler();
            if(mouseoverSelectedArea(offset)){
              if (waveform.selectionStartOffset < offset) {
            	  waveform.timelineOffset = $("#selected-area-"+(waveform.pseudoNodeIndex)).position().left+$("#graph").scrollLeft();
              }else {
            	  waveform.timelineOffset = $("#selected-area-"+(waveform.pseudoNodeIndex-1)).position().left+$("#graph").scrollLeft()+$("#selected-area-"+(waveform.pseudoNodeIndex-1)).width();
              }
            }else waveform.timelineOffset = offset;
            waveform.timelineNode.css("left",waveform.timelineOffset);
            resizeSelectAreaFromEndOffset(waveform.timelineOffset);
          }else if(waveform.isAdjustStartSelectLine){
            if(waveform.focusSelectAreaIndex != 1 && offset < $("#graph").scrollLeft()+$("#selected-area-"+(waveform.focusSelectAreaIndex-1)).position().left+$("#selected-area-"+(waveform.focusSelectAreaIndex-1)).width() )waveform.timelineOffset = $("#graph").scrollLeft()+$("#selected-area-"+waveform.focusSelectAreaIndex).position().left;
            else waveform.timelineOffset = offset;
            clearScrollHandler();
            waveform.timelineNode.css("left",waveform.timelineOffset);
            adjustSelectedAreaFromStartLine(waveform.timelineOffset);
            edit.changed[waveform.focusSelectAreaIndex] = true;
            
          }else if( waveform.isAdjustEndSelectLine){
            if(waveform.focusSelectAreaIndex != edit.numberOfRow && offset > $("#graph").scrollLeft()+$("#selected-area-"+(waveform.focusSelectAreaIndex+1)).position().left )waveform.timelineOffset = $("#graph").scrollLeft()+$("#selected-area-"+waveform.focusSelectAreaIndex).position().left+$("#selected-area-"+waveform.focusSelectAreaIndex).width();
            else waveform.timelineOffset = offset;
            clearScrollHandler();
            waveform.timelineNode.css("left",waveform.timelineOffset);
            adjustSelectedAreaFromEndLine(waveform.timelineOffset);
            edit.changed[waveform.focusSelectAreaIndex] = true;

          }else if(waveform.isSelectionMouseDown){
        	  
            if(mouseoverSelectedArea(offset)){
              if(offset > waveform.selectionStartOffset ){
                determineSelectArea($("#selected-area-"+waveform.pseudoNodeIndex).position().left+$("#graph").scrollLeft());
                waveform.timelineOffset = $("#selected-area-"+waveform.pseudoNodeIndex).position().left+$("#graph").scrollLeft();
              }else {
                determineSelectArea($("#selected-area-"+(waveform.pseudoNodeIndex-1) ).position().left+$("#graph").scrollLeft()+$("#selected-area-"+(waveform.pseudoNodeIndex-1)).width() );
                waveform.timelineOffset = $("#selected-area-"+(waveform.pseudoNodeIndex-1) ).position().left+$("#graph").scrollLeft()+$("#selected-area-"+(waveform.pseudoNodeIndex-1)).width();
              }
                              
            }else {
              if(waveform.selectionStartOffset != waveform.selectionEndOffset ){// that means selection has been made
                determineSelectArea(offset);
                waveform.timelineOffset = offset;
              }
            }

            if(waveform.selectionStartOffset > waveform.selectionEndOffset){
                var temp = waveform.selectionStartOffset;
                waveform.selectionStartOffset = waveform.selectionEndOffset;
                waveform.selectionEndOffset = temp;
            }
            clearScrollHandler();
            waveform.timelineNode.css("left",waveform.timelineOffset);
            $("#select-area-start").css({"display":"inline-block","left":$("#graph").scrollLeft()+$("#select-area").position().left-3});
            $("#select-area-end").css({"display":"inline-block","left":$("#graph").scrollLeft()+$("#select-area").position().left+$("#select-area").width()});
            
            
          }else if(waveform.isFocusSelectedArea){
            $("#footer-japanese-sentence").focus();
          }
          
          waveform.isAdjustStartSelectLine = false;
          waveform.isAdjustEndSelectLine = false;
          waveform.isSelectionMouseDown = false;
          waveform.isSelectAreaStartMouseDown = false;
          waveform.isSelectAreaEndMouseDown = false;
          waveform.isFocusSelectedArea = false;

          
          
        }).scroll(reorganizeWaveform).dblclick(function(event){
        	pauseVideo();
        });
		
        /* manual scroll related events */
        document.getElementById("graph").onselectstart = function () { return false; };
        
        



        /* vertical scale event binding */
        $("#vertical-scale").mouseenter(function(){
          $("#vertical-adjust").css("top",$(this).position().top);
          $("#vertical-adjust").show().animate({"height":"+=80px", "top":"-=80px"},100);
        }).mouseleave(function(){
          control.verticalIsMouseDown = false;
          // do the all nodes vertical adjustment
          if(control.isChangeVerticalScaleFactor){
           control.isChangeVerticalScaleFactor = false; 
           verticalScale( waveform.verticalScaleFactor , 0, waveform.globalSvg.childNodes.length);
          }
          $("#vertical-adjust").animate({"height":"-=80px", "top":"+=80px"}, 200,function(){
            $(this).hide();
          });
        });
        $("#vertical-adjust").mousedown(function(){
          control.verticalIsMouseDown = true;
        }).mousemove(visibleVerticalHandler).click(visibleVerticalHandler)
        .mouseup(
        function(){
          control.verticalIsMouseDown = false;
        });

        document.getElementById("vertical-adjust").onselectstart = function () { return false; }

        /* horizontal scale event binding */
        $("#horizontal-scale").mouseenter(function(){
          $("#horizontal-adjust").css("top",$(this).position().top);
          $("#horizontal-adjust").show().animate({"height":"+=80px", "top":"-=80px"},100);
        }).mouseleave(function(){
          control.horizontalIsMouseDown = false;
          // do the all nodes horizontal adjustment
          if(control.isChangeHorizontalScaleFactor){
           control.isChangeHorizontalScaleFactor = false; 
           horizontalScale( waveform.horizontalScaleFactor , 0, waveform.globalSvg.childNodes.length);
           if(edit.currentEditIndex == 0){
            waveform.selectionStartOffset = waveform.timelineOffset;
            waveform.selectionEndOffset = waveform.timelineOffset;
           } 
            
           
           // $("#select-area").width( waveform.horizontalScaleFactor/100*(waveform.selectionEndOffset- waveform.selectionStartOffset) );
           //  $("#select-area").css( "left" , waveform.horizontalScaleFactor/100*(waveform.selectionStartOffset) );
          }
          $("#horizontal-adjust").animate({"height":"-=80px", "top":"+=80px"}, 200,function(){
            $(this).hide();
          });
        });
        $("#horizontal-adjust").mousedown(function(){
          control.horizontalIsMouseDown = true;
        }).mousemove(visibleHorizontalHandler).click(visibleHorizontalHandler)
        .mouseup(
        function(){
          control.horizontalIsMouseDown = false;
        });
        

        document.getElementById("horizontal-adjust").onselectstart = function () { return false; }

        $("#edit-footer input").keydown(traversable);
        
      });
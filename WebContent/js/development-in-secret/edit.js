(function ($, undefined) {
$.fn.getCursorPosition = function () {
    var el = $(this).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
};

$.caretTo = function (el, index) {
        if (el.createTextRange) { 
            var range = el.createTextRange(); 
            range.move("character", index); 
            range.select(); 
        } else if (el.selectionStart != null) { 
            el.focus(); 
            el.setSelectionRange(index, index); 
        }
    };
    $.fn.caretTo = function (index, offset) {
        return this.queue(function (next) {
            if (isNaN(index)) {
                var i = $(this).val().indexOf(index);
                
                if (offset === true) {
                    i += index.length;
                } else if (offset) {
                    i += offset;
                }
                
                $.caretTo(this, i);
            } else {
                $.caretTo(this, index);
            }
            
            next();
        });
    };

})(jQuery);

function setAnchor(event){
	if ($('#anchor-annotation').is(":visible")) {
		waveform.isSetAnchor = false;
		$('#anchor-annotation').hide();
		$("#anchor-mask").hide();
		$(this).tooltip( "option", "content", "設下錨點" );
	} else {
		if ($("#select-area-start").is(":visible") ) {
			waveform.isSetAnchor = true;
			moveAnchorAnnotation();
			$("#anchor-mask").show();
			$(this).tooltip( "option", "content", "拔起錨點" );
		}
		
	}
}

function moveAnchorAnnotation(){
	$('#anchor-annotation').show().css("left",
			($("#graph").scrollLeft()+$("#select-area-start").position().left-9)+"px");
}

function clearScrollHandler(){
	clearTimeout(waveform.leftScrollHandler);
	waveform.leftScrollHandler = null;
	clearTimeout(waveform.rightScrollHandler);
	waveform.rightScrollHandler = null;
}

function resizeSelectAreaFromStartOffset(offset) {	
	if(offset < waveform.selectionEndOffset){
        $("#select-area-start").css("left",offset-3);
        $("#select-area").css("left",offset).width(waveform.selectionEndOffset-offset);
        waveform.selectionStartOffset = offset;
        if (waveform.isSetAnchor)moveAnchorAnnotation();
      }else {
    	  if (waveform.isSetAnchor) {
    		  $("#select-area-start").css("left",offset-3);
    	      $("#select-area").css("left",waveform.selectionEndOffset).width(offset-waveform.selectionEndOffset);
    	      waveform.selectionStartOffset = offset;
    	      moveAnchorAnnotation();
    	  } else {
    		  $("#select-area-start").css("left",waveform.selectionEndOffset-3);
    	      $("#select-area").css("left",waveform.selectionEndOffset).width(offset-waveform.selectionEndOffset);
    	      $("#select-area-end").css("left",offset);
    	      waveform.selectionStartOffset = waveform.selectionEndOffset;
    	      waveform.selectionEndOffset = offset;
    	      waveform.isSelectAreaStartMouseDown = false;
    	      waveform.isSelectAreaEndMouseDown = true;
    	  }
      }
	
}

function resizeSelectAreaFromEndOffset(offset) {
	if(offset > waveform.selectionStartOffset){
		$("#select-area").css("left",waveform.selectionStartOffset).width(offset-waveform.selectionStartOffset);
	    $("#select-area-end").css("left",offset);
	    waveform.selectionEndOffset = offset;
	}else {
		if (waveform.isSetAnchor) {
  	      	$("#select-area").css("left",offset).width(waveform.selectionStartOffset - offset);
	        $("#select-area-end").css("left",offset);
	        waveform.selectionEndOffset = offset;
		} else {
			$("#select-area-start").css("left",offset-3);
		    $("#select-area").css("left",offset).width(waveform.selectionStartOffset-offset);
		    $("#select-area-end").css("left",waveform.selectionStartOffset);
		    waveform.selectionEndOffset = waveform.selectionStartOffset;
		    waveform.selectionStartOffset = offset;
		    waveform.isSelectAreaEndMouseDown = false;
		    waveform.isSelectAreaStartMouseDown = true;
		}
	    
	  }
}
function adjustSelectedAreaFromStartLine(offset) {
	var selectedArea = $("#selected-area-"+waveform.focusSelectAreaIndex);
    if(offset < $("#graph").scrollLeft()+selectedArea.position().left+selectedArea.width()){
      $("#selected-area-start-"+waveform.focusSelectAreaIndex).css("left",offset-3);
      selectedArea.width(selectedArea.width()-offset + ($("#graph").scrollLeft()+selectedArea.position().left)).css("left", offset);
      getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(2)")
      .text(toSrtTime(offset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor ));
      if(edit.currentEditIndex == waveform.focusSelectAreaIndex)waveform.selectionStartOffset = offset;
    }else {
      $("#selected-area-start-"+waveform.focusSelectAreaIndex).css("left",$("#graph").scrollLeft()+$("#selected-area-end-"+waveform.focusSelectAreaIndex).position().left-3);
      selectedArea.width(offset-($("#graph").scrollLeft()+$("#selected-area-end-"+waveform.focusSelectAreaIndex).position().left ) ).css("left", $("#graph").scrollLeft()+$("#selected-area-end-"+waveform.focusSelectAreaIndex).position().left);
      $("#selected-area-end-"+waveform.focusSelectAreaIndex).css("left",offset);
      getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(2)")
      .text(getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(3)").text());
      getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(3)")
      .text(toSrtTime(offset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor ));
      if(edit.currentEditIndex == waveform.focusSelectAreaIndex){
        waveform.selectionStartOffset = waveform.selectionEndOffset;
        waveform.selectionEndOffset = offset;
      }

      waveform.isAdjustStartSelectLine = false;
      waveform.isAdjustEndSelectLine = true;

    }
}

function adjustSelectedAreaFromEndLine(offset) {
	var selectedArea = $("#selected-area-"+waveform.focusSelectAreaIndex);
    if(offset > $("#graph").scrollLeft()+selectedArea.position().left){
      $("#selected-area-end-"+waveform.focusSelectAreaIndex).css("left",offset);
      
      selectedArea.width(offset - ($("#graph").scrollLeft()+selectedArea.position().left));
      getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(3)")
      .text(toSrtTime(offset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor ));
      if(edit.currentEditIndex == waveform.focusSelectAreaIndex)waveform.selectionEndOffset = offset;
    }else {
      $("#selected-area-end-"+waveform.focusSelectAreaIndex).css("left",$("#graph").scrollLeft()+$("#selected-area-start-"+waveform.focusSelectAreaIndex).position().left);
      selectedArea.width($("#graph").scrollLeft()+$("#selected-area-start-"+waveform.focusSelectAreaIndex).position().left- offset  ).css("left", offset);
      $("#selected-area-start-"+waveform.focusSelectAreaIndex).css("left",offset-3);
      getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(3)")
      .text(getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(2)").text());
      getSubtitleRow(waveform.focusSelectAreaIndex).children(":nth-child(2)")
      .text(toSrtTime(offset*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor ));
      if(edit.currentEditIndex == waveform.focusSelectAreaIndex){
        waveform.selectionEndOffset = waveform.selectionStartOffset;
        waveform.selectionStartOffset = offset;
      }
      waveform.isAdjustEndSelectLine = false;
      waveform.isAdjustStartSelectLine = true;
      
    }
}

  

function determineScroll(offset) {
	if ( offset - $("#graph").scrollLeft() < 50) {
    	constScroll('left', 4);
    } else if (offset - $("#graph").scrollLeft() > 550) {
    	constScroll('right', 4);
    }
}

function constScroll(direction, speed) {
		if (direction == "left" && waveform.leftScrollHandler == null) {
			clearScrollHandler();
			waveform.leftScrollHandler = setInterval(function(){
			$("#graph").scrollLeft( $("#graph").scrollLeft()-speed);
			var $prevSelectEnd = waveform.isAdjustStartSelectLine || waveform.isAdjustEndSelectLine ? $("#selected-area-end-"+(waveform.focusSelectAreaIndex-1)) : $("#selected-area-end-"+(waveform.pseudoNodeIndex-1));
			if ($prevSelectEnd.length && $prevSelectEnd.position().left > 20) {
				clearScrollHandler();
				}
			}, 18);
		} else if (direction == "right" && waveform.rightScrollHandler == null) {
			clearScrollHandler();
			waveform.rightScrollHandler = setInterval(function(){
				$("#graph").scrollLeft($("#graph").scrollLeft()+speed);
				var $nextSelectStart = waveform.isAdjustStartSelectLine || waveform.isAdjustEndSelectLine ? $("#selected-area-start-"+(waveform.focusSelectAreaIndex+1)) : $("#selected-area-start-"+(waveform.pseudoNodeIndex));
				if ($nextSelectStart.length && $nextSelectStart.position().left < 590) {
					clearScrollHandler();
				}
				}, 18);
			
		}
	
	
	
	
}

function getStringWidth(string, padding){
  return Math.floor($("#stringWidth").html(string).width()+padding);

}

function adjustVocabularyHandler(event){
  if(isChangeText(event))adjustVocabularyWidth($(this).index()+1);
}

function adjustVocabularyWidth(index){
  var japVocab = $("#footer-japanese").children(":nth-child("+index+")");
  var chiVocab = $("#footer-chinese").children(":nth-child("+index+")");
  var japVocabWidth = getStringWidth(japVocab.val(), 10);
  //var chiVocabWidth = getStringWidth(chiVocab.val());
  var chiVocabWidth = chiVocab.width();
  var largerWidth = japVocabWidth > chiVocabWidth ? japVocabWidth : chiVocabWidth;
  largerWidth = Math.ceil(largerWidth);
  japVocab.innerWidth(largerWidth);
  chiVocab.innerWidth(largerWidth);
  chiVocab.find("input").width(largerWidth - chiVocab.find("a").width()-4);
}

function findJapaneseVocab(index){// 0-based
	return $("#footer-japanese").children(":nth-child("+(index+1)+")");// 1 based
	
}

function composeString(event){
  if(event.keyCode == 13){// enter
    var cursorPosition = $(this).getCursorPosition();
    if(cursorPosition != 0 && cursorPosition != $(this).val().length){// not in the beginning and not in the end
    	
    	
      var $nextNode = getJapaneseVocab().val($(this).val().substring(cursorPosition)).insertAfter($(this)).focus().caretTo(0);
      var correspondingChiNode = $("#footer-chinese").children(":nth-child("+($(this).index()+1)+")");
      $combobox = getCombobox();
      $combobox.combobox({source:[]});
      //checkDictionarySource($combobox.find("input"), $nextNode.val(), false);
      $combobox.insertAfter(correspondingChiNode);
      
      adjustVocabularyWidth($(this).index()+1+1);// next node's index
      validateFooterInput($nextNode);

      $(this).val($(this).val().substring(0,cursorPosition) );
      
      $mycombobox = getCombobox();
      $mycombobox.combobox({source:[]});
//      checkDictionarySource($mycombobox.find("input"), $(this).val(), false);
      $mycombobox.insertAfter(correspondingChiNode);
      correspondingChiNode.remove();
      
      adjustVocabularyWidth($(this).index()+1);// my index
      validateFooterInput($(this));

      
      
      var index = $(this).index()-2;// matching 0-based vocabulary index    
      
      $("#footer-reading input").each(function(){
    	  var positions = $(this).attr("data-position").split("-");
    	  var vocabIndex = parseInt(positions[0]);
    	  var startKanjiIndex = parseInt(positions[1]);
    	  var endKanjiIndex = parseInt(positions[2]);
    	  if (vocabIndex == index){
    		  $(this).parent().remove();
    	  }else if (vocabIndex > index){
    		  placeReadingSpan(vocabIndex+1, startKanjiIndex, endKanjiIndex, $(this).val());
    		  $(this).parent().remove();
    	  }
      });
      
      checkDictionarySource($combobox.find("input"), $nextNode.val(), false, index+1);
      checkDictionarySource($mycombobox.find("input"), $(this).val(), false, index);
      
      
      hasChanged();
    }
  }else if(event.keyCode == 8){// backspace
	var cursorPosition = $(this).getCursorPosition();
    if(cursorPosition == 0 && $(this).index() > 2){
    	
      var newVal = $(this).prev().val() + $(this).val();
      var $mergeNode = $(this).val(newVal).focus();
      
      var correspondingChiNode = $("#footer-chinese").children(":nth-child("+($(this).index()+1)+")");
      $combobox = getCombobox();
      $combobox.combobox({source:[]});
      
      $combobox.insertAfter(correspondingChiNode);
      correspondingChiNode.remove();
      
      
      var prevIndex = $(this).index();
      var index = $(this).index()-2;// matching 0-based vocabulary index
      //var prevValLength = $(this).prev().val().length;
      
      $("#footer-japanese").children(":nth-child("+(prevIndex)+")").remove();
      $("#footer-chinese").children(":nth-child("+(prevIndex)+")").remove();
      adjustVocabularyWidth(prevIndex);// prev node index in children
      validateFooterInput($mergeNode);
      //var $prevLastReturnSpan = null;
      $("#footer-reading input").each(function(){
    	  var positions = $(this).attr("data-position").split("-");
    	  var vocabIndex = parseInt(positions[0]);
    	  var startKanjiIndex = parseInt(positions[1]);
    	  var endKanjiIndex = parseInt(positions[2]);
    	  if (vocabIndex == index -1 ){
//    		  $prevLastReturnSpan = placeReadingSpan(vocabIndex, startKanjiIndex, endKanjiIndex, $(this).val());
    		  $(this).parent().remove();
    	  }else if (vocabIndex == index){
    		  $(this).parent().remove();
    	  }else if (vocabIndex > index){
    		  placeReadingSpan(vocabIndex-1, startKanjiIndex, endKanjiIndex, $(this).val());
    		  $(this).parent().remove();
    	  }
    	  
      });
      
      checkDictionarySource($combobox.find("input"), $mergeNode.val(), false,index-1);
      
      
      hasChanged();
      return false;
    }
  }
}

function editPanelReset(){
  edit.isShowVocab = false;
  $("#footer-reading").children(":gt(0)").remove();
  $("#footer-japanese-sentence").val("");//.tooltip( "option", "content", "請在此輸入一句日文歌詞" );
  $("#footer-japanese").children(":gt(1)").remove();
  $("#footer-chinese").children(":gt(1)").remove();
  $("#footer-chinese>input").val("");//.tooltip( "option", "content", "請在此輸入上方日文歌詞對應的中文翻譯" );;
  $("#footer-grammar").children(":gt(0)").remove();
  $("#footer-body").scrollLeft(0);
  
  
}

function isChangeText(event){
    var keyCode = event.keyCode;

    var valid = 
        (keyCode > 47 && keyCode < 58)   || // number keys
        keyCode == 32 || keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keyCode > 64 && keyCode < 91)   || // letter keys
        (keyCode > 95 && keyCode < 112)  || // numpad keys
        (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
        (keyCode > 218 && keyCode < 223) || // [\]' (in order)
        keyCode == 8 || //backspace
        keyCode == 46 ; // delete  
    return valid;
}


function checkFormat(){
  var sentence = "";
  $("#footer-jap-vocabulary").children("input").each(function(index){
    sentence += $(this).val();
  });
  if(sentence != $("#footer-sentence").children(":nth-child(2)").val()   )return false;


  return true;

}

function enterable(event){
  if(event.keyCode == 13){
    if($(this).attr("type") == "checkbox"){
      if($(this).prop('checked') )$(this).prop('checked', false);
      else $(this).prop('checked', true);
    }
    
  }

}

function clickToFocus(){
  $(this).focus();
}

function grammarReorgainize(){
  // if( !$(this).prop('checked') ){
  //   $(this).parent().appendTo($("#footer-grammar"));// with the label together
  // }
  $("#grammar-description").hide();
        

}

function hasChanged(){
	//console.log("change!");
	edit.changed[edit.currentEditIndex] = true;
}

function clearChanged(){
	edit.changed[edit.currentEditIndex] = false;
	
}

function getGrammar(grammar){
	
  var node = $('<label title="'+grammar.explanation+'" class="grammar-element"><input type="checkbox" name="grammar[]" value="'+grammar.id+'">'+ grammar.baseForm +'</label>')
        .keydown(traversable).tooltip(tooltipInit);
        node.children("input").click(clickToFocus).keydown(enterable).focusout(grammarReorgainize).bind('change', hasChanged);
        return node;

}


function determineGrammar(){
  if(!isEditing() || !edit.isJapaneseSentenceChanged)return;
  
  var sentence = $("#footer-japanese-sentence").val().trim();
  //var subtitleRow = getSubtitleRow(edit.currentEditIndex);
  //var grammars = subtitleRow.data("grammar");
  //if( (typeof grammars == 'undefined'  || grammars.grammar.length == 0) && sentence != "" ){// empty grammar
  if( sentence != "" ){// empty grammar
	  $.ajax({
		    type: "GET",
		    url: '/grammar',
		    data: { sentence : encodeURI(sentence) },
		    dataType:"json",
		    success: function(response){
		    	//console.log(edit.currentEditIndex);
//		    	var subtitleRow = getSubtitleRow(edit.currentEditIndex);
//		    	subtitleRow.data("grammar", response);
		    	var $footerGrammar = $("#footer-grammar");
		    	var checkMap = [];
		    	$footerGrammar.find("input").each(function(){
		    		if ($(this).prop('checked')){
		    			checkMap[$(this).val()] = true;
		    		}
		    	});
		    	$footerGrammar.children(":gt(0)").remove();
		    	edit.isJapaneseSentenceChanged = false;
		    	for(var i = 0;i < response.grammar.length;i++){
		    		var node = getGrammar(response.grammar[i]);
		    		if (checkMap[node.children("input").val()])node.children("input").prop('checked', true);
	    	        //node.appendTo($("#footer-grammar"));
		    		$footerGrammar.append(node);
		    	}
		    	
		    	$("#footer-reading > span").remove();
		    	$footerJapanese = $("#footer-japanese");
		    	$footerChinese = $("#footer-chinese");
		    	$footerJapanese.children(":gt(1)").remove();
		    	$footerChinese.children(":gt(1)").remove();
		    	//var oneCharacterWidth = parseInt($("#footer-japanese-sentence").css("font-size"));
		    	
		    	for (var i = 0;i < response.vocabulary.length;i++){
		    		var surfaceForm = response.vocabulary[i].surfaceForm;
		    		$footerJapanese.append(getJapaneseVocab().val(surfaceForm));
		    		
		    		var translations = response.vocabulary[i].translations;
		    		$combobox = getCombobox();
		    		$combobox.combobox({source : translations});
		    		$footerChinese.append($combobox);
		    		adjustVocabularyWidth(i+3);
		    		
		    		/* annotate kanji with hiragana */
		    		
		    		annotateReading(i,surfaceForm, response.vocabulary[i].reading);
		    	}
		    }
		  });
	  		
	  
    
    //var node = $('<label class="grammar-element"><input type="submit" value="完成"></label>').keydown(traversable).appendTo($("#footer-grammar"));
    //node.children("input").keydown(enterable);


  }else if(typeof grammars != 'undefined' && grammars.grammar.length != 0 && sentence != ""){// first determination has been made

  }else {
	  subtitleRow.data("grammar", {grammar : []});
	  
  }

}

function annotateReading(vocabIndex,surfaceForm, reading){
	if (reading != "?" && reading != ""
		&& reading != "「" && reading != "」" ){
		var hiraganaReading = wanakana._katakanaToHiragana(reading);
		var readingIndex = 0;
		for (var j = 0;j < surfaceForm.length;j++){
			if (readingIndex < hiraganaReading.length 
					&& hiraganaReading[readingIndex] == surfaceForm[j])readingIndex++;
			
			if (wanakana._isCharNotKana(surfaceForm[j])
					&& surfaceForm[j] != " " && surfaceForm[j] != "　") {// not hira , not kata
				var endOfKanjiIndex = j+1;
				while (endOfKanjiIndex < surfaceForm.length 
						&& wanakana._isCharNotKana(surfaceForm[endOfKanjiIndex])){
					endOfKanjiIndex++;
				}
				var secondKanjiStartIindex = endOfKanjiIndex;
				while (secondKanjiStartIindex < surfaceForm.length 
						&& wanakana._isCharHiragana(surfaceForm[secondKanjiStartIindex])){
					secondKanjiStartIindex++;
				}
				var substringAfterKanji = surfaceForm.substring(endOfKanjiIndex,secondKanjiStartIindex);
				var endOfKanjiReading = readingIndex+1;
				while (endOfKanjiReading < hiraganaReading.length 
						){
					if(substringAfterKanji != "" && hiraganaReading.substring(endOfKanjiReading).indexOf(substringAfterKanji) == 0)break;
					endOfKanjiReading++;
				}
				placeReadingSpan(vocabIndex, j, endOfKanjiIndex, hiraganaReading.substring(readingIndex, endOfKanjiReading));
				j = endOfKanjiIndex-1;
				readingIndex = endOfKanjiReading;
			}
		}
	}else {// if it's kanji, but not in the dictionary
		for (var j = 0;j < surfaceForm.length;j++){
			if (wanakana._isCharNotKana(surfaceForm[j]) 
					&& surfaceForm[j] != " " && surfaceForm[j] != "　"
					&& surfaceForm[j] != "「" && surfaceForm[j] != "」"
					&& !/^[A-Za-z0-9]+$/.test(surfaceForm[j])	) {// not hira , not kata
				var endOfKanjiIndex = j+1;
				while (endOfKanjiIndex < surfaceForm.length 
						&& wanakana._isCharNotKana(surfaceForm[endOfKanjiIndex])){
					endOfKanjiIndex++;
				}
				var emptyString = "";
				for (var x = 0;x < endOfKanjiIndex - j;x++){
					emptyString += " ";
				}
				placeReadingSpan(vocabIndex, j, endOfKanjiIndex, emptyString);
				j = endOfKanjiIndex;
			}
		}
		
		
	}
	
}

function placeReadingSpan(vocabIndex, startOfKanjiIndex, endOfKanjiIndex, reading){
	//console.log(vocabIndex+"-"+startOfKanjiIndex+"-"+endOfKanjiIndex);	
	var $japaneseVocab = $("#footer-japanese").children(":nth-child("+(3+vocabIndex)+")");
	//var $japaneseVocab = $("#footer-japanese-sentence").nextAll("input:eq("+()+"").get(vocabIndex);
	//console.log($("#footer-japanese").children());
	//console.log($japaneseVocab);
	var startOffset = ($japaneseVocab.width()-$japaneseVocab.val().length*16)/2+$japaneseVocab.position().left+1;// 1 for border-left
	var lengthOfKanji = endOfKanjiIndex-startOfKanjiIndex;
	var lengthOfReading = reading.length;
	var $readingSpan = getReadingSpan().css("left", 
			(startOffset+startOfKanjiIndex*16-(lengthOfReading*6+1-lengthOfKanji*8)) +"px" );
	$readingSpan.find("input").val(reading)
	.attr("data-position",vocabIndex+"-"+startOfKanjiIndex+"-"+endOfKanjiIndex)
	.bind("input", hasChanged)
	.keydown(traversable)
	.width(lengthOfReading*12);
	
	var readingSpans = $("#footer-reading>span");
	for (var i = 0;i <= readingSpans.length;i++){
		//console.log($(readingSpans[i]).find("input").attr("data-position"));
		if (i == readingSpans.length){
			$readingSpan.appendTo("#footer-reading");
		}else {
			var prevPositions = $(readingSpans[i]).find("input").attr("data-position");
			if (vocabIndex < parseInt(prevPositions[0])){
				$(readingSpans[i]).before($readingSpan);
				//console.log("ininder");
				break;
			}else if (vocabIndex == parseInt(prevPositions[0])){
				if (startOfKanjiIndex < parseInt(prevPositions[1])){
					$(readingSpans[i]).before($readingSpan);
					break;
				}
			}
		}
	}
	
	return $readingSpan;
	
}

function getReadingSpan(){
	return $('<span style="position:absolute;"><input style="font-size:10px;" class="subtitle-sentence"/></span>');
}

function getCombobox(){
	//return $("<select style='display:none'></select>");
	return $("<span class='custom-combobox'></span>");
	
}

function scrollToRow(targetRow){
	$("#edit").scrollTop(21*targetRow.index());
}

function changeRowFocus(targetRow, isGraphScroll){
	  isGraphScroll = typeof isGraphScroll !== 'undefined' ? isGraphScroll : true;
	  /* the old row info must be stored */
	  recordRow(edit.currentEditIndex);
	  $("#selected-area-"+edit.currentEditIndex).removeClass("focus");
	  getSubtitleRow(edit.currentEditIndex).removeClass("focus-row");
	  /* start to update current edit index */
	  edit.currentEditIndex =  parseInt(targetRow.children("div.index").text());
	  
	  /* start to process selected-area */
	  moveToSelectedArea($("#selected-area-"+edit.currentEditIndex), isGraphScroll);
	  /* start to add focus to selected area and row */
	  $("#selected-area-"+edit.currentEditIndex).addClass("focus");
	  targetRow.addClass("focus-row");
	  
	  scrollToRow(targetRow);
	  /* restore edit panel info */
	  editPanelReset();
	  
	  

	  for(var i = 0;i < targetRow.data("japanese").length;i++){    
	    //if(i > 0)$("#footer-japanese").children(":nth-child("+(i+1)+")").after(getJapaneseVocab().val(targetRow.data("japanese")[i]));
		if(i > 0){
			edit.isShowVocab = true;
			var $japaneseVocab = getJapaneseVocab().val(targetRow.data("japanese")[i]);
			//$("#footer-japanese").children("input:eq("+(i-1)+")").after($japaneseVocab);
			$("#footer-japanese").append($japaneseVocab);
			validateFooterInput($japaneseVocab);
			//$japaneseVocab.tooltip("close");
		}
	    else {
	    	validateFooterInput($("#footer-japanese-sentence").val(targetRow.data("japanese")[i]));
	    	//$("#footer-japanese-sentence").tooltip("close");
	    }
	  }
	  for(var i = 0;i < targetRow.data("chinese").length;i++){
//	    if(i > 0)$("#footer-chinese").children(":nth-child("+(i+1)+")").after(getChineseVocab().val(targetRow.data("chinese")[i]));
		if(i > 0){
			var $combobox = getCombobox();
			$combobox.combobox({source : []});
			$combobox.find("input").val(targetRow.data("chinese")[i]);
			//$("#footer-chinese").children(":eq("+(i)+")").after($combobox);
			$("#footer-chinese").append($combobox);
			//console.log($("#footer-chinese").children(":eq("+(i-1)+")"));
		}
	    else {
	    	validateFooterInput($("#footer-chinese-sentence").val(targetRow.data("chinese")[i]));
	    	//$("#footer-chinese-sentence").tooltip("close");
	    }
	    
	  }
	  
	  
	  
	  //console.log(targetRow.data("grammar").grammar);
	  for(var i = 0;i < targetRow.data("grammar").grammar.length;i++){
	    var node = getGrammar(targetRow.data("grammar").grammar[i]);
	    node.appendTo($("#footer-grammar"));
	    if(targetRow.data("checked")[i])$(node).find("input[type='checkbox']").prop('checked',true);
	  }

	  for(var i = 0;i < targetRow.data("japanese").length;i++){
	    adjustVocabularyWidth(i+3);
	  }
	  
	  for (var i = 0;i < targetRow.data("reading").length;i++){
		  var positions = targetRow.data("position")[i].split("-");
		  var vocabIndex = positions[0];
		  var startOfKanjiIndex = positions[1];
		  var endOfKanjiIndex = positions[2];
		  placeReadingSpan(parseInt(vocabIndex), parseInt(startOfKanjiIndex), parseInt(endOfKanjiIndex), targetRow.data("reading")[i]);  		  
	  }
	  
	  $("#footer-japanese-sentence").focus();
	  waveform.isSetAnchor = false;
	  $("#anchor-annotation").hide();
	  
	}





function graphScroll(targetSelectedAreaLeft, targetSelectedAreaWidth){
  if(targetSelectedAreaLeft < $("#graph").scrollLeft() || targetSelectedAreaLeft+targetSelectedAreaWidth >= $("#graph").scrollLeft()+$("#graph").width()){
    if(targetSelectedAreaWidth > $("#graph").width()){
      $("#graph").scrollLeft($("#graph").scrollLeft()+ targetSelectedAreaLeft);
    }else $("#graph").scrollLeft($("#graph").scrollLeft()+targetSelectedAreaLeft -($("#graph").width()-targetSelectedAreaWidth)/2 );
  }
}

function moveToSelectedArea(targetSelectedArea, isGraphScroll){
  isGraphScroll = typeof isGraphScroll !== 'undefined' ? isGraphScroll : true;
  hideSelectArea();

  if(isGraphScroll)graphScroll(targetSelectedArea.position().left, targetSelectedArea.width());
  
  waveform.selectionStartOffset = $("#graph").scrollLeft()+targetSelectedArea.position().left;
  waveform.selectionEndOffset = $("#graph").scrollLeft()+targetSelectedArea.position().left+targetSelectedArea.width();
  
  $("#timeline-offset").css("left",waveform.selectionStartOffset);
  waveform.timelineOffset = waveform.selectionStartOffset;
  waveform.isClickNewTimelineOffset = true;
  
}


function getSelectedArea(id, width, left){
  return $("<div id='selected-area-"+id+"' class='selected-area'></div>")
  .css({"width": width, "height": $("#select-area").height(), "left" : left})
  .mousedown(function(event){
    var targetRow = getSubtitleRow($(this).attr('id').split("-")[2]);
    changeRowFocus(targetRow);
    waveform.isFocusSelectedArea = true;
  });

}

function getSelectedAreaStart(id, selectedArea){
  return $("<div id='selected-area-start-"+id+"' class='select-line'></div>")
  .css({"height":$("#svg").height() , "left":$("#graph").scrollLeft()+selectedArea.position().left-3,"display":"inline-block"})
  .mousedown(function(){
    waveform.isAdjustStartSelectLine = true;
    waveform.focusSelectAreaIndex = parseInt($(this).attr("id").split("-")[3]);
    var targetRow = getSubtitleRow(waveform.focusSelectAreaIndex);
    changeRowFocus(targetRow,false);
    waveform.isFocusSelectedArea = true;
  });

}




function getSelectedAreaEnd(id, selectedArea){
  return $("<div id='selected-area-end-"+id+"' class='select-line'></div>").css({"height":$("#svg").height(), "left":$("#graph").scrollLeft()+selectedArea.position().left+selectedArea.width(),"display":"inline-block"})
  .mousedown(function(){
    waveform.isAdjustEndSelectLine = true;
    waveform.focusSelectAreaIndex = parseInt($(this).attr("id").split("-")[3]);
    var targetRow = getSubtitleRow(waveform.focusSelectAreaIndex);
    changeRowFocus(targetRow,false);
    waveform.isFocusSelectedArea = true;
  });

}

function secondToPixel(second){
	return second*waveform.horizontalScaleFactor/100/waveform.timeElapsedPerPixel;
	
}

function pixelToSecond(pixel){
	return pixel*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor;
	
}

function restoreSubtitles(subtitles){
	subtitles.sort(function(subtitleA, subtitleB){
		if(subtitleA.index < subtitleB.index )return 1;
		else if(subtitleA.index > subtitleB.index )return -1;
		return 0;
	});
	edit.numberOfRow = subtitles.length;
	//console.log(subtitles);
	for(var i = 0;i < subtitles.length;i++){
		var startTime = toSecond(subtitles[i].startTime);
		var endTime = toSecond(subtitles[i].endTime);
		edit.currentEditIndex = subtitles[i].index;
		
		var selectedArea = getSelectedArea(subtitles[i].index, secondToPixel(endTime-startTime), secondToPixel(startTime));
		selectedArea.prependTo("#graph");
		getSelectedAreaStart(subtitles[i].index, selectedArea).insertBefore(selectedArea);
		getSelectedAreaEnd(subtitles[i].index, selectedArea).insertAfter(selectedArea);
		var $subtitleRow = $("#clone-base-row").clone(true,true).removeAttr("id").show().prependTo($("#subtitle-body"));
		fillInSubtitleRow($("#selected-area-"+edit.currentEditIndex), $subtitleRow, false, edit.currentEditIndex,
	    		subtitles[i].startTime,
	    		subtitles[i].endTime,
	    		subtitles[i].japaneseSentence);
		initSubtitleRow($subtitleRow, subtitles[i]);
		clearChanged();
		
		
		
	}
	
	
	
	
}

function initSubtitleRow($subtitleRow, subtitle){
	
	$subtitleRow.data("japanese", []);
	$subtitleRow.data("japanese")[0] = subtitle.japaneseSentence;
	for(var i = 0;i < subtitle.japaneseVocab.length;i++){
		$subtitleRow.data("japanese")[i+1] = subtitle.japaneseVocab[i];
	}
	$subtitleRow.data("chinese", []);
	$subtitleRow.data("chinese")[0] = subtitle.chineseSentence;
	for(var i = 0;i < subtitle.chineseVocab.length;i++){
		$subtitleRow.data("chinese")[i+1] = subtitle.chineseVocab[i];
	}
	$subtitleRow.data("grammar", {grammar:subtitle.matched});
	$subtitleRow.data("checked", []);
	for(var i = 0;i < subtitle.matched.length;i++){
		if(subtitle.checked.indexOf(subtitle.matched[i].id) != -1){
			$subtitleRow.data("checked")[i] = true;
		}
	}
	
	$subtitleRow.data("reading", []);
	if (subtitle.reading) {
		for (var i = 0;i < subtitle.reading.length;i++){
			$subtitleRow.data("reading")[i] = subtitle.reading[i];
		}
	}
	$subtitleRow.data("position", []);
	if (subtitle.position){
		for (var i = 0;i < subtitle.position.length;i++){
			$subtitleRow.data("position")[i] = subtitle.position[i];
		}
		
	}
	
	
	
	//$subtitleRow.data("changed",false);
	
	
	
}



function fillInSubtitleRow($selectedArea, $targetRow, isFocus, index, startTime, endTime, japaneseSentence){
	if(isFocus){
		$selectedArea.addClass("focus");
		$targetRow.addClass("focus-row");
		$("#footer-japanese-sentence").focus();
		
	}
	$targetRow.find("div.index").html(index);
	$targetRow.children(":nth-child(2)").html( startTime ) ;
	$targetRow.children(":nth-child(3)").html( endTime );
	$targetRow.children(":nth-child(4)").html( japaneseSentence );
  

}


function recordSelectArea(){

  var startTime = ($("#graph").scrollLeft()+$("#select-area").position().left)*waveform.timeElapsedPerPixel*100/waveform.horizontalScaleFactor;
  var previousNodeIndex = edit.numberOfRow;
  for(;previousNodeIndex >= 1;previousNodeIndex--){
    if(startTime > toSecond( getSubtitleRow(previousNodeIndex).children(":nth-child(2)").text() ) )break;
  }

  for(var i = edit.numberOfRow;i > previousNodeIndex;i--){
    $("#selected-area-"+i).attr("id", "selected-area-"+(i+1));
    $("#selected-area-start-"+i).attr("id", "selected-area-start-"+(i+1));
    $("#selected-area-end-"+i).attr("id", "selected-area-end-"+(i+1));
    getSubtitleRow(i).children(":nth-child(1)").html(i+1);
  }
  var selectedArea = getSelectedArea(previousNodeIndex+1, $("#select-area").width(), $("#graph").scrollLeft()+$("#select-area").position().left);

  if(previousNodeIndex == 0)selectedArea.prependTo("#graph"); 
  else selectedArea.insertAfter( $("#selected-area-end-"+previousNodeIndex));

  getSelectedAreaStart(previousNodeIndex+1, selectedArea).insertBefore(selectedArea);
  getSelectedAreaEnd(previousNodeIndex+1, selectedArea).insertAfter(selectedArea);
  
  return previousNodeIndex;

}

function isSelecting(){
  return (waveform.selectionStartOffset != waveform.selectionEndOffset);
}

function isChanged(index){
	return edit.changed[index];
	
}



function update(index, async){
	  var $subtitleRow = getSubtitleRow(index);
	  var matched = [];
	  var checked = [];
	  
	  for (var i = 0;i < $subtitleRow.data("grammar").grammar.length;i++){
		  var id = $subtitleRow.data("grammar").grammar[i].id;
		  matched.push(id);
		  if($subtitleRow.data("checked")[i]) {
			  checked.push(id);
		  }
	  }
	  //console.log($subtitleRow.data("chinese").slice(1));
	  var readings = $subtitleRow.data("japanese").slice(1);
	  var reading = $subtitleRow.data("reading");
	  var position = $subtitleRow.data("position");
	  for (var i = 0; i < reading.length;i++){
		  var positions = position[i].split("-");
		  var vocabIndex = parseInt(positions[0]);
		  var startIndex = parseInt(positions[1]);
		  var endIndex = parseInt(positions[2]);
		  readings[vocabIndex] = readings[vocabIndex].substring(0, startIndex) 
		  + reading[i] + readings[vocabIndex].substring(endIndex);
	  }
	  
	  $.ajax({
		    type: "POST",
		    url: "update/"+youtube.videoId+"/"+index,
		    data: { data : JSON.stringify({
		    	startTime: getStartTime($subtitleRow), endTime: getEndTime($subtitleRow),
		    	japaneseSentence: $subtitleRow.data("japanese")[0], chineseSentence: $subtitleRow.data("chinese")[0],
		    	japaneseVocab : $subtitleRow.data("japanese").slice(1) , chineseVocab : $subtitleRow.data("chinese").slice(1),
		    	matched : matched, checked: checked,
		    	reading : reading, position : position,
		    	readings : readings
		    }) 
		    	},
		    	async:async,
		    dataType:"json",
		    success: function(response){
		    	//console.log(response);
		    		    	
		    		    }
		  });
	
}


function recordRow(index, async){
  if(!isEditing() || !isChanged(index) )return;
  if (typeof async == "undefined")async = true;
  var subtitleRow = getSubtitleRow(index);
  //if(typeof subtitleRow.data("changed") != 'undefined' && !subtitleRow.data("changed"))return;
  
  
  
  subtitleRow.data("japanese", []).data("chinese", []).
  data("checked", []).data("grammar", {grammar:[]})
  .data("reading", []).data("position", []);// reset
  
  $("#footer-japanese").children("input").each(function(i){
    subtitleRow.data("japanese")[i] = $(this).val();
  });

  $("#footer-chinese").find("input").each(function(i){
    subtitleRow.data("chinese")[i] = $(this).val();
  });
  
  $("#footer-reading").find("input").each(function(i){
	  subtitleRow.data("reading")[i] = $(this).val();
	  subtitleRow.data("position")[i] = $(this).attr("data-position");
  });

  
  var matched = [];
  var checked = [];
  $("#footer-grammar").find("input[type='checkbox']").each(function(i){
	  matched.push($(this).attr("value"));
	  
	  subtitleRow.data("grammar").grammar[i] = {baseForm : $(this).parent().text(), explanation : $(this).parent().attr("title"), id : matched[i]};
	   
	  //console.log(subtitleRow.data("grammar").grammar[i]);
	  if($(this).prop('checked')){
		  checked.push($(this).attr("value"));
		  subtitleRow.data("checked")[i] = true;
	  } 
  });
  
  clearChanged();
  
  
  
  update(index,async);
  
 
   
  
  

  /* send to server to say edit has been made
    For all the global variables, please go to common.js
    like video id is youtube.videoId
    The information is stored in the row with jQuery data function,
    format: data("japanese") : [japanese_sentence, japanese_vocab_1, japanese_vocab_2,...]
            data("chinese") : [chinese_sentence, chinese_vocab_1, chinese_vocab_2,...]
            data("grammar") : {match : [grammarId, grammarId, ...], checked : [grammarId, grammarId, ...]}
            Note that the match is matched grammar recognized by algorithm
            checked is the matched grammar recognized by author, which should be correct
   send to server to say edit has been made*/

}

function getIndex(subtitleRow){
	return subtitleRow.children(":nth-child(1)").text();
}

function getStartTime(subtitleRow){
	return subtitleRow.children(":nth-child(2)").text();
}

function getEndTime(subtitleRow){
	return subtitleRow.children(":nth-child(3)").text();
}

function hideSelectArea(){
  $("#select-area").width(0);
  $("#select-area-start").hide();
  $("#select-area-end").hide();
}

function japaneseSentenceBind(targetRow){
	edit.isJapaneseSentenceChanged = false;
    $("#footer-japanese").children(":nth-child(2)").unbind("keyup").keyup(function(event){
    if(!isChangeText(event))return;
    var newVal = $(this).val();
    $(targetRow).children(":nth-child(4)").text( newVal );
  }).focus();

}


function chineseSentenceBind(targetRow){
  $("#footer-sentence").children(":nth-child(3)").unbind("keyup").keyup(function(e){
      if(!isChangeText(e))return;
      $(targetRow).children(":nth-child(5)").html(  $(this).val() );
    });
}

function isRepeatAddSelectedArea(){
  if(edit.currentEditIndex >= 1 && waveform.selectionStartOffset == $("#graph").scrollLeft()+$("#selected-area-"+edit.currentEditIndex).position().left){
    return true;
  }
  return false;

}



function getJapaneseVocab(){
	  return ($("<input class='subtitle-vocabulary' title='請在此輸入一句日文歌詞' maxlength='"+edit.lengthLimitOfSentence+"'>").keydown(composeString).keydown(traversable))
	  .bind("input", hasChanged).bind("input", function(e){validateFooterInput($(this));});//.tooltip(tooltipInit);
	}

function getChineseVocab(){
	  return ($("<input class='subtitle-vocabulary' title='請在此輸入上方日文單字對應的中文翻譯'>").keydown(traversable).keyup(adjustVocabularyHandler))
	  .bind("input", hasChanged);//.tooltip(tooltipInit);
	}



function validateFooterInput($input){
	var state = 0;
	var message = "";
	if ($input.attr("class") == "subtitle-vocabulary" 
		&& $input.parent().children("input.subtitle-sentence").val().indexOf($input.val()) == -1) {
		message = "單詞不在原本的句子中";
		state = 1;		
	} else if ($input.val().length > edit.lengthLimitOfSentence){
		message =  "長度超過"+edit.lengthLimitOfSentence+"字" ;
		state = 1;
	} else if ($input.val().length == edit.lengthLimitOfSentence) {
		message =  "長度達到上限"+edit.lengthLimitOfSentence+"字" ;
		state = 2;
	}
	
	if (state == 0) {
		$input.css("background" ,"transparent");
		if ($input.attr("id") == "footer-japanese-sentence"){
			//$input.tooltip( "option", "content", "請在此輸入一句日文歌詞" );
		} else if ($input.attr("id") == "footer-chinese-sentence"){
			//$input.tooltip( "option", "content", "請在此輸入上方日文句子對應的中文翻譯" );
		} else {
			//$input.tooltip( "option", "content", "請在此以Enter斷開日文歌詞，得到組成歌詞的單字。可用Backspace把單字復合。" );
		}
		return true;// OK
	} else if (state == 1){
		$input.css("background" ,"red");//.tooltip( "option", "content", message );		
		return false;// fail
	} else if (state == 2) {
		$input.css("background" ,"transparent")//.tooltip( "option", "content", message );
		return true;// OK, it's just reaching limit
	}				
	
}

function traversable(event){
  if(event.keyCode == 37){// Left	
    if($(this).getCursorPosition() == 0){
      //validateFooterInput($(this));
      var $prevInputNode;
      if ($(this).parent().is("span.custom-combobox") 
    		  || typeof $(this).attr("data-position") != "undefined") {
    	  $prevInputNode = $(this).parent().prev().find("input").addBack("input");
      } else {
    	  $prevInputNode = $(this).prev();  
      }
      $prevInputNode.focus().caretTo($prevInputNode.val().length);
      return false;
    }

  }else if(event.keyCode == 38){// Up
	//validateFooterInput($(this));
    var parentNode = $(this).parent();
    if ($(this).attr("id") != "footer-japanese-sentence" 
    	&& parentNode.attr("id") == "footer-japanese"  ){
    	var vocabIndex = $(this).index()-2;
    	var cursorPosition = $(this).getCursorPosition();
    	$("#footer-reading input").each(function(i){
    		var positions = $(this).attr("data-position").split("-");
    		var i = positions[0];
    		if (vocabIndex == parseInt(i) 
    				&& cursorPosition >= parseInt(positions[1])
    				&& cursorPosition <= parseInt(positions[2])){
    			$(this).focus();
    			return false;
    		}
    	});
    }else if(parentNode.attr("id") == "footer-chinese"){
      parentNode.prev().children(":nth-child("+ ($(this).index()+1)+")").focus();
    }else if(parentNode.attr("id") == "footer-grammar"){
      parentNode.prev().children("input")[0].focus();
    }
    
  }else if(event.keyCode == 39){//Right
    if($(this).getCursorPosition() == $(this).val().length){
    	//validateFooterInput($(this));
      var $nextInputNode;
      
      if ($(this).parent().is("span.custom-combobox")
    		  || typeof $(this).attr("data-position") != "undefined") {
    	$nextInputNode = $(this).parent().next().find("input");
      } else if ($(this).attr("id") == "footer-chinese-sentence"){
    	  $nextInputNode = $(this).next().find("input");  
      } else {
    	  $nextInputNode = $(this).next(); 
      }
      $nextInputNode.focus().caretTo(0);
      
      return false;
    }

  }else if(event.keyCode == 40){// Down
	  //validateFooterInput($(this));
    var parentNode = $(this).parent();
    if (typeof $(this).attr("data-position") != "undefined"){
    	var positions = $(this).attr("data-position").split("-");
		var i = parseInt(positions[0]);
		var startOfKanjiIndex = parseInt(positions[1]);
		$("#footer-japanese").children(":nth-child("+(i+3)+")").focus().caretTo(startOfKanjiIndex);
		return false;
    }else if(parentNode.attr("id") == "footer-japanese"){
    	parentNode.next().children(":nth-child("+ ($(this).index()+1)+")").find("input").addBack("input").focus();
    	return false;
    } else if(parentNode.attr("id") == "footer-chinese" ){
      var grammars =  parentNode.next().find("input");
      if(grammars[0] != null)grammars[0].focus();
    }
  }
}

function getSubtitleRow(index){// index is 1-based, which means starting from 1
  return $("#subtitle-body").children(":nth-child("+index+")");
}

var chineseOn = true;
var japaneseOn = true;

var buttonBackground = "#6E6E6E";
var buttonOnColor = "#FF0000";
var buttonOffColor = "#6E6E6E";

$(document).ready(function(){
	$("#toggle-ch").click(function(){
		chineseOn = !chineseOn;
		toggleChinese();
		toggleButtonColor(chineseOn, this);
		if(chineseOn) {
			$.cookie("chinese", "on", {expires: 3650, path: "/learn"});
		}
		else {
			$.cookie("chinese", "off", {expires: 3650, path: "/learn"});
		}
	});
	$("#toggle-jp").click(function(){
		japaneseOn = !japaneseOn;
		toggleJapanese();
		toggleButtonColor(japaneseOn, this);
		if(japaneseOn) {
			$.cookie("japanese", "on", {expires: 3650, path: "/learn"});
		}
		else {
			$.cookie("japanese", "off", {expires: 3650, path: "/learn"});
		}
	});
	
	/* create romaji */
	$(".hiragana").each(function() {
		var romaji = "<span class=\"romaji\">" + wanakana.toRomaji(this.innerHTML) + "</span><br>";
		$(this).next().after(romaji);
	});
	$(".addHiragana").each(function() {
		/* TODO how to present っ */
		var romaji = wanakana.toRomaji(this.innerHTML);
		if(wanakana.isKana(this.innerHTML) && romaji != "") {
			/* TODO check part of speech */
			if($(this).hasClass("wa")) {
				romaji = "wa";
			}
			var romaji = "<span class=\"romaji\">" + romaji + "</span><br>";
			$(this).before(romaji);
		}
	});

	/* decide initial caption list width */
	CAPTION_LIST_OFFEST = 40;
	CAPTION_LIST_MIN_WIDTH = $("#caption-list").width();
	setCaptionListWidth();
	
	var previousPronunciation = $("#pronunciation-hiragana");
	$("#pronunciation-none").click(function() {
		previousPronunciation.css("color", "#6E6E6E");
		$("#pronunciation-type").css("color", "#6E6E6E");
		previousPronunciation = $(this).css("color", "#FF0000");

		/* hide pronunciation */
		$(".hiragana").css("display", "none");
		$(".hiragana + br").css("display", "none");
		$(".romaji").css("display", "none");
		$(".romaji + br").css("display", "none");
		
		setCaptionListWidth();
		
		$.cookie("ruby", "none", {expires: 3650, path: "/learn"});
	});
	$("#pronunciation-hiragana").click(function() {
		previousPronunciation.css("color", "#6E6E6E");
		$("#pronunciation-type").css("color", "#FF0000");
		previousPronunciation = $(this).css("color", "#FF0000");

		/* show hiragana and hide romaji */
		$(".romaji").css("display", "none");
		$(".romaji + br").css("display", "none");
		$(".hiragana").css("display", "inline");
		$(".hiragana + br").css("display", "inline");
		
		setCaptionListWidth();
		
		$.cookie("ruby", "hiragana", {expires: 3650, path: "/learn"});
	});
	$("#pronunciation-romaji").click(function() {
		previousPronunciation.css("color", "#6E6E6E");
		$("#pronunciation-type").css("color", "#FF0000");
		previousPronunciation = $(this).css("color", "#FF0000");
		
		/* show romaji and hide hiragana */
		$(".hiragana").css("display", "none");
		$(".hiragana + br").css("display", "none");
		$(".romaji").css("display", "inline");
		$(".romaji + br").css("display", "inline");
		
		setCaptionListWidth();
		
		$.cookie("ruby", "romaji", {expires: 3650, path: "/learn"});
	});
	
	$("#repeat").click(function(){
		isRepeat = !isRepeat;
		if(isRepeat) {
			$(this).css("animation-play-state", "running");
		}
		else {
			$(this).css("animation-play-state", "paused");
		}
	});
	$("#play-previous").click(function() {
		repeatIndex -= 1;
		if(repeatIndex < 0) {
			repeatIndex = 0;
		}
		player.seekTo(captionList[repeatIndex].startTime);
		approximateTime = captionList[repeatIndex].startTime;
		skipOneUpdate = true;
	});
	$("#play-next").click(function() {
		repeatIndex += 1;
		if(repeatIndex >= captionList.length) {
			repeatIndex = captionList.length - 1;
			return;
		}
		player.seekTo(captionList[repeatIndex].startTime);
		approximateTime = captionList[repeatIndex].startTime;
		skipOneUpdate = true;
	});
	
	/* TODO: whether pop on left? */
	/* bootstrap poopover */
	$(".caption-item").popover({ 
		html : true,
	    content: function() {
	    	return $(this).find(".grammar").html();
	    },
	    placement: function() {
	    	return "right";
	    }
	});
	$(".caption-item").on("show.bs.popover", function() {
		$(".panel.panel-default").width($("#video-and-lyric").width() - 43);
	});
	// scroll popover with caption-item
	var previousOffset;
	var OFFSET_FROM_TOP = $("#caption-list").offset().top;
	var OFFSET_FROM_BOTTOM = 5;
	$(".caption-item").on("shown.bs.popover", function() {
		previousOffset = $(".nano-content").scrollTop();
	});
	$(".nano-content").scroll(function() {
		if($(".popover:not(:has(#shortcut-table))").length != 0) {
			var currentOffset = $(".nano-content").scrollTop();
			$(".popover:not(:has(#shortcut-table))").css("top", parseInt($(".popover:last").css("top")) - (currentOffset - previousOffset));
			previousOffset = currentOffset;
		}
	});
	// dismiss popover when click outside popover
	$("body").on("click", function(e) {
	    $("[data-toggle='popover']").each(function () {
	        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $(".popover").has(e.target).length === 0) {
	            $(this).popover("hide");
	        }
	    });
	});
	// close button in popover
	$("#caption-list").on("click", ".close-popover", function(e) {
		$("[data-toggle='popover']").each(function () {
            $(this).popover("hide");
	    });
	});
	// shortcut popover
	// TODO: choose English font that won't confuse l and i
	$("#shortcut").popover({ 
		html : true,
	    content: function() {
	    	return "<table id ='shortcut-table' class='table table-striped'>" +
		    	       "<thead>" +
		    	           "<tr>" +
			    		       "<th>快捷鍵</th>" +
			    		       "<th>功能</th>" +
		    		       "</tr>" +
		    		   "</thead>" +
		    		   "<tbody>" +
		    		       "<tr>" +
		    		           "<td>空白鍵</td>" +
		    		           "<td>影片播放/暫停</td>" +
		    		       "</tr>" +
		    		       "<tr>" +
	    		               "<td>左方向鍵</td>" +
	    		               "<td>上一句</td>" +
	    		           "</tr>" +
		    		       "<tr>" +
    		                   "<td>右方向鍵</td>" +
    		                   "<td>下一句</td>" +
    		               "</tr>" +
		    		       "<tr>" +
		                       "<td>l (loop)</td>" +
		                       "<td>循環播放</td>" +
		                   "</tr>" +
		    		       "<tr>" +
		                       "<td>c (chinese)</td>" +
		                       "<td>切換顯示中文</td>" +
		                   "</tr>" +
		    		       "<tr>" +
		                       "<td>j (japanese)</td>" +
		                       "<td>切換顯示日文</td>" +
		                   "</tr>" +
		    		       "<tr>" +
	                           "<td>h (hiragana)</td>" +
	                           "<td>切換顯示平假名</td>" +
	                       "</tr>" +
		    		       "<tr>" +
	                           "<td>r (romaji)</td>" +
	                           "<td>切換顯示羅馬拼音</td>" +
	                       "</tr>" +
		    		       "<tr>" +
	                           "<td>n (none)</td>" +
	                           "<td>不顯示拼音</td>" +
	                       "</tr>" +
		    		   "</tbody>" +
	    		   "</table>";
	    },
	    placement: function() {
	    	return "top";
	    }
	});
	// add title for built in tooltip
	$("#shortcut").attr("title", "快捷鍵");
	
	/* nanoScroller */
	/* TODO: preventPageScrolling fail at end */
	$(".nano").nanoScroller({ preventPageScrolling: false });
	
	/* bootstrap tooltip */
	$("[data-toggle='tooltip']").tooltip();
	
	/* report button */
	var form = $("#report-form")[0];
	$("#submit-report").click(function() {
		$.post("/report",
				{
					type: form.elements[0].value,
					description: form.elements[1].value
				},
				function(data, status) {
					// no call back
				}
		);
		form.reset();
		$("#thanks").delay(200).fadeIn("fast").delay(1000).fadeOut("slow");
	});
	$("#thanks button").click(function() {
		$("#thanks").hide();
	});
	
	/* keyboard shortcut */
	$(document).keydown(function(e) {
		switch(e.which) {
			// space: pause/play
			case 32:
				var state = player.getPlayerState();
				
				if(state == YT.PlayerState.PLAYING || state == YT.PlayerState.BUFFERING) {
					player.pauseVideo();
				}
				else {
					player.playVideo();
				}
				
				e.preventDefault();
				break;
			// left arrow: previous lyric
			case 37:
				$("#play-previous").click();
				break;
			// right arrow: next lyric
			case 39:
				$("#play-next").click();
				break;
			// c: toggle chinese
			case 67:
				$("#toggle-ch").click();
				break;
			// h: toggle hiragana
			case 72:
				if($("#pronunciation-hiragana").is(previousPronunciation)) {
					$("#pronunciation-none").click();
				}
				else {
					$("#pronunciation-hiragana").click();
				}
				break;
			// j: toggle japanese
			case 74:
				$("#toggle-jp").click();
				break;
			// l: loop
			case 76:
				$("#repeat").click();
				break;
			// n: no ruby
			case 78:
				$("#pronunciation-none").click();
				break;
			// r: toggle romaji
			case 82:
				if($("#pronunciation-romaji").is(previousPronunciation)) {
					$("#pronunciation-none").click();
				}
				else {
					$("#pronunciation-romaji").click();
				}
				break;
		}
	});
	// konami
	var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
	var konami_pointer = 0;
	$(document).keydown(function(e) {
		if(e.which == konami[konami_pointer]) {
			konami_pointer++;
		}
		else if(e.which == 38) {
			konami_pointer = 1;
		}
		else {
			konami_pointer = 0;
		}
		
		if(konami_pointer == 10) {
			var logo = $(".logo");
			
			logo.fadeOut("slow", function() {
				if(logo.attr("src") == "/img/logo.png") {
					logo.attr("src", "/img/logo_beta.png");
				}
				else {
					logo.attr("src", "/img/logo.png");
				}
				logo.fadeIn("slow");
			});
			konami_pointer = 0;
		}
	});
	
	/* restore user setting */
	if($.cookie("chinese") == "off") {
		$("#toggle-ch").click();
	}
	if($.cookie("japanese") == "off") {
		$("#toggle-jp").click();
	}
	if($.cookie("ruby") == "none") {
		$("#pronunciation-none").click();
	}
	else if($.cookie("ruby") == "romaji") {
		$("#pronunciation-romaji").click();
	}
	else if($.cookie("ruby") == "hiragana") {
		/* default is hiragana, no action */
	}
});

function toggleChinese() {
	$(".chinese-item").toggle();
}

function toggleJapanese() {
	$(".japanese-item").toggle();
	$(".japanese-item").next().toggle();
}

function toggleButtonColor(isOn, element) {
	if(isOn) {
		$(element).css("color", buttonOnColor);
	}
	else {
		$(element).css("color", buttonOffColor);
	}
}

function setCaptionListWidth() {
	var maxWidth = 0;
	
	$(".lyric-item").each(function() {
		if($(this).width() > maxWidth) {
			maxWidth = $(this).width();
		}
	});
	maxWidth += CAPTION_LIST_OFFEST;
	if(maxWidth < CAPTION_LIST_MIN_WIDTH) {
		maxWidth = CAPTION_LIST_MIN_WIDTH;
	}
	
	$("#caption-list").width(maxWidth);
	// caption-item's width will change when grammar pop up during video playing
	// and let grammar which pop to right get the undesired position
	// this is a temporary work around
	$(".caption-item").width(maxWidth);
	$("#topHalf").css("padding-left", maxWidth+4);
}
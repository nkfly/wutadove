// insert youtube api in asynchronous way
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('youtube', {
		events: {
			'onReady': onPlayerReady,
		}
	});
}

var UPDATE_INTERVAL = 50;
function onPlayerReady(event) {
	setInterval(updatePlayerInfo, UPDATE_INTERVAL);

	player.addEventListener("onStateChange", function(e) {
		if(e.data == YT.PlayerState.PLAYING || e.data == YT.PlayerState.BUFFERING) {
			$(".nano-content").css("overflow-y", "hidden");
			$(".nano-pane").css("visibility", "hidden");
		}
		else {
			$(".nano-content").css("overflow-y", "auto");
			$(".nano-pane").css("visibility", "visible");
		}
	});
}

var preIndex = 0;
repeatIndex = 0;
isRepeat = false;
/* TODO need refactor */
function updatePlayerInfo() {
	var indexAndLyric = findCurrentIndex(getCurrentTime());
	var currentIndex = indexAndLyric.index;
	var currentLyric = indexAndLyric.lyric;
	
	if(isRepeat) {
		if(currentLyric == "" || currentIndex != repeatIndex) {
			player.seekTo(captionList[repeatIndex].startTime);
			return;
		}
	}
	
	//update lyric
	$("#caption-detail").html(currentLyric);
	//update lyric list
	if(preIndex != currentIndex) {
		$("#caption-list .caption-item:nth-child("+(preIndex+1)+")").css("background-color", "inherit");
	}
	$("#caption-list .caption-item:nth-child("+(currentIndex+1)+")").css("background-color", "#FFFF99");
	preIndex = currentIndex;
	repeatIndex = currentIndex;
	
	currentIndex -= 2;
	if(currentIndex < 0) {
		currentIndex = 0;
	}
	
	var state = player.getPlayerState();
	if(state == YT.PlayerState.PLAYING || state == YT.PlayerState.BUFFERING) {
		$(".nano").nanoScroller({ scrollTo: $("#" + currentIndex).parent() });
	}
}

var lastUpdateTime = 0;
var approximateTime = 0;
var skipOneUpdate = false;
function getCurrentTime() {
	var currentTime = player.getCurrentTime();
	
	if(lastUpdateTime == currentTime) {
		if(player.getPlayerState() == YT.PlayerState.PLAYING) {
			approximateTime += 0.05;
		}
	}
	else {
		if(skipOneUpdate) {
			if(player.getPlayerState() == YT.PlayerState.PLAYING) {
				approximateTime += 0.05;
			}
			skipOneUpdate = false;
		}
		else {
			approximateTime = currentTime;
		}
		lastUpdateTime = currentTime;
	}
	
	return approximateTime;
}

function findCurrentIndex(time) {
	var low = 0;
	var high = captionList.length-1;
	
	while(low <= high) {
		var middle = Math.floor((low + high)/2);
		var compared = compareTime(time, captionList[middle]);
		
		if(compared == 0) {
			return {index: middle, lyric: getCurrentLyric(middle)};
		}
		else if(compared == -1) {
			high = middle - 1;
		}
		else if(compared == 1) {
			low = middle + 1;
		}
	}
	
	return {index: middle, lyric: ""};
}

/**
 * @param time current time
 * @param lyric lyric object which contain start time and end time
 * @returns 0 for between, 1 for time after lyric, -l for time before lyric
 */
function compareTime(time, lyric) {
	if(time >= lyric.startTime && time <= lyric.endTime) {
		return 0;
	}
	else if(time < lyric.startTime) {
		return -1;
	}
	else if(time > lyric.endTime) {
		return 1;
	}
}

function getCurrentLyric(index) {
	var lyric = "<span>";
	
	if(japaneseOn) {
		lyric += captionList[index].japanese;
	}
	lyric += "</span><br /><span>";
	if(chineseOn) {
		lyric += captionList[index].chinese;
	}
	lyric += "</span>";
	
	return lyric;
}

$(".fa.fa-play-circle").click(function(e) {
	repeatIndex = this.id;
	if(player.getPlayerState() != YT.PlayerState.PLAYING || player.getPlayerState() != YT.PlayerState.BUFFERING) {
		player.playVideo();
	}
	player.seekTo(captionList[this.id].startTime);
	approximateTime = captionList[this.id].startTime;
	skipOneUpdate = true;
	
	e.stopPropagation();
});
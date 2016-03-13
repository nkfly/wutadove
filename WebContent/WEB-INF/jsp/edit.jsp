<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <link rel="stylesheet" href="/css/bootstrap-in-edit.css">
	<%@include file="/WEB-INF/jsp/head.jsp" %>
	<title>屋塔斑鳩-日文歌學日文</title>
	<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
	<c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/edit.min.js"></script>
    </c:when>
    <c:otherwise>    
    <script type="text/javascript" src="/js/development-in-secret/youtube.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/waveform.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/combobox.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/edit.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/control.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/wanakana.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/mousewheel.js"> </script>
    <script type="text/javascript" src="/js/development-in-secret/edit-event-bind.js"> </script>    
    </c:otherwise>
	</c:choose>
	<script type="text/javascript">
	function onYoutubeApiLoad() {
		$(document).ready(function(){
			var request = gapi.client.youtube.videos.list({
			    part: 'snippet,contentDetails',
			    id : "${videoId}"
			  });
			request.execute(function(response) {
				sendUrlToServer("${videoId}", response);			          
			        
			  });			
	    });	
	}
	
	$(document).ready(function(){
		if (${showUse}) {
        	$("#how-tab").trigger("click");
        	$("#origin").trigger("click");
		}
		
	});
	</script>
	<link href="/css/font-awesome.min.css" rel="stylesheet">
    </head>
<body id="body">
  <%@include file="/WEB-INF/jspf/header.jspf" %>
  <div class="main">
    <div id="container" class="container">
    <div style="display:none;height:330px; overflow:auto;" id="graph">
    <i id="anchor-annotation" style="position:absolute;display:none;top:265px;z-index:100;"class="fa fa-anchor fa-lg"></i>
      <svg id="svg"></svg>
      <img id="loading" style="display:block;height:inherit; width: 330px;margin-left:auto;margin-right:auto;" src="/img/loading.gif">
      <div id="timestamp" >
      </div>
    </div>
    <div id="video" style="display:inline-block;">
      <div id="player">
      </div>
      <div id="control">
        <div class="button" title="新增字幕" id="add"><img class="button-icon" src="/img/add.png"></div>
        <div class="button" title="循環播放" id="loop"><div id="loop-mask" class="button-mask"></div><img class="button-icon" src="/img/loop.png"></div>
        <div class="button" title="刪除字幕" id="delete"><img class="button-icon" src="/img/delete.png"></div>
        <div class="button" title="設下錨點" id="anchor"><div id="anchor-mask" class="button-mask"></div><img class="button-icon" src="/img/anchor.jpg"></div>
        <div class="button" title="波形間距調整" id="horizontal-scale">
          <div class="sacle-adjust-container" id="horizontal-adjust">
            <div class="scale-bar">
              <div class="scale-icon"></div>
            </div>
          </div>
          <img class="button-icon" src="/img/horizontal.png">
        </div>
        <div class="button" title="波形振幅調整" id="vertical-scale">
          <div class="sacle-adjust-container" id="vertical-adjust">
            <div class="scale-bar">
              <div class="scale-icon"></div>
            </div>
          </div>
        <img class="button-icon" src="/img/vertical.png">
      </div>
      <div class="button" data-popover="${comment}" title="附註" id="comment"><img style="width"class="button-icon" src="/img/comment.png"></div>
      <div class="button" title="發佈" id="publish"><div id="publish-mask" class="button-mask"></div><img class="button-icon" src="/img/publish.png"></div>
      </div>
    </div>
    <div id="edit" >
      <div class="subtitle-head">
        <div class="subtitle-cell index">#</div>
        <div class="subtitle-cell srt-time">開始</div>
        <div class="subtitle-cell srt-time">結束</div>
        <div style="text-align:center;"class="subtitle-cell subtitle-text">歌詞</div>
      </div>
      <div id="subtitle-body" style="position:relative;display:inline-block">
        <div class="subtitle-row" id="clone-base-row">
          <div class="subtitle-cell index"></div>
          <div class="subtitle-cell srt-time"></div>
          <div class="subtitle-cell srt-time"></div>
          <div class="subtitle-cell subtitle-text"></div>
        </div>
      </div>
    </div>
  </div>
  <div id="edit-footer">
    <div class="container">
      <div style="width:240px;display:inline-block;vertical-align:top;position:fixed;">
      	<div class="footer-row-header"></div>
      	<div class="footer-row-header">標音</div>
      	<div class="footer-row-header">日文</div>
      	<div class="footer-row-header">中文</div>
      	<div class="footer-row-header">文法</div>
      </div>
      <div id="footer-body" style="display:inline-block;width:745px;position:relative;left:240px;overflow-x:hidden;">
	      <div id="footer-header">
	       	<div style="border:0px;color:white;text-align:center;" class="subtitle-cell subtitle-text">句子</div>
	       	<div style="border:0px;color:white;text-align:center;" class="subtitle-cell subtitle-text">單字</div>
	      </div>
	      <div class="footer-row-body" id="footer-reading">
	      	<div></div>
	      </div>
	      <div class="footer-row-body" id="footer-japanese">
	        <div></div>
	        <input id="footer-japanese-sentence"class="subtitle-sentence" maxlength="${maxLength}" title="請在此輸入一句日文歌詞">
	      </div>
	      <div class="footer-row-body" id="footer-chinese">
	        <div></div>
	        <input id="footer-chinese-sentence" class="subtitle-sentence" maxlength="${maxLength}" title="請在此輸入上方日文句子對應的中文翻譯">
	      </div>
	      <div class="footer-row-body" id="footer-grammar">
	        <div></div>
	      </div>
      </div>
    </div>
  </div>
</div>
  <div id="stringWidth"></div>
  <div id="curtain"></div>
  <%@include file="/WEB-INF/jspf/footer.jspf" %>
</body>
</html>
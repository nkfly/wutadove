<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.wutadove.util.Lyric" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <%@ include file="/WEB-INF/jsp/head.jsp" %>
    <title>${title} - 屋塔斑鳩</title>
    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/nanoscroller.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
    <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js"></script>
    <script type="text/javascript" src="/js/min/wanakana.min.js"></script>
    <script type="text/javascript" src="/js/min/jquery.nanoscroller.min.js"></script>
    <script type="text/javascript" src="/js/development-in-secret/learn.js"></script>
	
    <%-- TODO rearrange css --%>
    <style>
    
    /* override bootstrap */
    
    * {
      box-sizing: content-box;
    }
    
    .form-control {
      box-sizing: border-box;
    }
    
    a,
    a:hover {
      color: inherit;
      text-decoration: none;
    }
    
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: inherit;
    }
    
    .page-header {
      margin: 0px 0px 20px 0px
    }
    
    /* TODO: Try to remove this */
    #keyin-submit {
      box-sizing: border-box;
    }
    
    .tooltip {
      font-size: 18px;
    }
    
    .panel {
      margin-bottom: 10px;
    }

    .panel:last-child {
      margin-bottom: 0px;
    }
    
    .popover {
      max-width: 839px;
    }

    /* nano scroller */
    
    .nano .nano-pane {
      width: 8px;
    }
    
    /* tag style */
    
    textarea {
      resize: none;
    }
        
    body {
      background-color: rgba(218,218,218,1);
    }

    /* layout */

    /* TODO: This override main.css, may need make change to main.css */
    /* TODO: merge to containerl */
    .mainl {
      position: relative;
      top: 47px;
      text-align: center;
    }
  
    .containerl {
      min-width: 970px;
      max-width: 1263px;
      width: 75%;
      margin: 0 auto;
    }

    #topHalf {
      position: relative;
      padding-left: 409px;
    }

    #video-and-lyric {
      vertical-align: top;
    }

    /* responsive youtube */
    
    .videoWrapper {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 */
      padding-top: 25px;
      height: 0;
    }
  
    #youtube {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    /* responsive facebook plugin */

    .fb_iframe_widget,
    .fb_iframe_widget span,
    .fb_iframe_widget span iframe[style] {
      min-width: 100% !important;
      width: 100% !important;
    }

    /* lyrics list */
    
    #caption-list {
      position: absolute;
      left: 0px;
      height: 100%;
      width: 405px;
      background-color: #E6E6E6;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.05);
      -moz-box-shadow: 0 1px 2px rgba(0,0,0,.05);
      box-shadow: 0 1px 2px rgba(0,0,0,.05);
      text-align: left;
    }

    .caption-item {
      margin-bottom: 4px;
      cursor: pointer;
    }

    .caption-item span[data-toggle='tooltip']{
      color: #7A0000;
    }
  
    .caption-item span[data-toggle='tooltip']:hover{
      color: #FF0000;
    }
        
    .play-icon {
      display: inline-block; 
      width: 32px;
      text-align: center; 
      font-size: 25px;
      vertical-align: top;
    }

    .fa.fa-play-circle {
      cursor: pointer;
    }
      
    .lyric-item {
      display: inline-block;
      font-size: 18px;
    }
    
    .japanese-item {
      font-weight: 900;
    }
    
    .japanese-item > span {
      white-space: pre;
    }
    
    .ruby {
      display: inline-block;
      text-align: center;
    }
  
    /* default is show hiragana */
    .hiragana {
      font-size: 12px;
      letter-spacing: -2px;
      position: relative;
      top: 3px;
      line-height: 95%;
    }
  
    .romaji {
      font-size: 12px;
      position: relative;
      top: 3px;
      line-height: 95%;
      display: none;
    }
  
    .romaji + br {
      display: none;
    }

    .grammar {
      display: none;
    }

    .no-grammar {
      text-align: center;
      width: 130px;
    }
  
    /* simultaneous lyric */
    
    #caption-detail {
      position: relative;
      color: #FFFFFF;
      width: inherit;
      height: 44px;
      font-size: 17px;
      text-align: center;
      background-color: rgba(0,0,0,0.9);
      padding: 21px 0px 15px 0px;
    }
    
    /* control panel */
    
    #control-panel{
      background-color: rgba(0,0,0,0.9);
      box-sizing: border-box;
      width: inherit;
      min-height: 30px;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      font-size: 0px;
      padding: 0px 5px 0px 10px;
    }

    #control-left {
      display: inline-block;
      width: 33%;
      text-align: left;
    }
    
    #control-middle {
      display: inline-block;
      width: 34%;
      text-align: center;
    }
    
    #control-right {
      display: inline-block;
      width: 33%;
      text-align: right;
    } 

    /* TODO: cleanup style of control button */
    .control-button {
      display: inline-block;
      color: #FFFFFF;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      font-size: 16px;
      cursor: pointer;
      padding: 0px 2px;
    
      /* selectability */
      -webkit-user-select: none;  /* Chrome all / Safari all */
      -moz-user-select: none;     /* Firefox all */
      -ms-user-select: none;      /* IE 10+ */
      /* No support for these yet, use at own risk */
      -o-user-select: none;
      user-select: none;
    }
    
    .control-fa {
      color: #FFFFFF;
      font-size: 14px;
      vertical-align: middle;
    }
    
    #toggle-ch:hover, 
    #toggle-jp:hover {
      background-color: rgba(50%, 50%, 50%, 0.3);
    }
    
    /* default on (#FF0000): ch, jp */
    #toggle-ch {
      color: #FF0000;
    }
    
    #toggle-jp {
      color: #FF0000;
    }
    
    #play-previous {
      font-size: 25px;
    }
    
    #play-previous:active {
      text-shadow: 0px 0px 5px #FF0000;
    }
    
    #repeat {
      font-size: 20px;
      margin: 0px 20px;
      -webkit-animation-play-state: paused; /* Chrome, Safari, Opera */
      animation-play-state: paused;
    }
    
    #repeat:active {
      text-shadow: 0px 0px 5px #FF0000;
    }
    
    #play-next {
      font-size: 25px;
    }
    
    #play-next:active {
      text-shadow: 0px 0px 5px #FF0000;
    }
    
    #shortcut {
      font-size: 20px;
      margin-right: 5px;
    }
    
    #shortcut-table {
      width: 400px;
    }
    
    #go-to-edit {
	    font-size: 20px;
	    margin-right: 5px;
    }
    
    #go-to-edit:active {
      text-shadow: 0px 0px 5px #FF0000;
    }
    
    #report-error {
      font-size: 20px;
      margin-right: 20px;
    }
    
    #report-error:active {
      text-shadow: 0px 0px 5px #FF0000;
    }
    
    /* drop down menu of pronunciation */
    
    #pronunciation {
      list-style: none;
      color: #6E6E6E;
      margin: 0px;
    }
    
    #pronunciation > li:hover {
      background-color: rgba(50%, 50%, 50%, 0.3);
    }
  
    #pronunciation ul {
      display: none;
      list-style: none;
      padding: 0px;
      position: relative;
      z-index: 999;
      background-color: rgba(0,0,0,0.9);
    }
    
    #pronunciation li:hover > ul {
      display: block;
    }
    
    #pronunciation li > ul > li {
      padding: 0px 5px;
    }
    
    #pronunciation li > ul > li:hover {
      background-color: rgba(50%, 50%, 50%, 0.3);
    }
    
    /* default is show hiragana */
    #pronunciation-hiragana,
    #pronunciation-type {
        color: #FF0000;
    }

    /* bottom half */

    #fb-plugin {
      text-align: left;
    }
    
    #title {
      font-weight: bold;
    }
    
    #comment {
    	margin: 10px 0px 0px 0px
    }

    /* other elements style */
    
    #thanks {
      width: 200px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      position: fixed;
      top: 60px;
      left: 50%;
      z-index: 2000;
      margin-left: -100px;
      display: none;
    }
	
    /* responsive design */
	
    @media screen and (max-width: 1500px) {
      
      /* override bootstrap */
      
      .panel-body {
        padding: 5px;
      }
		
      .panel-heading {
        padding: 0px 5px;
      }
		
      .panel {
        margin-bottom: 5px;
      }
        
      .popover-content {
        padding: 2px;
      }

      .no-grammar {
        margin: 7px 12px;
      }   
    }
    </style>
	
    <script type="text/javascript">
	
    captionList = ${captionList};
    </script>
  </head>
  <body id="body">
    <div id="fb-root"></div>
    <script type="text/javascript" src="/js/development-in-secret/fb.js"></script>
  
    <%@ include file="/WEB-INF/jspf/header.jspf" %>
    
    <div class="mainl">
      <div class="containerl" id="container">
        <div id="topHalf">
          <div id="caption-list">
            <div class="nano">
              <div class="nano-content">
							<%
							ArrayList<Lyric> captionList = (ArrayList<Lyric>)request.getAttribute("captionList");
							for(int i = 0; i < captionList.size(); i++) { 
							%>
                <div class="caption-item" data-container="#caption-list" data-toggle="popover">
                  <div class="play-icon">
                    <i class="fa fa-play-circle" id="<%=i%>"></i>
                  </div>
                  
                  <div class="lyric-item">
                    <span class="japanese-item">
                    <%
                    ArrayList<String> japaneseVocabulary = captionList.get(i).japaneseVocabulary;
                    ArrayList<String> chineseVocabulary = captionList.get(i).chineseVocabulary;
                    for(int j = 0; j < japaneseVocabulary.size(); j++) {
                    	  if(chineseVocabulary.get(j) != "") {
                    		    out.print("<span data-toggle='tooltip' data-placement='bottom' data-container='body' title='"+chineseVocabulary.get(j)+"'>"+japaneseVocabulary.get(j)+"</span>");
                    		}
                    	  else {
                    		    out.print("<span>"+japaneseVocabulary.get(j)+"</span>");
                    		}
                    }
                    %>
                    </span>
                    <br>
                    <span class="chinese-item"><%= captionList.get(i).chinese%></span>
                  </div>
                  
                  <div class="grammar">
                  <%
	                ArrayList<Lyric.Grammar> grammars = captionList.get(i).grammars;
	                if(grammars.size() == 0) {
	                	  out.print("<div class=\"no-grammar\">無文法資料");
	                	  out.print("<button type='button' class='close close-popover'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>");
	                	  out.print("</div>");
	                }
	                else {
	                	  for(int j = 0; j < grammars.size(); j++) {
	                		    Lyric.Grammar grammar = grammars.get(j);
	                		    out.print("<div class=\"panel panel-default\">");
                          out.print("<div class=\"panel-heading\">");
                          out.print(grammar.baseForm);
                          if(j == 0) {
                        	    out.print("<button type='button' class='close close-popover'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>");
                          }
                          out.print("</div>");
                          out.print("<div class=\"panel-body\">");
                          out.print(grammar.explanation);
                          out.print("</div>");
                          out.print("</div>");
	                	  }
	                }
	                %>
                  </div>
                </div>
              <%}%>
              </div>
            </div>
          </div>
          
          <div id="video-and-lyric">
            <div class="videoWrapper">
              <iframe id="youtube" frameborder="0" allowfullscreen="1" title="YouTube video player" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&iv_load_policy=3&showinfo=0&wmode=opaque"></iframe>   
            </div>
	  	      <script type="text/javascript" src="/js/development-in-secret/learn-youtube.js"></script>
	  	
            <div id="caption-detail"></div>
            
            <div id="control-panel">
              <div id="control-left">
                <div id="toggle-ch" class="control-button">中</div>
                <div id="toggle-jp" class="control-button">日</div>
                <ul id="pronunciation" class="control-button">
                  <li><span id="pronunciation-type">標音</span>
                    <ul>
                      <li id="pronunciation-none">無</li>
                      <li id="pronunciation-hiragana">平假名</li>
                      <li id="pronunciation-romaji">羅馬拼音</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div id="control-middle" >
                <i id="play-previous" title="上一句" class="fa fa-angle-left control-fa control-button"></i>
                <i id="repeat" title="循環播放" class="fa fa-refresh fa-spin control-fa control-button"></i>
                <i id="play-next"  title="下一句" class="fa fa-angle-right control-fa control-button"></i>
              </div>
              
              <div id="control-right">
                <a href="${editPage}"><i title="我也要編這一首" id="go-to-edit" class="fa fa-edit control-fa control-button"></i></a>
                <i id="shortcut" class="fa fa-keyboard-o control-fa control-button" data-container="body" data-toggle="popover"></i>
                <i id="report-error" title="回報錯誤" class="fa fa-exclamation-circle control-fa control-button" data-toggle="modal" data-target="#report-modal"></i>
                <i class="fa fa-eye control-fa">&nbsp;${viewCount.intValue()}</i>
              </div>
            </div>
          </div>
        </div>
        
        <div id="fb-plugin">
          <h2 id="title">${title} <small>編者: ${author}</small></h2>
          <%if(!((String)request.getAttribute("comment")).equals("")) {%>
            <h4 id="comment"><i class="fa fa-comment">&nbsp;</i>備註:</h4>
            <div class="well">${comment}</div>
          <%}%>
          <div class="fb-like" data-href="<%= request.getScheme()%>://<%= request.getServerName()%><%= request.getAttribute("javax.servlet.forward.request_uri")%>" data-layout="standard" data-action="like" data-share="true" show_faces="false"></div>
          <div class="fb-comments" data-numposts="5" data-colorscheme="light" data-width="100%" data-href="<%= request.getServerName()%><%= request.getAttribute("javax.servlet.forward.request_uri")%>"></div>
        </div>
      </div>
    </div>
    
    <div id="thanks" class="alert alert-success" role="alert">問題已回報，謝謝!<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>
  
    <%-- report modal --%>
    <div class="modal fade" id="report-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title">問題回報</h4>
          </div>
          
          <div class="modal-body">
            <form action="/report" method="post" id="report-form">
              <div class="form-group">
                <label for="problem-type">問題類型</label>
                <select class="form-control" name="problem-type">
                  <option>這不是日文歌</option>
                  <option>影片無法撥放</option>
                  <option>影片編輯未完成</option>
                  <option>網頁顯示或運作異常</option>
	                <option>其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="problem-discription">問題描述</label>
                <textarea class="form-control" rows="4"></textarea>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" id="submit-report">送出</button>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
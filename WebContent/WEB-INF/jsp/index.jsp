<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <%@include file="/WEB-INF/jsp/head.jsp" %>
  <title>屋塔斑鳩-日文歌學日文</title>
  <link rel="stylesheet" href="/css/font-awesome.min.css">
  <link rel="stylesheet" href="/css/bootstrap-in-edit.css">
  <link rel="stylesheet" href="/css/animate.css">
  <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="/js/development-in-secret/lettering.js"></script>
  <script type="text/javascript" src="/js/development-in-secret/texillate.js"></script>
  <c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/index.min.js"></script>
    </c:when>
    <c:otherwise>
    <script type="text/javascript" src="/js/development-in-secret/index.js"></script>
    </c:otherwise>
  </c:choose>
  
  <style>
  	.badge {
		display: inline-block;
		min-width: 10px;
		padding: 3px 7px;
		font-size: 14px;
		font-weight: 700;
		line-height: 1;
		color: #fff;
		text-align: center;
		white-space: nowrap;
		vertical-align: baseline;
		background-color: #777;
		border-radius: 10px;
  </style>
</head>
<body>
  <%@include file="/WEB-INF/jspf/header.jspf" %>
  <div id= "main" class="main">
    <div class="container" id='container'>
        <ul class="slides">
        <li id="slide-1"  class="slide-item"><a href="#"><img class="slide-image" src="/img/demo1.png"></a></li>
        <!--  <li id="slide-2" style="display:none;" class="slide-item"><a href="#"><img class="slide-image" src="/img/demo2.png"></a></li>
        <li id="slide-3"  style="display:none;" class="slide-item"><a href="#"><img class="slide-image" src="/img/demo3.png"></a></li>
        -->
      </ul>
      <ul style="margin-top:10px;"id="slide-tab">
        <li id="slide-tab-1" class="slide-here"></li>
        <!--<li id="slide-tab-2"></li>
        <li id="slide-tab-3"></li>
        -->
      </ul>
      <c:forEach var="videoId" items="${searchResponse.inDatabase}" varStatus="status">
      	<c:if test="${status.index % 3 == 0}">
         <section class="display-row">
    	</c:if>
    	<article id="block-${status.index}" class="display-block block-${videoId}">
    	<div class="display-picture">
    	<a href="/learn/${videoId}/${searchResponse.index[status.index]}">
    	<img src="http://i.ytimg.com/vi/${videoId}/hqdefault.jpg" class="display-img">
    	</a>
    	<span class="display-time">${searchResponse.duration[status.index]}</span>
    	</div>
    	<div class="display-title">
    	<a href="/learn/${videoId}/${searchResponse.index[status.index]}">${searchResponse.title[status.index]}</a>
    	</div>
    	<div class="display-meta display-author">${searchResponse.author[status.index]} 編</div>
    	<div class="display-meta display-like">${searchResponse.view[status.index]} 次觀看</div>
    	</article>
    	<c:if test="${status.index % 3 == 2 || status.last}">
         </section>
    	</c:if>
	</c:forEach>
    </div>
    <div id="loading">
      <img style="width:120px;height:120px;"src="/img/loading.gif">
    </div>
  </div>
  <%@include file="/WEB-INF/jspf/footer.jspf" %>
</body>
</html>
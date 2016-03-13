<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<%@include file="/WEB-INF/jsp/head.jsp" %>
	<title>屋塔斑鳩-日文歌學日文</title>
	<script type="text/javascript">
		var videoIdArray = ${videosJSON};
	</script>
	<c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/review.min.js"></script>
    </c:when>
    <c:otherwise>
    <script type="text/javascript" src="/js/development-in-secret/review.js"></script>
    </c:otherwise>
</c:choose>
	
    </head>
<body id="body">
  <%@include file="/WEB-INF/jspf/header.jspf" %>
  <div class="main">
    <div id="container" class="container">
    <c:forEach var="videoId" items="${searchResponse.inDatabase}" varStatus="status">
    	<div id="video-row-${videoId}" class="video-row">
    	<span class="row-image">
    	<img style="width:120px;height:90px;" src="http://img.youtube.com/vi/${videoId}/mqdefault.jpg">
    	<span class="video-time"></span></span>
    	<div class="row-middle">
    	<div class="row-line line-title">
    	</div>
    	<div class="row-line line-description"></div>
    	<a href="/learn/${videoId }/${searchResponse.index[status.index]}"><div class="line-action">勉強</div></a>
    	<a href="/edit/${videoId }"><div class="line-action">編輯</div></a>
    	</div><div class="row-right"><div class="row-line line-like">${searchResponse.view[status.index]}  次觀看</div>
    	<div class="row-line line-author">${searchResponse.author[status.index] } 編</div></div></div>
	</c:forEach>
  </div>
  <div id="pager">
  <c:forEach  var="i" begin="${page -pageRange < 1 ? 1 : page -pageRange}" end="${page+pageRange }">
  	<c:if test="${i >= 1 && i <= pageMax}">
  		<a style='display: inline;
  			<c:if test="${i == page}">background-color:rgb(187,187,187);</c:if>' class="pager-box" href="/review/${i}">
    		<span class="pager-content">${i}</span>
    	</a>
	</c:if>
  </c:forEach>
  </div>
</div>
<%@include file="/WEB-INF/jspf/footer.jspf" %>    
</body>
</html>
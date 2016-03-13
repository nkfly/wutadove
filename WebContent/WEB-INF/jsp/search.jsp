<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<%@include file="/WEB-INF/jsp/head.jsp" %>
	<title>屋塔斑鳩-日文歌學日文</title>
	<c:if test="${ searchResponse != null}">
		<script> var searchResponse = ${searchResponse};</script>
	</c:if>
	<c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/search.min.js"></script>
    </c:when>
    <c:otherwise>
    <script type="text/javascript" src="/js/development-in-secret/search.js"> </script>
    </c:otherwise>
	</c:choose>
    </head>
<body id="body">
  <%@include file="/WEB-INF/jspf/header.jspf" %>
  <div class="main">
    <div id="container" class="container">
  </div>
  <div id="pager">
    	<a style="display:none;" class="pager-box" href="" id="pager-box-prototype">
    		<span class="pager-content">
    		</span>
    	</a>
    </div>
</div>
<%@include file="/WEB-INF/jspf/footer.jspf" %>    
</body>
</html>
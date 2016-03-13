<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/login.min.js"></script>
    </c:when>
    <c:otherwise>
    <script type="text/javascript" src="/js/development-in-secret/login.js"></script>
    </c:otherwise>
</c:choose>
<div id="facebook-login" style="margin-left:40px;" class="header-item">用Facebook登入</div>
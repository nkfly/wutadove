<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:if test="${ sessionScope.access_token != null}">
	<script type='text/javascript'> var accessToken = "${sessionScope.access_token}";</script>
</c:if>
<c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/account.min.js"></script>
    </c:when>
    <c:otherwise>
    <script type="text/javascript" src="/js/development-in-secret/account.js"></script>
    </c:otherwise>
	</c:choose>
<div id="account" style="cursor:auto;height:44px;text-align:left;margin-left:38px;position: relative; left: 0; top: 0;" class="header-item">
<img style="height:44px;width:44px;vertical-align:middle;position: absolute; left: 0; top: 0;" id="account-head" src="http://graph.facebook.com/${sessionScope.userFbId}/picture?type=small" />
<span style="font-size:16px;overflow-x:hidden;display:inline-block;width:135px;white-space: nowrap;position:absolute;left:45px;">Hi! ${sessionScope.userName}</span>
<ul id="personal" style="display:none;list-style:none;background:#111111;position:relative;border-top: 2px solid gold;top:44px;padding:0;margin:0;text-align:center">
		<li class="ui-menu-item" id="review"><a href="/review/1">作品</a></li>
		<li class="ui-menu-item" id="profile"><a href="/profile">個人</a></li>
        <li class="ui-menu-item" id="logout"><a href="/logout">登出</a></li>
    </ul>
</div>
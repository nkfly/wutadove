<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>    
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<%@include file="/WEB-INF/jsp/head.jsp" %>
	<link rel="stylesheet" href="/css/animate.css">
	<link rel="stylesheet" type="text/css" href="css/jquery.scombobox.min.css" />
	<script type="text/javascript" src="js/development-in-secret/jquery.scombobox.min.js"></script>
	<script type="text/javascript" src="/js/development-in-secret/lettering.js"></script>
  	<script type="text/javascript" src="/js/development-in-secret/texillate.js"></script>
	
	<title>屋塔斑鳩-日文歌學日文</title>
	<style>
		.gravatar{
			padding: 0;
			margin-left:130px;
			overflow: hidden;
			display:inline-block;
			vertical-align:top;
		}
		.th{
			font-weight: normal;
			color: #a0a0a0;
			font-style: italic;
			width:140px;
			padding-right:40px;
		}
		.tr{
				
			font-size:20px;
			display:block;
		}
		.form-control{
			display: block;
			width: 200px;
			padding: 2px 6px;
			font-size: 16px;
			line-height: 1.42857143;
			color: #555;
			background-color: #fff;
			background-image: none;
			border: 1px solid #ccc;
			border-radius: 4px;
			-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
			box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
			-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
			-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
			transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
		}
		td {
			width:220px;
		}
		.profile-submit{
			color: #333;
			background-color: #fff;
			border-color: #ccc;
			display: inline-block;
			padding: 4px 10px;
			margin-bottom: 0;
			font-size: 14px;
			font-weight: 400;
			line-height: 1.42857143;
			text-align: center;
			white-space: nowrap;
			vertical-align: middle;
			cursor: pointer;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			background-image: none;
			border: 1px solid transparent;
			border-radius: 4px;
		}
		td input:hover{
			box-shadow: 2px 2px 2px grey;
		}
	</style>
	<script>
		$(document).ready(function(){
			$("#badges").scombobox({
				invalidAsValue : false
			});
			
			
			$("input.scombobox-value").change(function(){
				var $option = $("option[value='"+$(this).val()+"']");
				$("#badge").text($(this).val()).removeData("textillate").textillate({
					'in' : {effect :  $option.attr("data-badge-effect")},
					out : {effect : 'fadeOut'},
					loop: true
				});
				$("#badge-select").val($option.attr("data-badge-id"));
			});
			
			$("#badge").textillate({
    			'in' : { effect: $("#badge").attr("data-badge-effect")},
    			out : {effect : 'fadeOut' },
    			loop : true,
    		});
			
		});
	</script>
    </head>
<body id="body">
  <%@include file="/WEB-INF/jspf/header.jspf" %>
  <div class="main">
    <div style="padding-top:30px;" id="container" class="container">
    	<div class="gravatar">
    		<img style="width:152px;height:170px;vertical-align:top;"src="http://graph.facebook.com/${sessionScope.userFbId}/picture?type=large" alt="" >
    	</div>
    	<div style="display:inline-block">
    		<table>
                <tbody>
                	<form:form method="POST" modelAttribute="profileForm" action="/profile" acceptcharset="UTF-8">
                    <tr class="tr">
                        <th class="th">姓名</th>
                        <td><form:input path="name" name="name" class="form-control" /></td>
                    </tr>
                    <tr class="tr">
                        <th class="th">Email</th>
                        <td><form:input path="email" name="email" class="form-control"/></td>
                        
                    </tr>
                    <tr class="tr">
                        <th class="th">作品</th>
                        <td><a href="/review/1">${myWorkCount }</a></td>
                    </tr>
                    <tr class="tr">
                        <th class="th">稱號</th>
                        <td>
                        	<span id="badge" data-badge-effect="${badge.effect }" data-original-title="${badge.name}" >${badge.name}</span>
                        </td>
                    </tr>
                    <tr class="tr">
                        <th class="th"></th>
                        <td>
                        	<input id="badge-select" name="badge" type="hidden" />
                        	<select id="badges">
                        		<c:forEach items="${badgeList}" var="b">
            						<option data-badge-id="${b._id}" data-badge-effect="${b.effect}" value="${b.name}">${b.name}</option>
        						</c:forEach>
                        	</select>
                        </td>
                    </tr>
                    <tr class="tr">
                    	<th class="th"> </th>
                    	<td><input class="profile-submit" type="submit" value="儲存修改"/></td>
                    </tr>
                    </form:form>
                </tbody>
            </table>
    	</div>
    
    
  </div>  
</div>
<%@include file="/WEB-INF/jspf/footer.jspf" %>    
</body>
</html>
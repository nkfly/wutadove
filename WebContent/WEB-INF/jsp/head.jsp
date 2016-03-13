<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script type="text/javascript">
    if (window.location.hash && window.location.hash == '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
        } else {
            // Prevent scrolling by storing the page's current scroll offset
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }
    googleApiClientReady = function() {
    	gapi.client.setApiKey('AIzaSyDA4-saaeHkYaS0E50oIzuR23cN9PCGMBs');
    	gapi.client.load('youtube', 'v3', function() {
    		  if (typeof onYoutubeApiLoad !== 'undefined') {
    			  onYoutubeApiLoad();
    		  }
    	    
    	  });
    };
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    	  ga('create', 'UA-54477437-1', 'auto');
    	  ga('send', 'pageview');
    	  

          window.fbAsyncInit = function() {
            FB.init({
              appId      : '396120470510136',
              xfbml      : true,
              version    : 'v2.0'
            });
          };

          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "//connect.facebook.net/zh_TW/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));
</script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="description" content="日文歌，聽日文歌學日文，聽動漫歌學日語，聽日本歌曲學日本語，日文歌曲及日文歌詞解析">
<meta name="keywords" content="屋塔斑鳩,日文歌,學日文,學日語,動漫歌曲,日本歌曲">
<meta property="og:title" content="屋塔斑鳩-日文歌學日文">
<meta property="og:type" content="website">
<meta property="og:url" content="http://www.wutadove.com">
<meta property="og:image" content="http://www.wutadove.com/img/logo.png">
<meta property="og:description" content="聽日文歌學日文，聽動漫歌學日語，聽日本歌曲學日本語，日文歌曲及日文歌詞解析">
<meta property="og:site_name" content="wutadove">
<meta property="fb:app_id" content="396120470510136">
<link rel="shortcut icon" href="/img/favicon.ico" />
<link rel="stylesheet" href="/css/jquery-ui.min.css">
<link rel="stylesheet" href="/css/main.min.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>
<script type="text/javascript" src="https://code.jquery.com/ui/1.11.0-beta.1/jquery-ui.min.js"></script>
<c:choose>
	<c:when test='<%= !request.getServerName().startsWith("localhost") %>'>
	<script type="text/javascript" src="/js/min/head.min.js"></script>
    </c:when>
    <c:otherwise>
    <script type="text/javascript" src="/js/development-in-secret/serverconnection.js"></script>
	<script type="text/javascript" src="/js/development-in-secret/common.js"></script>
	<script type="text/javascript" src="/js/development-in-secret/header.js"></script>
	<script type="text/javascript" src="/js/development-in-secret/autocomplete.js"></script>
    </c:otherwise>
</c:choose>
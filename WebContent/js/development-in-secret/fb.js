window.fbAsyncInit = function() {
	FB.init({
		appId      : '396120470510136',
		xfbml      : true,
		version    : 'v2.1'
    });
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/zh_TW/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
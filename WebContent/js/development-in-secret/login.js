 function fbLogin(){
	 var envVar = getEnvVar();
	 window.location = 'https://www.facebook.com/dialog/oauth?client_id='
		 + envVar.clientId + '&redirect_uri='
		 + envVar.urlPrefix + envVar.loginSuffix
		 + "&scope=email";
 }
 
 /*function isRegisterFormFine(registerBox,email, password, password2, username){

     if(email == ""){
       $("#register-response").text("登入E-mail為空");
       registerBox.find("input[name='email']").focus();
       return false;
     }
     else if(email.search("@") == -1){
       $("#register-response").text("登入E-mail不正確");
       registerBox.find("input[name='email']").focus();
       return false;
     }else if(password == ""){
       $("#register-response").text("密碼為空");
       registerBox.find("input[name='password']").focus();
       return false;
     }else if(password.length < 6){
       $("#register-response").text("密碼小於六碼");
       registerBox.find("input[name='password']").focus();
       return false;
     }else if(password != password2){
       $("#register-response").text("確認密碼不正確");
       registerBox.find("input[name='password2']").focus();
       return false;
     }else if(username == ""){
       $("#register-response").text("暱稱為空");
       registerBox.find("input[name='username']").focus();
       return false;
     }
     return true;
   }

   function registerSubmit(){
       var registerBox = $("#register-box");
       var email = registerBox.find("input[name='email']").val();
       var password = registerBox.find("input[name='password']").val();
       var password2 = registerBox.find("input[name='password2']").val();
       var username = registerBox.find("input[name='username']").val();          
       if(isRegisterFormFine(registerBox,email, password, password2, username)){
         $.ajax({
           type: "POST",
           url: "register.php",
           data:{ email : email, password : hex_md5(password), username : username},
           dataType:"json",
           success: function(response){// there are only two rejection conditions, email collision or username collision
             $("#register-response").text(response.message);
           }
         });

       }
     }

   function forgetPasswordSubmit(){
       var $email = $("#forget-box").find("input[type='text']");
       var email = $email.val();
       if(email == ""){
         $("#forget-response").text("E-mail為空");
         $email.focus();
         return;
       }else if(email.search("@") == -1){
         $("#forget-response").text("E-mail不正確");
         $email.focus();
         return;
       }
       $.ajax({
           type: "POST",
           url: "forget.php",
           data:{ email : email},
           dataType:"json",
           success: function(response){
             $("#forget-response").text(response.message);
           }
         });
     }
 */  
   $(document).ready(function() {
	   /*
	   // forget password 
	     $("#forget-password").mousedown(function(){
	       $("#login-box").hide();
	       $("#forget-box").show();
	     });

	     $("#forget-submit").click(forgetPasswordSubmit);

	     $("#forget-box").find("input[type!='submit']").keydown(function(event){
	       if(event.keyCode == 13){
	         forgetPasswordSubmit();
	       }
	     });

	     // register 
	     $("#register").mousedown(function(){
	       $("#login-box").hide();
	       $("#register-box").show();
	     });

	     $("#register-box").find("input[type!='submit']").keydown(function(event){
	       if(event.keyCode == 13){
	         registerSubmit();
	       }
	     });

	     $("#register-submit").click(registerSubmit);

	    
	     // login binding 
	     $("#login").mousedown(function(){
	       $("#screen").add("#login-box").fadeIn("fast");
	     });
	     */

	     	     
	     $("#facebook-login").click(fbLogin);
	   });
   
 
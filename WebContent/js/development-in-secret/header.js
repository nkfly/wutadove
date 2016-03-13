function close(){
	$(".box").fadeOut(function(){
	      //$("#register-box").find("input[type!='submit']").val("");
	      //$("#register-response").text("");
	      $("#screen").fadeOut();
	    });
}

$(document).ready(function() {
	
  /* esc binding  */
	$(document).keyup(function(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		  if (code == 27 && ($("#origin-info").is(":visible")) || $("#announcement").is(":visible")) {
			  close();
		  }   // esc
		  
		});
	
  /* member info */

  /*$("div.member-block").hover(function(){          
    $(this).children(".member-info").show().animate({top:"-100px", height:"100px"},400);
  },function(){

    $(this).children(".member-info").animate({top:"0px", height:"0px"},400,function(){
      $(this).hide();            
    });
  });
  /* tab */
  $("#belief-tab").click(function(){
    $("#member-tab").removeClass("tab-focus");
    $("#how-tab").removeClass("tab-focus");
    $(this).addClass("tab-focus");
    $("#origin-how").hide();
    $("#origin-member").hide();
    $("#origin-belief").show();
  });

  $("#member-tab").click(function(){
    $("#belief-tab").removeClass("tab-focus");
    $("#how-tab").removeClass("tab-focus");
    $(this).addClass("tab-focus");
    $("#origin-how").hide();
    $("#origin-belief").hide();
    $("#origin-member").show();

  });
  $("#how-tab").click(function(){
	    $("#belief-tab").removeClass("tab-focus");
	    $("#member-tab").removeClass("tab-focus");
	    $(this).addClass("tab-focus");
	    $("#origin-member").hide();
	    $("#origin-belief").hide();
	    $("#origin-how").show();

	  });
  
  /* Oringin binding */
  $("#origin").click(function(){
    $("#screen").add("#origin-info").fadeIn("fast");
  });

  $(".close").click(close);

  /* input binding */
  $("#keyin").keydown(function(event){
    if(event.keyCode == 13 && $(this).val() != ""){
      searchInYoutube($(this).val());
    }
  });
  $("#keyin-submit").click(function(event){
    if($("#keyin").val() != "")searchInYoutube($("#keyin").val());
  });
  
});
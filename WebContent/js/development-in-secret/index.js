/*$('.post').click(function(){
	if($('.data').val() && $('.target').val())
		$.post('/'+$('.target').val(),$.parseJSON($('.data').val()),function(data){
			$('.content').html(data)
	})
})
$('.get').click(function(){
	if($('.target').val())
		$.get('/'+$('.target').val(),$.parseJSON($('.data').val()),function(data){
			$('.content').html(data)
	})
})*/


function slideChange(){
        slide.isChanging = true;
        $("#slide-"+slide.index).fadeOut(2000);
        $("#slide-tab-"+slide.index).animate({},1000,function(){
          $(this).removeClass("slide-here");
        });

        slide.index++;
        if(slide.index > slide.numberOfItem)slide.index = 1;

        $("#slide-"+slide.index).fadeIn(2000, function(){
          slide.isChanging = false;
        });
        $("#slide-tab-"+slide.index).animate({},1000,function(){
          $(this).addClass("slide-here");
        });

      }

      function moveToSlide(event){
        if(slide.isChanging)return;
        slide.isChanging = true;
        clearTimeout(slide.handler);
        $("#slide-"+slide.index).fadeOut(1000);
        $("#slide-tab-"+slide.index).animate({},1000,function(){
          $(this).removeClass("slide-here");
        });

        slide.index = $(this).index()+1;

        $("#slide-"+slide.index).fadeIn(1000);
        $("#slide-tab-"+slide.index).animate({},1000,function(){
          $(this).addClass("slide-here");
          slide.isChanging = false;
        });

        slide.handler = setInterval(slideChange, 6000);
      }

      function getDisplayBlock(index){
        return $('<article id="block-'+index+'" class="display-block"><div class="display-picture"><a href=""><img src="/img/404-anime-girl.jpg" class="display-img"></a><span class="display-time">0:00</span></div><div class="display-title"><a href="">這部影片不存在</a></div><div class="display-meta display-author"></div><div class="display-meta display-like"></div></article>');
      }

      function getDisplayRow(offset){
        var $row = $("<section class='display-row'></section>");
        for(var index = offset;index < offset+3;index++){
          $row.append(getDisplayBlock(index).hide());
        }
        return $row;
      }

      function setDisplayBlock(offset, count){
        $.ajax({
        type: "GET",
        url: "/index/video",
        data:{offset : offset.toString(), count : count.toString()},
        dataType:"json",
        success: function(response){
          for(var i = 0;i<response.inDatabase.length;i++){
            var $block = $("#block-"+(i+loading.index)).addClass("block-"+response.inDatabase[i]);
            $block.find("div.display-picture>a").attr("href", "/learn/"+response.inDatabase[i]+"/"+response.index[i]);
            $block.find("div.display-title>a").attr("href", "/learn/"+response.inDatabase[i]+"/"+response.index[i]);
            $block.find("div.display-author").html(response.author[i]+" 編");
            $block.find("div.display-like").text(response.view[i]+" 次觀看");
            $block.find("img").attr("src", "http://i.ytimg.com/vi/"+response.inDatabase[i]+"/hqdefault.jpg");
            $block.find("span.display-time").text(response.duration[i]);
            $block.find("div.display-title a").text(response.title[i]);
            $block.fadeIn();
            
////            getVideoInfoFromYoutube(response.inDatabase[i], function(responseFromYoutube){
////              var $block = $("article.block-"+responseFromYoutube.data.id);
////              $block.find("img").attr("src", responseFromYoutube.data.thumbnail.hqDefault);
////              $block.find("span.display-time").text(toSimpleTime(responseFromYoutube.data.duration));
////              $block.find("div.display-title a").text(responseFromYoutube.data.title);
////              $block.fadeIn();
////            }, function(videoId, response){
////              $("article.block-"+videoId).fadeIn();
////            });
          }
          if(response.statusResponse == "end"){
            loading.status = "end";
            $("#loading").hide();
          }
          loading.index += response.inDatabase.length;
          loading.isProcessing = false;

        },
        error : function(response){
        	console.log(response);
        }
      });
      }

      function setPopover($elem){
    	  $elem.popover({
    		html : true,
    	    content: function() {
    	    	return '<i style="color:gold" class="fa fa-certificate"></i> '+$(this).attr("data-badge-count");
    	    },
    	    placement: function() {
    	    	return "top";
    	    },
    	    trigger : "hover",
    	    template : '<div class="popover" role="tooltip"><div class="arrow"></div>'
    	    	+'<div class="popover-title" >'
    	    	+'</div></div>'
    		
    	}).on("shown.bs.popover", function(){
    		$(this).next().find(".popover-title").textillate({
    			'in' : {effect : $(this).attr("data-badge-effect") }
    		});
    		
    	}).on("hide.bs.popover", function(){
    		$('.popover').remove();
    		setPopover($(this));
    	});
      }


      $(document).ready(function() {
    	  setPopover($(".badge"));
       
        /* slide event */
        //slide.handler = setInterval(slideChange, 6000);

        //$("#slide-tab li").mousedown(moveToSlide);
    	loading.index = $("article").length;
        $(window).add("#container").scroll(function(){
          if(!loading.isProcessing && 
        		  ( $(window).scrollTop()+$(window).height() > $("#loading").offset().top 
        			|| $("#container").scrollTop()+$("#container").height() > $("#loading").offset().top) ){
            loading.isProcessing = true;
            if(loading.status != "end"){
              $("#container").append(getDisplayRow(loading.index));
              setDisplayBlock(loading.index, 3);
            }
          }
        });
        
        
        
      });


      

function checkDictionarySource($input, keyword, isTrigger, vocabIndex){	
	if ( $input.data("source").length == 0 ){
    	$.ajax({
		    type: "GET",
		    url: "lookup/"+encodeURI(keyword),
		    async:false,
		    dataType:"json",
		    success: function(response){
		    	$input.data("source", response.translations);
		    	if (typeof $input.data("source")[0] != "undefined" && $input.val() == ""){
		    		$input.val($input.data("source")[0]);
		    	}
		    	
		    	if (isTrigger)triggerAutocomplete($input);
		    	if (typeof vocabIndex != "undefined"){
		    		annotateReading(vocabIndex, keyword, response.reading);
		    	}
		    	}
		  });            	
    }else {
    	if (isTrigger)triggerAutocomplete($input);
    }
	
}

function triggerAutocomplete($input){
	$input.focus(); 
    $input.autocomplete( "search", "" );
}

(function( $ ) {
    $.widget( "custom.combobox", {
      _create: function() {
        this._createAutocomplete(this.element, this.options.source);
        this._createShowAllButton(this.element);
      },
 
      _createAutocomplete: function(element, source) {
        this.input = $( "<input>" )
          .val( source[0] ? source[0] : "")
          .addClass( "subtitle-vocabulary" )
          .css({"border": "0px","border-right" :"1px solid rgba(124,85,10,0.3)"})
          .bind("input", hasChanged)          
          .keydown(traversable)
          .focus(function(){
        	  var $input = $(this);
              var index = $(this).parent().index();
              var keyword = $("#footer-japanese").children(":eq("+(index)+")").val();
          		checkDictionarySource($input, keyword, false);
          })
          .focusout(function(){
        	  $input.autocomplete( "close" );
          });
        this.input.data("source", source);
        var $input = this.input;
        this.input.autocomplete({
            delay: 0,
            minLength: 0,
            source: function (request, response) {
            	response($input.data("source"));
            	},
            position:{
                collision:"fit flip"  
              },
            select: function(event, ui) {
            	hasChanged();
            	},
            search : function(event, ui){
            	if (event.keyCode == 39 || event.keyCode == 37)return false;
            }
            	
          }).appendTo(element);
      },
 
      _createShowAllButton: function(element) {
        $( "<a>" )
          .attr( "tabIndex", -1 )
          .appendTo( element )
          .addClass( "combo-toggle" )
          .append($("<span class='combo-icon'></span>"))
          .click(function() {
            var $input = $(this).prev();
            var index = $(this).parent().index();
        	var keyword = $("#footer-japanese").children(":eq("+(index)+")").val();
        	checkDictionarySource($input, keyword, true);
          });
      },
 
    });
  })( jQuery );
 
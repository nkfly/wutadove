$(document).ready(function(){
	$("#keyin").autocomplete({
	    source: function(request, response){
	        var apiKey = 'AI39si4Uj3yNJpc9D-Wlmnk1qtvNP7abPCLjJ8uTIgWQ0My7KgjPNNB2TJndz3rX4CMnwBaXaRBSeInha75him5gDf6xRXCSUg';
	        var query = request.term;
	        $.ajax({
	            url: "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&q="+query+"&key="+apiKey+"&format=5&alt=json&callback=?",  
	            dataType: 'jsonp',
	            success: function(data, textStatus, request) { 
	               response( $.map( data[1], function(item) {
	                    return {
	                        label: item[0],
	                        value: item[0]
	                    }
	                }));
	            }
	        });
	    },
	    select: function( event, ui ) {
	    	searchInYoutube(ui.item.value);
	    	//console.log(ui.item.value);
	    },
	    focus: function( event, ui ) {
	    	$("#keyin").val(ui.item.value);
	    }
	});	
});
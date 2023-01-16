function submit_search(){
    let search_text =   $.trim($('#search-text').val());  
    if (search_text.length == 0){
        $('#search-text').val("");
        $('#search-text').focus();
        
    }else{
        console.log(search_text);
        var pageURL = "http://127.0.0.1:5000/search/"+search_text;
        document.location.href = pageURL;
    }
}

$(document).ready(function() {
    $("#search-btn").click(function(event) {
       event.preventDefault();  
       submit_search();
    });
});

$(document).ready(function(){
    $("#search-text").keypress(function(event) {                       
        if (event.keyCode === 13) {      
            event.preventDefault(); 
            submit_search();
        }
    })
});
$(document).ready(function() {
    $(".username").text(username);
});

function createGroupTile(info){
    let main_div = $('<div class="recipe-main" id="recipe-main-id">');
    let header_div = $('<div class="row" id="recipe-header">');
    let image_div = $('<img alt="Recipe Image">')
    main_div.append(header_div);

    let body_div = $('<div class="row" id="recipe-body"></div>')
    let title_div = $('<div id = "recipe-title">')

    title_div.append('<h4>'+info.name+'</h4>')
    

    body_div.append(title_div);
    main_div.append(body_div);


    let info_div = $('<div class="row" id="recipe-short-info">')
    // time, date, location
    info_div.append('<div class="col-md-4 col-s-4 col-xs-12 col-12"><img src="https://img.icons8.com/ios-filled/50/000000/calendar-13.png" id="i1"/><p id="recipe-time">'+info.date+'</p></div>')
    info_div.append('<div class="col-md-3 col-s-3 col-xs-12 col-12"><img src="https://img.icons8.com/ios/50/000000/clock--v1.png" id="i2"/><p id="recipe-servings">'+info.time+'</p></div>')
    info_div.append('<div class="col-md-5 col-s-5 col-xs-12 col-12"><img src="https://img.icons8.com/ios-filled/50/000000/address--v1.png" id="i3"/><p id="recipe-author">'+info.location+'</p></div>')
    main_div.append(info_div);
    
    // description here
    let recipe_intro_div = $('<div class="row" id="recipe-intro">')
    recipe_intro_div.append('<p id="recipe-intro-id">'+info.desp+'</p>')

    main_div.append(recipe_intro_div);

    $(main_div).click(function(){
        let pageURL = "http://127.0.0.1:5000/view/"+info.id;
        document.location.href = pageURL;
    });
    
    $('.explore-groups').append(main_div);   

}


$(document).ready(function(){
    if (results.length==0){
        $('#bold-text').text('No Results found for \"'+search_text+'\"');
    }else{
        if (results.length == 1){
            $('#bold-text').text('Found '+String(results.length)+' Result for \"'+search_text+'\"');
        }else{
            $('#bold-text').text('Found '+String(results.length)+' Results for \"'+search_text+'\"');
        }
    }  
    
    // rendering on UI only search results    
    $(".explore-groups").empty();
    for (let i = 0; i < results.length; i++) {
        createGroupTile(results[i]);     
    } 
    $('#search-text').val("");  
    $('#search-text').focus();  
    
});
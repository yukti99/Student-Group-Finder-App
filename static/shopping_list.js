var item_to_update = null;

$(document).ready(function() {
    $("#item").focus();
    displayItems(items);
});

$(document).ready(function() {
    $("#add-btn").click(function() {
        addItem();
    });
});

$(document).ready(function() {
    $("#submit-btn").click(function() {
        updateItem();
    });
});

$(document).ready(function(){
    $("#quantity").keypress(function(event) {                    
        if (event.keyCode === 13) {      
            addItem();
        }
    })
});

function addItem(){
    let n_field = $.trim($("#item").val());
    let q_field = $.trim($("#quantity").val());    
    let item = {
        "item" : n_field,
        "quantity": q_field,
    };

    let new_item = {
        "new_item": item,
    }

    $.ajax({
        type: "POST",
        url: "create",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(new_item),

        success: function(result){
            console.log("Data Response: ",result)
            let items = result["items"]
            displayItems(items)
            $("#item").val("");
            $("#quantity").val("");
            $("#item").focus();

        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function displayItems(items){
    $(".item_entries").empty()
    $.each(items, function(index, value){
        createItem(value);
    });
}

function createItem(value){
    let div1 = $('<div class="row item-entry">'); 
    let c = $('<div class="col-s-4 col-md-4 col-4" id = "entry-item">');
    c.text(value.item); 
    $(div1).append(c)
    
    let q = $('<div class="col-s-4 col-md-4 col-4" id = "entry-quantity">');
    q.text(value.quantity);  
    $(div1).append(q)
    
    let div2 = $('<div class="col-s-4 col-md-4 col-4" id = "remove-button">')
    let update_button = $('<button  type="button" class="btn btn-info update-btn">');
    update_button.text('Edit');
       
    $(update_button).click(function(){
        item_to_update = value;
        addUpdateRow(value.item, value.quantity)
    });

    let remove_button = $('<button  type="button" class="btn btn-danger remove-btn">');
    remove_button.text('X');

    $(remove_button).click(function(){
        deleteItem(value.id);
    });
    div2.append(update_button);
    div2.append(remove_button);        
    $(div1).append(div2)    
    $(".item_entries").append(div1);  
}

function addUpdateRow(item, quantity){
    let div1 = $('<div class="row" id="update-row">'); 
    let c = $('<div class="col-s-4 col-md-4 col-4"><input id="update-item" placeholder="Update Item"></input></div>');
    $(div1).append(c)
    
    let q = $('<div class="col-s-4 col-md-4 col-4"><input id="update-quantity" placeholder="Update Quantity"></input></div>');
    $(div1).append(q)

   
    let btn = $('<div class="col-s-4 col-md-4 col-4"><button class="btn btn-warning" id="submit-btn">Update Item</button></div>');
    $(div1).append(btn)
    $(".item_entries").append(div1);
    $('#update-item').val(item);
    $('#update-quantity').val(quantity);

    $("#submit-btn").click(function() {
        console.log("updating",item_to_update);
        updateItem();
    });  
}

function updateItem(){
    console.log("entered");
    let n_field = $.trim($("#update-item").val());
    let q_field = $.trim($("#update-quantity").val());   
    let update_item = {
        "id" : item_to_update.id,
        "changes": {
            "id": item_to_update.id,
            "item" : n_field,
            "quantity": q_field,
        }
    };
    
    $.ajax({
        type: "POST",
        url: "update",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(update_item),

        success: function(result){
            console.log("Data Response: ",result)
            let items = result["items"]
            displayItems(items)
            $("#update-row").remove();
            $("#item").focus();
            item_to_update = ""
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
    
}

function deleteItem(id){
    let del_item = {
        "id" : id,
    };

    $.ajax({
        type: "POST",
        url: "delete",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(del_item),

        success: function(result){
            console.log("Data Response: ",result)
            let items = result["items"]
            displayItems(items)
            $("#item").focus();
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}
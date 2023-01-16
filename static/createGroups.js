$(document).ready(function() {
    $(".username").text(username);
});

$(document).ready(function() {
    $("#create-group-btn").click(function() {
        addGroup();
    });
});



function addGroup(){
    let date = $("#event-date").val();
    let time = $("#event-time").val();    
    let name = $.trim($("#event-name").val());    
    let desp = $.trim($("#description").val());    
    let people = $("#max-people").val();
    let location = $.trim($("#location").val());  
    let duration = $.trim($("#event-duration").val());   
    let error_flag = false;
    if (date==="" || time==="" || name==="" || desp===""|| people==="" || location===""|| duration===""){
        error_flag = true;
    }

    if (error_flag === true){
        alert("Please do not leave any field empty!");
    }else{
        let group = {
            "name":name,
            "date":date,
            "time":time,
            "desp":desp,
            "people":people,
            "location":location,
            "duration":duration,
            "creator": email
        };
    
        let new_group= {
            "new_group": group,
        }
    
        $.ajax({
            type: "POST",
            url: "create",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(new_group),
    
            success: function(result){
                console.log("Data Response: ",result)
                console.log(result["groups"])
                confirm("Group created successfully!");
                window.location = "/home";
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    }

    
}

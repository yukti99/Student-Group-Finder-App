$(document).ready(function() {
    $(".username").text(username);
});

$(document).ready(function() {
    displayGroupDetails(group);
});


$(document).ready(function() {
    $("#join-group-btn").click(function() {
        joinGroup(group);
    });
});

$(document).ready(function() {
    $("#exit-group-btn").click(function() {
        exitGroup(group);
    });
});


$(document).ready(function() {
    if (!isCurrentGroupMember(group, email) == true){
        $("#exit-group-btn").css("display","none");
    }
});

function isCurrentGroupMember(group, email){
    all_members = group["members"];
    return all_members.includes(email);
}

function displayGroupDetails(info){
    console.log("info");
    console.log(info);
    let main_div = $('<div id="group-form"></div>');
    let title = $('<h1 id="group-title">'+info.name+'</h1>')
    let left_fields_div = $('<div class="left"></div>');
    left_fields_div.append(title);

    let date = $('<div id="event-date">'+info.date+'</div>');
    let time = $('<div id="event-time">'+info.time+'</div>');
    let duration = $('<div id="event-time"> '+info.duration+'</div>');
    let location = $('<div id="event-location">'+info.location+'</div>');
    let desp = $('<div id="description">'+info.desp+'</div>');
    let people = $('<div id="max-people">'+info.people+'</div>');
    let members = info.members;
    console.log("members")
    console.log(members);
    let member_div = $('<div id="all-members"></div>');
    let count = members.length>6?6:members.length;
    for(var i=0;i<count;i++){
        member_div.append('<div id = "members">'+members[i]+'</div>');
    }
    if (members.length>6){
        member_div.append('<div id = "members">.....</div>');
    }
    left_fields_div.append('<div id = "info-header">Date</div>')
    left_fields_div.append(date);
    left_fields_div.append('<div id = "info-header">Time</div>')
    left_fields_div.append(time);
    left_fields_div.append('<div id = "info-header">Duration</div>')
    left_fields_div.append(duration);
    left_fields_div.append('<div id = "info-header">Description</div>')
    left_fields_div.append(desp);

    let right_fields_div = $('<div class="right"></div>');
    right_fields_div.append('<div id = "info-header">Max People Allowed</div>')
    right_fields_div.append(people);
    right_fields_div.append('<div id = "info-header">Location</div>')
    right_fields_div.append(location);
    right_fields_div.append('<div id = "info-header">Group Members ('+members.length+')</div>')
    right_fields_div.append(member_div);

    let btn = $('<button class="btn btn-outline-primary" type="submit" id="join-group-btn">Join</button>');
    right_fields_div.append(btn);

     // $(btn).click(function(){
    //     alert("Group Joined Successfully!");
    //     let pageURL = "http://127.0.0.1:5000/home";
    //     document.location.href = pageURL;
    // });

    let exit_btn = $('<button class="btn btn-outline-primary" type="submit" id="exit-group-btn">Exit</button>');
    right_fields_div.append(exit_btn);

    main_div.append(left_fields_div);
    main_div.append(right_fields_div);

    
    $(".create-groups-div").append(main_div);

}

function exitGroup(group){
    let exit_data = {
        "group": group,
        "leaving_member":email 
    }
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/exit",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(exit_data),
        success: function(result){
            console.log("Data Response: ",result)
            confirm("You have successfully left the group!");
            window.location = "/home";
        },
        error: function(request, status, error){
            confirm("Error exiting group! Try again later..");
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    }); 
}

function joinGroup(group){
    let space_left = group["people"] - group["members"].length;
    if (space_left == 0){
        alert("Sorry! This group is already full."); 
        window.location = "/home";
    }else{
        let join_data = {
            "group": group,
            "new_member":email 
        }
    
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/join",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(join_data),
            success: function(result){
                console.log("Data Response: ",result)
                if (result["flag"] == false){
                    alert("You are already in this group!");
                }else{
                    confirm("Group joined successfully!");
                }
                window.location = "/home";
            },
            error: function(request, status, error){
                confirm("Error joining Group! Try again later..");
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });

    } 
}



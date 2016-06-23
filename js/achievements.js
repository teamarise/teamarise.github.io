$(document).ready(function() {
  //set click counters on page
  var pageClicks = parseInt(localStorage.getItem("pageClicks"));
  $(".click_count").html(pageClicks);

  //create the achievement list
  createAchievementList();

});


//
// ACHIEVEMENTS
//

//an array that holds all the achievements with the unlock requirements
// clicks, name, subtitle, points, hidden flag
var clickAchievementsArray = [
    [10, "Novice Clicker", "clicked 10 times", 5, 0],
    [50, "Clicker", "clicked 50 times", 5, 0],
    [100, "Clicker 2.0", "clicked 100 times", 10, 0],
    [250, "Master Clicker", "clicked 250 times!", 10, 0],
    [500, "Adept Clicker", "clicked 500 times!", 15, 0],
    [1000, "Super Extreme Clicker", "clicked 1,000 times!!!", 20, 0],
    [1500, "Crazy Person", "clicked 1,500 times!!! Why?!?", 30, 0],
    [5000, "Sore Finger", "clicked 5,000 times - expecting something?", 50, 0],
    [9001, "Goku", "it's over 9,000!!!!", 100, 0],
    [10000, "That's all folks", "Reached 10,000", 120, 1],
    [10100, "Persistence...", "10,100 - seriously, no more achievements.", 200, 1],
    [10500, "The End", "10,500 - you win.. nothing!", 250, 1]
]


//achievements
//click 10 links

$("body").click(function() {
    //get pageClicks and increase by 1
    var pageClicks = parseInt(localStorage.getItem("pageClicks"));
    if (isNaN(pageClicks)) {
        localStorage.setItem("pageClicks", 1);
    } else {
        localStorage.setItem("pageClicks", pageClicks + 1);
        $(".click_count").html(pageClicks + 1);
    }

    //$(".click_count").html(pageClicks);

    //loop through clicks array to see if you get an achievement
    for (var i = 0; i < clickAchievementsArray.length; i++) {
        var array = clickAchievementsArray[i];
        var count = array[0] - 1;
        if (pageClicks == count) {
            addAchievement(array[1], array[2], array[3]);
        }
    }
    updateClickAchievements(pageClicks);
});

function addAchievement(title, detail, points) {
    var achievementBadge = $("#achievement_notification");
    $("#achievement_notification .points").text(points);
    $("#achievement_notification .title").text(title);
    $("#achievement_notification .detail").text(detail);
    achievementBadge.removeClass("achieved");
    setTimeout(function() {
        achievementBadge.addClass("achieved");
    }, 1)
}

function updateClickAchievements(pageClicks) {
    var points = 0;

    //update the click-based achievements
    //loop through the array and see if any are updated
    for (var i = 0; i < clickAchievementsArray.length; i++) {
        var array = clickAchievementsArray[i];

        if (pageClicks >= (array[0] - 1)) {
            $("#achievement_" + i + "").removeClass("ach_locked");
            $("#achievement_" + i + " .title").html(array[1]);
            $("#achievement_" + i + " .detail").html(array[2]);
            //if it is a hidden achievement, change the icon
            if (array[4] == 1) {
                $("#achievement_" + i + " .fa").removeClass("fa-lock").addClass("fa-bolt");
            }

            points = points + array[3];
        } else {
            $("#achievement_" + i + "").addClass("ach_locked");
            //if it is a hidden achievement, re-hide it
            if (array[4] == 1) {
                $("#achievement_" + i + " .title").html("Hidden");
                $("#achievement_" + i + " .detail").html(". . .");
                $("#achievement_" + i + " .fa").addClass("fa-lock").removeClass("fa-bolt");
            }
        }
    }

        updatePoints(points);

}

function updatePoints(points) {
    var currentPoints = $(".achievement_count").text();

    //Update the achievement points
    //see if there was a change and update the points
    if(currentPoints != points) {
        $(".count_update").addClass("updating").html(points);
        $(".count_update2").addClass("updating");
        $(".count_update3").addClass("updating");
        setTimeout(function() {
            $(".achievement_count").html(points);
        }, 501)
        setTimeout(function() {
            $(".count_update2").removeClass("updating");
            $(".count_update3").removeClass("updating");
            $(".count_update").removeClass("updating");

            $(".achievement_count").html(points);
        }, 1001)
    }
}

function createAchievementList() {
    var pageClicks = parseInt(localStorage.getItem("pageClicks"));

    //set variable for points count
    var points = 0;

    //loop through clicks array
    for (var i = 0; i < clickAchievementsArray.length; i++) {
        var array = clickAchievementsArray[i];
        //create achievement item
        var ach_item = " \
            <li class='ach ach_locked' id='achievement_" + i + "'> \
              <div class='icon'><i class='fa fa-bolt' aria-hidden='true'></i></div> \
              <div class='text_wrap'> \
                <div class='points'>" + array[3] + "</div> \
                <p class='title'>" + array[1] + "</p> \
                <span class='detail'>" + array[2] + "</span> \
              </div> \
            </li>";

        //append to list
        $(".ach_list").append(ach_item);

        if (pageClicks >= (array[0] - 1)) {
            $("#achievement_" + i + "").removeClass("ach_locked");
            points = points + array[3];
        }

        if (array[4] == 1 && pageClicks < (array[0] - 1)) {
            $("#achievement_" + i + "").addClass("hidden_ach");
            $("#achievement_" + i + " .title").html("Hidden");
            $("#achievement_" + i + " .detail").html(". . .");
            $("#achievement_" + i + " .fa").removeClass("fa-bolt").addClass("fa-lock");
        }

    }
    //set points counter(s)
    $(".achievement_count").html(points);
}

$(".confirm_btn").click(function() {
    var elem = $(this);
    if(!elem.hasClass("confirming")) {
        if (!elem.hasClass("confirmed")) {
            elem.addClass("confirming");
            setTimeout(function() {
                if (elem.is(":hover")) {
                    elem.addClass("time_out");
                } else {
                    elem.removeClass("confirming");
                }
            }, 3000)
        }
    } else {
        elem.append("<div class='confirmation'><i class='fa fa-check' aria-hidden='true'></i></div>");
        elem.addClass("confirmed").removeClass("time_out").removeClass("confirming");
        setTimeout(function() {
            $(".confirmation").remove();
            elem.removeClass("confirmed");
        }, 2000)
    }
});

$(".confirm_btn").mouseleave(function() {
    var elem = $(this);
    if (elem.hasClass("time_out")) {
        elem.removeClass("time_out confirming");
    }
});

$(".clear_achievements").click(function() {
    localStorage.setItem("pageClicks", -1);
    $(".click_count").html("-1");
    updateClickAchievements(-1);
});

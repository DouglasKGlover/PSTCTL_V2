/* Overview Page */
// Create the List of lists
var allLists = 0;
function createListOfLists(){
    for(var i = 0; i < lists.length; i++){
        var thisList = lists[i];
        $("#list-of-lists").append("" +
            "<div class=\"list row\" id=\"list-"+ i +"\" data-list-name=\""+ thisList.listName +"\">" +
            "<a href=\"#\">" +
            "<div class=\"col-xs-6 col-md-1\">" +
            "<img src=\""+ thisList.award +"\" alt=\""+ thisList.listName +" Award Image\" class=\"list-icon\">" +
            "</div>" +
            "" +
            "<div class=\"col-xs-6 col-md-2 col-md-push-9\">" +
            "<h3 class=\"text-right list-progress\"><span class=\"total-earned\">0</span>/<span class=\"total-possible\">"+ thisList.trophies.length +"</span></h3>" +
            "</div>" +
            "" +
            "<div class=\"col-xs-12 col-md-9 col-md-pull-2\">" +
            "<h3 class=\"list-name\">"+ thisList.listName +"</h3>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "");

        allLists = allLists + parseInt(thisList.trophies.length);
        $("#all-total").html(allLists);
    }
}

// Update lists' progress
var allEarned = 0;
function updateListProgress(){
    $(".list").each(function(k,v){
        var thisList = $(v).data("list-name");
        if(localStorage.getItem(thisList)){
            var totalEarned = localStorage.getItem(thisList);
            allEarned = allEarned + parseInt(totalEarned);

            $(this).find(".total-earned").html(totalEarned);

            // Add class to style based on progress
            var color;
            if(thisList != "PST Custom Trophy List 1.0" && thisList != "PST Custom Trophy List 2.0"){
                if(totalEarned > 0){ color = "bronze" }
                if(totalEarned > 9){ color = "silver" }
                if(totalEarned > 19){ color = "gold" }
                if(totalEarned > 29){ color = "platinum" }
                if(totalEarned >= 35){ color = "perfect" }
                $(this).addClass(color);
            } else {
                if(totalEarned > 19){ color = "bronze" }
                if(totalEarned > 29){ color = "silver" }
                if(totalEarned > 39){ color = "gold" }
                if(totalEarned == 50){ color = "platinum" }
                $(this).addClass(color);
            }
        }
    });

    var color;
    if(allEarned > allLists*.1){ color = "bronze" }
    if(allEarned > allLists*.25){ color = "silver" }
    if(allEarned > allLists*.5){ color = "gold" }
    if(allEarned > allLists*.75){ color = "platinum" }
    if(allEarned == allLists){ color = "perfect" }
    $(".top-row").addClass(color);

    $("#all-earned").html(allEarned);
}

// Sorting by list progress
function sortByProgress(){
    var sorted = $("#list-of-lists .list").sort(function (a, b) {
        var contentA = parseInt( $(a).find(".total-earned").text());
        var contentB = parseInt( $(b).find(".total-earned").text());
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });

    $("#list-of-lists").html(sorted);
}

// Sorting by list name
function sortByName(){
    var sorted = $("#list-of-lists .list").sort(function (a, b) {
        var contentA = $(a).data("list-name");
        var contentB = $(b).data("list-name");
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });

    $("#list-of-lists").html(sorted);
}

// Toggle between Overview and List
function toggleView(){
    $(".list-of-lists, #list-selected").toggle();
}

// Show selected list
var selectedListNumber;
function listSelected(clickedList){
    selectedListNumber = clickedList[0].id.replace("list-","");
    var selectedList = lists[selectedListNumber];
    toggleView();

    // Fill out trophy List
    var trophyCount = 0,
        gameCount = 0;
    $("#trophy-list").html("");
    for(var i = 0; i < selectedList.trophies.length; i++){
        var thisTrophy = selectedList.trophies[i],
            trophyEarned = null,
            gameOwned = null,
            trophyChecked = "",
            gameChecked = "";

        if(localStorage.getItem("t-" + thisTrophy.name) == "true"){
            trophyEarned = "earned_trophy";
            trophyChecked = "checked=\"true\"";
            trophyCount++;
        }

        if(localStorage.getItem("g-" + thisTrophy.game) == "true"){
            gameCount++;
            gameChecked = "checked=\"true\"";
            gameOwned = "own_game";
        }

        $("#trophy-list").append("" +
            "<div class=\"trophy "+ trophyEarned +" "+ gameOwned +"\" id=\"trophy-"+ i +"\" data-trophy-name=\""+ thisTrophy.name +"\">" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-12\">" +
            "<h3 class=\"game\" data-game-name=\""+ thisTrophy.game +"\">"+ thisTrophy.game +"</h3>" +
            "</div>" +
            "</div>" +
            "" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-1\">" +
            "<img src=\""+ thisTrophy.imag +"\" alt=\""+ thisTrophy.game +" - "+ thisTrophy.name +"\" class=\"img-responsive\">" +
            "</div>" +
            "<div class=\"col-sm-9\">" +
            "<p><strong class=\"name\">"+ thisTrophy.name +"</strong></p>" +
            "<p>"+ thisTrophy.desc +"</p>" +
            "</div>" +
            "<div class=\"col-sm-1 col-xs-6 text-center\">" +
            "<input type=\"checkbox\" id=\"checkbox-trophy-"+ i +"\" class=\"check-trophy\" "+ trophyChecked +"/>" +
            "<label for=\"checkbox-trophy-"+ i +"\" class=\"label-trophy\">&#10004;</label>" +
            "</div>" +
            "<div class=\"col-sm-1 col-xs-6 text-center\">" +
            "<input type=\"checkbox\" id=\"checkbox-game-"+ i +"\" class=\"check-game\" "+ gameChecked +"/>" +
            "<label for=\"checkbox-game-"+ i +"\" class=\"label-game\">&#10004;</label>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "");
    }

    // Fill out header
    $("#list-header")
        .html("" +
            "<div class=\"content\">" +
            "<h2 id=\"list_name\">"+ selectedList.listName +"</h2>" +
            "<img src=\""+ selectedList.award +"\" alt=\""+ selectedList.listName +" Site Award\">" +
            "<h3><span id=\"trophy_count\">"+ trophyCount +"</span>/<span id=\"game_count\">"+ gameCount +"</span>/"+ selectedList.trophies.length +"</h3>" +
            "</div>" +
            "")
        .attr("style","background: url('img/headerbg.png') repeat, url('"+ selectedList.banner +"') no-repeat; background-size: auto, cover;");

    // Reset hide/show button
    /*$("#hide_collected").html("Hide &#10004;");
    hide_toggle = 0;
    $("input.check-trophy:checked").each(function(){
        $(this).closest(".trophy").show();
    });*/

    // Analytics
    ga('send', 'pageview', selectedList.listName);
}


/* Trophy list page */
// Hide/Show collected trophies
function hideCollected(){
    $("input.check-trophy:checked").closest(".trophy").toggle();
    $(".collected-shown").toggle();
}

// BBCode
function getBbcode(){
    $("#bbcode").find("pre").append("" +
        "[B]" + $("#list_name").text() + "[/B] - " + $("input.check-trophy:checked").length + "/" + $(".trophy").length +
        "\n[SPOILER='A" + Math.floor(Math.random() * (100000 + 1)) + "']" +
        "\n[LIST=1]" +
        "");
    $(".check-trophy").each(function(k,v){
        if(this.checked){
            $("#bbcode pre").append("" +
                "\n[*][B]" + $(v).closest(".trophy").find(".game").text() + "[/B] - [I]" + $(v).closest(".trophy").find(".name").text() + "[/I]" +
                "");
        }
    });
    $("#bbcode").find("pre").append("" +
        "\n[/LIST]\n[/SPOILER]\n\n" +
        "");
    $("#bbcode, #reset_bbcode").show();
}

function resetBbcode(){
    $("#bbcode").find("pre").html("");
    $("#bbcode, #reset_bbcode").hide();
}

// Click Trophy Checkbox
function saveTrophy(e) {
    var trophiesChecked = $('input.check-trophy:checked').length,
        checked = e.target.checked,
        thisTrophy = $(e.target).closest(".trophy").data("trophy-name");

    $(e.target).closest(".trophy").toggleClass("earned_trophy");
    $("#trophy_count").html(trophiesChecked);

    if(checked){
        localStorage.setItem("t-" + thisTrophy, true);
    } else {
        localStorage.removeItem("t-" + thisTrophy);
    }

    if(trophiesChecked > 0){
        localStorage.setItem($("#list_name").html(), trophiesChecked);
    } else {
        localStorage.removeItem($("#list_name").html());
    }

    updateListProgress();
}

// Click Game Checkbox
function saveGame(e) {
    var gamesChecked = $('input.check-game:checked').length,
        checked = e.target.checked,
        thisGame = $(e.target).closest(".trophy").find(".game").data("game-name");

    $("#game_count").html(gamesChecked);
    $(e.target).closest(".trophy").toggleClass("own_game");

    if(checked){
        localStorage.setItem("g-" + thisGame, true);
    } else {
        localStorage.removeItem("g-" + thisGame);
    }
}


/* Document ready */
$(document).ready(function () {

    /* On page load */
    ga('send', 'pageview', 'Overview');
    createListOfLists();
    updateListProgress();


    /* Overview */
    $("#list-of-lists").on("click", ".list:not(.data-row)", function(){
        listSelected($(this));
    });


    /* Trophy list page */
    $(".hide-collected").click(function(){
        hideCollected();
    });
    $(".get-bbcode").click(function(){
        getBbcode();
    });
    $(".reset-bbcode").click(function(){
        resetBbcode();
    });

    $("#trophy-list").on("click", ".check-trophy", function(e){
        saveTrophy(e);
    });
    $("#trophy-list").on("click", ".check-game", function(e){
        saveGame(e);
    });


    /* Shared */
    $(".toggle-view").click(function(){
        toggleView();
    });

});
var app = angular.module("ctlApp", []);

/* Update list progress */
function updateListProgress(){
    ga('send', 'pageview', 'Overview');
    $(".list").each(function(k,v){
        var thisList = $(v).attr("id");
        if(localStorage.getItem(thisList)){
            var totalEarned = localStorage.getItem(thisList);
            $(this).find(".total-earned").html(totalEarned);
            $(this).attr("data-sort",totalEarned);

            /* Add class to style based on progress */
            if(thisList != "PST Custom Trophy List 1.0" && thisList != "PST Custom Trophy List 2.0"){
                if(totalEarned > 0 && totalEarned <= 9){
                    $(this).addClass("bronze");
                }else if(totalEarned > 9 && totalEarned <= 19){
                    $(this).addClass("silver");
                } else if(totalEarned > 19 && totalEarned <= 29){
                    $(this).addClass("gold");
                } else if(totalEarned > 29 && totalEarned <= 34){
                    $(this).addClass("platinum");
                } else if(totalEarned >= 35){
                    $(this).addClass("perfect");
                }
            } else {
                if(totalEarned > 19 && totalEarned <= 29){
                    $(this).addClass("bronze");
                }else if(totalEarned > 29 && totalEarned <= 39){
                    $(this).addClass("silver");
                } else if(totalEarned > 39 && totalEarned <= 49){
                    $(this).addClass("gold");
                } else if(totalEarned == 50){
                    $(this).addClass("platinum");
                }
            }
        }
    });
}

/* Sorting by list progress */
function sortByProgress(){
    var sorted = $("#list-of-lists .list").sort(function (a, b) {
        var contentA = parseInt( $(a).data("sort"));
        var contentB = parseInt( $(b).data("sort"));
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });

    $("#list-of-lists").html(sorted);
}

/* Sorting by list name */
function sortByName(){
    var sorted = $("#list-of-lists .list").sort(function (a, b) {
        var contentA = $(a).attr("id");
        var contentB = $(b).attr("id");
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });

    $("#list-of-lists").html(sorted);
}

app.controller("myCtrl", function($scope) {
    /* Click Trophy Checkbox */
    $scope.saveTrophy = function(e) {
        var trophiesChecked = $('input.check-trophy:checked').length;
        $("#trophy_count").html(trophiesChecked);
        /* Add or remove trophy name from LS */
        if(e){
            /* Checked */
            localStorage.setItem("t-" + this.trophy.name, true);
        } else {
            /* Unchecked */
            localStorage.removeItem("t-" + this.trophy.name);
        }

        /* Add/update list on LS, or remove if none checked */
        if(trophiesChecked > 0){
            localStorage.setItem($("#list_name").html(), trophiesChecked);
        } else {
            localStorage.removeItem($("#list_name").html());
        }
    };

    /* Click Game Checkbox */
    $scope.saveGame = function(e, v) {
        if(e){
            /* Checked */
            localStorage.setItem("g-" + this.trophy.game, true);
        } else {
            /* Unchecked */
            localStorage.removeItem("g-" + this.trophy.game);
        }
        $("#game_count").html($('input.check-game:checked').length);
    };

    /* Select a List - Get Local Storage */
    $scope.getListLS = function() {
        var trophyCount = 0,
          selectedList = null;

        /* Analytics - List Selected */
        if(this.list){
            selectedList = this.list.listName;
        } else if(this.selected){
            selectedList = this.selected.listName;
        }
        if(selectedList){
            ga('send', 'pageview', selectedList);
        }

        setTimeout(function(){
            /* Iterate over Trophies */
            angular.forEach(document.querySelectorAll(".trophy"), function(e){
                /* If the user has previously checked the Trophy */
                if(localStorage.getItem(e.id) =="true"){
                    /* Add class for styling the trophy */
                    $(e).addClass("earned_trophy");

                    /* Find the Checkbox and Check it */
                    document.getElementById(e.id.replace("t-","c-")).checked = true;

                    /* Increase the Trophy Count and update the HTML */
                    trophyCount++;
                }
            });

            /* Iterate over Games */
            angular.forEach(document.querySelectorAll(".trophy .game"), function(e){
                /* If the user has previously checked the Trophy */
                if(localStorage.getItem(e.id) =="true"){
                    /* Add class for styling the trophy */
                    $(e).closest(".trophy").addClass("own_game");

                    /* Find the Checkbox and Check it */
                    document.getElementById(e.id.replace("g-","c-")).checked = true;
                }
            });

            /* Update Trophy and Game Count */
            $("#trophy_count").html(trophyCount);
            $("#game_count").html($('input.check-game:checked').length);

            /* Reset hide/show button */
            $("input.check-trophy:checked").each(function(){
                $("#hide_collected").html("Hide &#10004;");
                $(this).closest(".trophy").show();
                hide_toggle = 0;
            });
        },100);
    };

    /* BBCode */
    $scope.get_bbcode = function(){
        $("#bbcode pre").append("" +
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
        $("#bbcode pre").append("" +
            "\n[/LIST]\n[/SPOILER]\n\n" +
            "");
        $("#bbcode, #reset_bbcode").show();
    };
    
    $scope.reset_bbcode = function(){
        $("#bbcode pre").html("");
        $("#bbcode, #reset_bbcode").hide();
    };

    /* Hide/Show collected trophies */
    var hide_toggle = 0;
    $scope.hide_collected = function(){
        if(hide_toggle == 0){
            $("input.check-trophy:checked").each(function(){
                $("#hide_collected").html("Show &#10004;");
                $(this).closest(".trophy").hide();
                hide_toggle++;
            });
        } else {
            $("input.check-trophy:checked").each(function(){
                $("#hide_collected").html("Hide &#10004;");
                $(this).closest(".trophy").show();
                hide_toggle = 0;
            });
        }
    };

    /* Sorting */
    $scope.orderByField = '';
    $scope.reverseSort = false;

    /* Selected List Scope */
    $scope.select = function(list) {
        $scope.selected = list;
    };

    /* Add trophy total to dropdown menu "Earned/Total" */
    $scope.updateDropdown = function(){
        $("#list-dropdown option").each(function(k,v){
            if(localStorage.getItem(v.label)){
                var listTrophyTotal = 0;
                $($scope.lists).each(function(lk,lv){
                    if(v.label == lv.listName){
                        listTrophyTotal = lv.trophies.length;
                    }
                });

                v.text = v.label + " (" + localStorage.getItem(v.label) + "/" + listTrophyTotal + ")";
                v.label = v.label + " (" + localStorage.getItem(v.label) + "/" + listTrophyTotal + ")";
            }
        });
    };

    /* On Load*/
    angular.element(document).ready(function () {
        updateListProgress();
        $scope.updateDropdown();
    });

    /* Custom Trophy Lists Array */
    $scope.lists = [{
        listName: "PST Custom Trophy List 1.0",
        banner: "http://www.playstationtrophies.org/images/site/_logo_white_ps.png",
        award: "http://www.ps3trophies.org/images/news/plat_award64.png",
        trophies: [/*{
            game: "PST Custom Trophy List 1.0",
            name: "I am a platinum god!!",
            desc: "Earned all 50 trophies in the PS3T Custom Trophy List. ",
            imag: "http://www.ps3trophies.org/images/news/plat_award64.png"
        },*/{
            game: "3D Dot Game Heroes",
            name: "That's a Big Fat Sword!",
            desc: "Maxed out the Giga Sword.",
            imag: "http://www.ps3trophies.org/images/trophies/365/41.jpg "
        },{
            game: "Alice: Madness Returns",
            name: "Seasoned Campaigner",
            desc: "Pepper All Snouts in the Game.",
            imag: "http://www.ps3trophies.org/images/trophies/671/26.jpg"
        },{
            game: "Assassin's Creed II",
            name: "Vitruvian Man",
            desc: "Unlock all 20 pieces of Subject 16's video",
            imag: "http://www.ps3trophies.org/images/trophies/260/21.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Invisible Predator",
            desc: "Complete one predator challenge by using only Silent Takedowns.",
            imag: "http://www.ps3trophies.org/images/trophies/192/37.jpg "
        },{
            game: "Battlefield: Bad Company 2",
            name: "Mission...Accomplished",
            desc: "Online: in a round for one kill with the knife, the M60 and the RPG-7",
            imag: "http://www.ps3trophies.org/images/trophies/326/40.jpg"
        },{
            game: "Bayonetta",
            name: "Naughty Tentacles",
            desc: "Destroy all the tentacles that drop down together during a single sequence in Chapter 9.",
            imag: "http://www.ps3trophies.org/images/trophies/52/48.jpg "
        },{
            game: "BioShock",
            name: "Research PhD",
            desc: "Max out all possible research",
            imag: "http://www.ps3trophies.org/images/trophies/23/29.jpg"
        },{
            game: "Borderlands",
            name: "United We Stand",
            desc: "Defeated the Rakk Hive, the Vault Boss, Sledge, Krom, or Flynt in a co-op game",
            imag: "http://www.ps3trophies.org/images/trophies/39/08.jpg"
        },{
            game: "Brink",
            name: "Brinksmanship",
            desc: "Complete an Operative Primary Objective within 5 seconds of breaking disguise",
            imag: "http://www.ps3trophies.org/images/trophies/356/26.jpg "
        },{
            game: "Burnout Paradise",
            name: "Shutdown the Carson Inferno Van",
            desc: "Awarded when you Shutdown the Carson Inferno Van",
            imag: "http://www.ps3trophies.org/images/trophies/1/032.jpg "
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Colonel Sanderson",
            desc: "Kill 7 chickens in under 10 seconds in 'The Hornet's Nest'",
            imag: "http://www.ps3trophies.org/images/trophies/240/25.jpg "
        },{
            game: "Call of Duty: World at War",
            name: "Blowtorch and Corkscrew",
            desc: "Complete 'Blowtorch and Corkscrew' on Veteran Difficulty",
            imag: "http://www.ps3trophies.org/images/trophies/41/012.jpg "
        },{
            game: "Catherine",
            name: "Altar Conquered!",
            desc: "Complete Stage 1 of Babel.",
            imag: "http://www.ps3trophies.org/images/trophies/380/40.jpg"
        },{
            game: "Darksiders",
            name: "Who's Counting?",
            desc: "Defeat more angels than Ulthane",
            imag: "http://www.ps3trophies.org/images/trophies/276/13.jpg"
        },{
            game: "Dead Island",
            name: "Right 4 Life",
            desc: "Complete act I with 4 different characters.",
            imag: "http://www.ps3trophies.org/images/trophies/930/29.jpg "
        },{
            game: "Dead Rising 2",
            name: "Zombie Genocide Master",
            desc: "Kill 72,000 zombies.",
            imag: "http://www.ps3trophies.org/images/trophies/325/04.jpg"
        },{
            game: "Dead Space 2",
            name: "Elevator Action",
            desc: "Knock off every Tripod during the Elevator Sequence",
            imag: "http://www.ps3trophies.org/images/trophies/355/08.jpg"
        },{
            game: "Demon's Souls",
            name: "Penetrator's Trophy",
            desc: "Slayer of Demon \"Penetrator\"",
            imag: "http://www.ps3trophies.org/images/trophies/245/30.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "Deus Ex Machina",
            desc: "Experience all the different endings that Deus Ex: Human Revolution has to offer",
            imag: "http://www.ps3trophies.org/images/trophies/450/11.jpg"
        },{
            game: "Dragon Age: Origins",
            name: "Recruiter",
            desc: "Across all playthroughs, recruited all party members",
            imag: "http://www.ps3trophies.org/images/trophies/270/11.jpg"
        },{
            game: "Duke Nukem Forever",
            name: "Turd Burglar",
            desc: "Find and steal a piece of poo",
            imag: "http://www.ps3trophies.org/images/trophies/730/18.jpg"
        },{
            game: "Fallout 3",
            name: "The Bigger They Are...",
            desc: "Kill all the Super Mutant Behemoths",
            imag: "http://www.ps3trophies.org/images/trophies/70/048.jpg"
        },{
            game: "Final Fantasy XIII",
            name: "Adamant Will",
            desc: "Felled a heavyweight of the lowerworld wilds",
            imag: "http://www.ps3trophies.org/images/trophies/307/32.jpg"
        },{
            game: "God of War III",
            name: "aMAZEd",
            desc: "Beat the Labyrinth without dying or failing",
            imag: "http://www.ps3trophies.org/images/trophies/319/003.jpg"
        },{
            game: "Gran Turismo 5",
            name: "Rollover",
            desc: "Total a car by flipping it over",
            imag: "http://www.ps3trophies.org/images/trophies/320/04.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "Gobble Gobble",
            desc: "You got a turkey in 10 pin bowling.",
            imag: "http://www.ps3trophies.org/images/trophies/33/008.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Gold Finger",
            desc: "The Lizard - Cut your finger using axe, knife or pliers + disinfect or cauterize the wound",
            imag: "http://www.ps3trophies.org/images/trophies/321/25.jpg"
        },{
            game: "inFAMOUS",
            name: "Hotfoot",
            desc: "Travel 25 kilometers while riding the rails.",
            imag: "http://www.ps3trophies.org/images/trophies/122/1.jpg"
        },{
            game: "Just Cause 2",
            name: "Gravity is a Bitch!",
            desc: "Kill 30 enemies by using the grappling hook and making them fall to their death",
            imag: "http://www.ps3trophies.org/images/trophies/329/01.jpg"
        },{
            game: "Killzone 3",
            name: "Completist",
            desc: "Destroyed every destructible weapon on the MAWLR while on foot and on the Intruder",
            imag: "http://www.ps3trophies.org/images/trophies/430/25.jpg"
        },{
            game: "L.A. Noire",
            name: "The Moose",
            desc: "Tail Candy Edwards from the parking lot to her destination without using cover or going incognito, except when starting or picking up the tail",
            imag: "http://www.ps3trophies.org/images/trophies/358/36.jpg"
        },{
            game: "LEGO Pirates of the Caribbean",
            name: "Sea turtles, mate",
            desc: "Ride on all types of animal in the game",
            imag: "http://www.ps3trophies.org/images/trophies/820/34.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Play",
            desc: "Complete all story levels without dying, with the exception of those levels that only end when you die",
            imag: "http://www.ps3trophies.org/images/trophies/14/41.jpg"
        },{
            game: "MARVEL VS. CAPCOM 3",
            name: "Combat Specialist",
            desc: "In Ranked Match, surpass the '1st' class rank, or fight someone who has",
            imag: "http://www.ps3trophies.org/images/trophies/538/13.jpg"
        },{
            game: "Mass Effect 2",
            name: "No One Left Behind",
            desc: "Keep your team alive through the suicide mission",
            imag: "http://www.ps3trophies.org/images/trophies/703/29.jpg"
        },{
            game: "Mirror's Edge",
            name: "Chapter 2 Speedrun",
            desc: "Complete a Speedrun of Chapter 2 below the target time.",
            imag: "http://www.ps3trophies.org/images/trophies/43/023.jpg"
        },{
            game: "Portal 2",
            name: "Iron Grip",
            desc: "Never lose a cube in Chamber 6 of the Mass and Velocity co-op course",
            imag: "http://www.ps3trophies.org/images/trophies/610/37.jpg"
        },{
            game: "Prince of Persia: The Sands of Time",
            name: "Game Master",
            desc: "Complete the game rewinding the time less than 20 times",
            imag: "http://www.ps3trophies.org/images/trophies/767/15.jpg"
        },{
            game: "Ratchet & Clank: A Crack in Time",
            name: "My Blaster Runs Really, Really Hot",
            desc: "Score 10,000 points on My Blaster Runs Hot",
            imag: "http://www.ps3trophies.org/images/trophies/241/18.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Unnatural Selection",
            desc: "Kill one of every animal species in the game in any game mode",
            imag: "http://www.ps3trophies.org/images/trophies/340/40.jpg"
        },{
            game: "Resident Evil 5",
            name: "All Dressed Up",
            desc: "Purchase all available alternate costumes in Bonus Features",
            imag: "http://www.ps3trophies.org/images/trophies/81/022.jpg"
        },{
            game: "Shadow of the Colossus",
            name: "Climber",
            desc: "Reached the top of the shrine",
            imag: "http://www.ps3trophies.org/images/trophies/874/20.jpg"
        },{
            game: "SOCOM 4",
            name: "Expert Tactician",
            desc: "Complete a Story Campaign mission using only teammates to eliminate enemies",
            imag: "http://www.ps3trophies.org/images/trophies/426/35.jpg"
        },{
            game: "Spider-Man: Shattered Dimensions",
            name: "Missed Me!",
            desc: "Defeat a boss on any difficulty level without taking damage",
            imag: "http://www.ps3trophies.org/images/trophies/506/84.jpg"
        },{
            game: "Star Wars: The Force Unleashed",
            name: "Worst Day-Shift Manager Ever",
            desc: "Kill 12 Stormtroopers as Vader during the Prologue",
            imag: "http://www.ps3trophies.org/images/trophies/195/48.jpg"
        },{
            game: "Terminator Salvation",
            name: "Veteran Commander",
            desc: "Complete the Game - Become a Commander on Hard difficulty",
            imag: "http://www.ps3trophies.org/images/trophies/112/011.jpg"
        },{
            game: "The Saboteur",
            name: "High Diver",
            desc: "You jumped from the Eiffel Tower and survived.",
            imag: "http://www.ps3trophies.org/images/trophies/298/44.jpg "
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Steel Fist Expert (u)",
            desc: "Defeat ten enemies in a row with a single punch, after softening them up with gunfire:pps4:",
            imag: "http://www.ps3trophies.org/images/trophies/214/42.jpg "
        },{
            game: "Warhawk",
            name: "What's That Green Line?",
            desc: "Get killed by a Binoculars strike while piloting an aircraft.",
            imag: "http://www.ps3trophies.org/images/trophies/9/54.jpg"
        },{
            game: "WipEout HD",
            name: "Own the Zone",
            desc: "Get 20 consecutive perfect zones in a single Zone Mode event",
            imag: "http://www.ps3trophies.org/images/trophies/21/019.jpg "
        }]
    },{
        listName: "PST Custom Trophy List 2.0",
        banner: "http://i.imgur.com/9pI9NN4.png",
        award: "http://www.ps3trophies.org/images/news/plat_award64.png",
        trophies: [{
            game: "Assassin's Creed III",
            name: "Original Gamer",
            desc: "Win a game of Fanorona, Morris and Bowls on the Homestead.",
            imag: "http://www.ps3trophies.org/images/trophies/1400/DE4.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Pay Your Respects",
            desc: "A moment of remembrance",
            imag: "http://www.ps3trophies.org/images/trophies/398/45.jpg"
        },{
            game: "Battlefield 3",
            name: "You can be my wingman anytime",
            desc: "Completed Going Hunting in a perfect run",
            imag: "http://www.ps3trophies.org/images/trophies/883/13.jpg"
        },{
            game: "BioShock Infinite",
            name: "Heartbreaker",
            desc: "Killed a Handyman by only shooting his heart",
            imag: "http://www.ps3trophies.org/images/trophies/700/1E4.jpg"
        },{
            game: "Borderlands 2",
            name: "Tribute To A Vault Hunter",
            desc: "Got an item from Michael Mamaril",
            imag: "http://www.ps3trophies.org/images/trophies/1145/140.jpg"
        },{
            game: "Call of Duty: Black Ops II",
            name: "Black Ops II Master",
            desc: "Complete the campaign on Hardened or Veteran difficulty.",
            imag: "http://www.ps3trophies.org/images/trophies/1344/5AC.jpg"
        },{
            game: "Dark Souls",
            name: "Covenant: Path of the Dragon",
            desc: "Discover Path of the Dragon covenant.",
            imag: "http://www.ps3trophies.org/images/trophies/755/14.jpg"
        },{
            game: "Deadly Premonition: The Director's Cut",
            name: "Legendary Tabatha",
            desc: "You'll never catch [Tabatha] with your current fishing rod. Borrow the legendary fishing rod from Jim and try again. [Tabatha] appears near the waterfall only on rainy days.",
            imag: "http://www.ps3trophies.org/images/trophies/1448/E18.jpg"
        },{
            game: "Dead Rising 2: Off The Record",
            name: "Adult Content",
            desc: "Take an extremely erotic picture",
            imag: "http://www.ps3trophies.org/images/trophies/995/04.jpg"
        },{
            game: "Dead Space 3",
            name: "Axes High",
            desc: "Kill 30 enemies using Fodder axes.",
            imag: "http://www.ps3trophies.org/images/trophies/1559/639.jpg"
        },{
            game: "Dishonored",
            name: "Ghost (d)",
            desc: "You completed all missions after the prologue, alerting or killing no one but key targets",
            imag: "http://www.ps3trophies.org/images/trophies/1123/F84.jpg"
        },{
            game: "DMC: Devil May Cry",
            name: "Looks like it's your lucky day",
            desc: "Complete a level without taking any damage",
            imag: "http://www.ps3trophies.org/images/trophies/750/EA8.jpg"
        },{
            game: "DOOM 3",
            name: "Turncoat",
            desc: "Get 2 demons to fight each other in DOOM 3, RoE, or Lost Mission",
            imag: "http://www.ps3trophies.org/images/trophies/1561/DC7.jpg"
        },{
            game: "Far Cry 3",
            name: "Fearless or Stupid",
            desc: "Dive more than 60m (Single Player only).",
            imag: "http://www.ps3trophies.org/images/trophies/922/32F.jpg"
        },{
            game: "Final Fantasy XIII-2",
            name: "Saddle Sore",
            desc: "Went the distance on chocobo-back.",
            imag: "http://www.ps3trophies.org/images/trophies/890/4AA.jpg"
        },{
            game: "God of War: Ascension",
            name: "No Drake. You can't have these.",
            desc: "Collect all Artifacts in the game",
            imag: "http://www.ps3trophies.org/images/trophies/1345/6EA.jpg"
        },{
            game: "GRID 2",
            name: "Shaken, Not Stirred",
            desc: "You rolled a car at least 7 times and landed on its wheels, just like Bond did.",
            imag: "http://www.ps3trophies.org/images/trophies/1371/B17.jpg"
        },{
            game: "Hannah Montana The Movie",
            name: "Hoedown Throwdown",
            desc: "Unlock Hoedown Throwdown.",
            imag: "http://www.ps3trophies.org/images/trophies/121/034.jpg"
        },{
            game: "Injustice: Gods Among Us",
            name: "The Caped Crusader",
            desc: "Win with Batman using every special move and his Supermove",
            imag: "http://www.ps3trophies.org/images/trophies/1572/5AE.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy",
            name: "The Lead Zeppelin",
            desc: "Break all Four Tethers to the Zeppelin",
            imag: "http://www.ps3trophies.org/images/trophies/1217/CF1.jpg"
        },{
            game: "Kingdoms of Amalur: Reckoning",
            name: "Streaker (d)",
            desc: "You spoke to someone while not wearing clothes.",
            imag: "http://www.ps3trophies.org/images/trophies/669/740.jpg"
        },{
            game: "LEGO Batman 2: DC Super Heroes (PS3)",
            name: "The House of Luthor",
            desc: "Obtain more than 10,100,000,000 Studs",
            imag: "http://www.ps3trophies.org/images/trophies/1347/AAB.jpg"
        },{
            game: "LEGO The Lord of the Rings",
            name: "One does not simply...",
            desc: "Walk into Mordor.",
            imag: "http://www.ps3trophies.org/images/trophies/1535/D5E.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "I Swear! I Did It By Mistake!",
            desc: "Peeped under Juliet's skirt once.",
            imag: "http://www.ps3trophies.org/images/trophies/1134/016.jpg"
        },{
            game: "Mass Effect 3",
            name: "Battle Scarred",
            desc: "Promote a multiplayer character to the Galaxy at War or import an ME3 character.",
            imag: "http://www.ps3trophies.org/images/trophies/845/AF7.jpg"
        },{
            game: "Max Payne 3",
            name: "The Fear Of Losing It",
            desc: "Survive A Level Without Painkillers",
            imag: "http://www.ps3trophies.org/images/trophies/353/2AD.jpg"
        },{
            game: "METAL GEAR SOLID 4",
            name: "You enjoy all the killing, that's why",
            desc: "Killed many enemies in one area, and vomited",
            imag: "http://www.ps3trophies.org/images/trophies/515/4DD.jpg"
        },{
            game: "Need for Speed: Most Wanted",
            name: "Mauled",
            desc: "Wreck 10 cops in a single pursuit in the Ford F-150 SVT Raptor",
            imag: "http://www.ps3trophies.org/images/trophies/1579/7B0.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Bounty Hunter",
            desc: "Complete 40 different bounty hunts",
            imag: "http://www.ps3trophies.org/images/trophies/1399/5B5.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Three for One",
            desc: "Earn a Triple Kill with a Level 1 Super Attack",
            imag: "http://www.ps3trophies.org/images/trophies/1308/19A.jpg"
        },{
            game: "Prototype 2",
            name: "The Floor is Lava",
            desc: "Travel a half mile using only Wall Run, Glide, Jump and Air Dash.",
            imag: "http://www.ps3trophies.org/images/trophies/848/1E8.jpg"
        },{
            game: "Ratchet and Clank",
            name: "Skillful",
            desc: "Master all 30 skill points",
            imag: "http://www.ps3trophies.org/images/trophies/1436/671.jpg"
        },{
            game: "Rayman Origins",
            name: "Nitro!",
            desc: "Earned ALL Speed trophies!",
            imag: "http://www.ps3trophies.org/images/trophies/651/13.jpg"
        },{
            game: "Remember Me",
            name: "Lord of the ring",
            desc: "Beat 15 enemies by making them fall off a platform",
            imag: "http://www.ps3trophies.org/images/trophies/1671/D2B.jpg"
        },{
            game: "Resident Evil Revelations",
            name: "Living on the Edge",
            desc: "[CAMPAIGN] Stop an enemy bullet with your knife",
            imag: "http://www.ps3trophies.org/images/trophies/1885/E9B.jpg"
        },{
            game: "Resistance 3",
            name: "Slaybells",
            desc: "Make Santa and his reindeer fly",
            imag: "http://www.ps3trophies.org/images/trophies/546/10.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Stay Classy Steelport",
            desc: "Kill 25 Gang Members each with 'the Penetrator' AND the Fart in a Jar.",
            imag: "http://www.ps3trophies.org/images/trophies/746/50.jpg"
        },{
            game: "Sleeping Dogs",
            name: "A Slap in the Face",
            desc: "Kill someone with a fish.",
            imag: "http://www.ps3trophies.org/images/trophies/1378/0EB.jpg"
        },{
            game: "Sly Cooper: Thieves in Time",
            name: "Navigate Like Drake",
            desc: "Take a look at every map in every episode.",
            imag: "http://www.ps3trophies.org/images/trophies/810/4B1.jpg"
        },{
            game: "Sniper: Ghost Warrior 2",
            name: "I Never Bleed",
            desc: "Complete the Campaign using max one medkit per mission",
            imag: "http://www.ps3trophies.org/images/trophies/1302/1EE.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "Situational Awareness",
            desc: "Stun an enemy by dumping sand on their head. (campaign only)",
            imag: "http://www.ps3trophies.org/images/trophies/613/153.jpg"
        },{
            game: "Starhawk",
            name: "Only the Beginning...",
            desc: "Complete the campaign on Mercenary difficulty.",
            imag: "http://www.ps3trophies.org/images/trophies/421/62D.jpg"
        },{
            game: "STREET FIGHTER X TEKKEN",
            name: "Trail Of Ruined Dreams",
            desc: "Defeat 5 rival teams in Arcade mode on Medium difficulty or higher.",
            imag: "http://www.ps3trophies.org/images/trophies/682/06A.jpg"
        },{
            game: "The Darkness II",
            name: "One Man Army (d)",
            desc: "Kill 25 enemies while being dragged from the restaurant, without dying or restarting checkpoint",
            imag: "http://www.ps3trophies.org/images/trophies/685/15.jpg"
        },{
            game: "Skyrim",
            name: "Words of Power",
            desc: "Learn all three words of a shout",
            imag: "http://www.ps3trophies.org/images/trophies/826/46.jpg"
        },{
            game: "The Last of Us",
            name: "Survivor +",
            desc: "Complete the game on Survivor +",
            imag: "http://www.ps3trophies.org/images/trophies/1317/767.jpg"
        },{
            game: "Tomb Raider",
            name: "Chatterbox (t)",
            desc: "Complete all conversations with the Endurance crew.",
            imag: "http://www.ps3trophies.org/images/trophies/831/83D.jpg"
        },{
            game: "Twisted Metal",
            name: "So much anger...",
            desc: "Discover the secret of Sophie Kane",
            imag: "http://www.ps3trophies.org/images/trophies/611/110.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Ride the Crocodile",
            desc: "Stand on the crocodile in the Secret Library",
            imag: "http://www.ps3trophies.org/images/trophies/373/46.jpg"
        },{
            game: "XCOM: Enemy Unknown",
            name: "Xavier",
            desc: "Mind Control an Ethereal. Single player only",
            imag: "http://www.ps3trophies.org/images/trophies/1350/000.jpg"
        }]
    },{
        listName: "Aeirou's Virtual Murder Club",
        banner: "http://i.imgur.com/eZJLWU1.png",
        award: "http://i.imgur.com/G0DzSFM.jpg",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Doctor",
            desc: "Perform an Air Assassination on a Poisoned NPC.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/25.jpg"
        },{
            game: "Battlefield: Hardline",
            name: "BYOB",
            desc: "Use the BBQ to take out the chef in Ep. 7: Glass Houses",
            imag: "http://www.playstationtrophies.org/images/trophies/2806/e18.jpg"
        },{
            game: "BioShock",
            name: "Toaster in the Tub",
            desc: "The player has shocked an enemy in the water",
            imag: "http://www.playstationtrophies.org/images/trophies/23/48.jpg"
        },{
            game: "BioShock Infinite",
            name: "Hazard Pay",
            desc: "Killed 10 enemies by utilizing environmental hazards.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/950.jpg"
        },{
            game: "Call of Duty: Advanced Warfare",
            name: "Party Crasher",
            desc: "Kill 20 enemies with the Grappling Hook in \"Sentinel.\"",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/21b.jpg"
        },{
            game: "Dead Space",
            name: "Get off my ship!",
            desc: "Kill the Slug Boss",
            imag: "http://www.playstationtrophies.org/images/trophies/26/016.jpg"
        },{
            game: "Dead Space 2",
            name: "Going for Distance",
            desc: "Impale an enemy and make him fly through the air for 17 meters - it must stick to the surface",
            imag: "http://www.playstationtrophies.org/images/trophies/355/44.jpg"
        },{
            game: "Dead Space 3",
            name: "Axes High",
            desc: "Kill 30 enemies using Fodder axes.",
            imag: "http://www.playstationtrophies.org/images/trophies/1559/639.jpg"
        },{
            game: "Dying Light",
            name: "Italian Plumber",
            desc: "Kill an enemy with a wrench, using Vault followed by Drop Attack",
            imag: "http://www.playstationtrophies.org/images/trophies/2070/0df.jpg"
        },{
            game: "Fallout 3",
            name: "Psychotic Prankster",
            desc: "Placed a grenade or mine while pickpocketing",
            imag: "http://www.playstationtrophies.org/images/trophies/70/047.jpg"
        },{
            game: "Far Cry 3",
            name: "Never Saw it Coming (f)",
            desc: "Kill an enemy with a takedown from above from a glider, zipline or parachute (Single Player only).",
            imag: "http://www.playstationtrophies.org/images/trophies/922/E2C.jpg"
        },{
            game: "Far Cry 4",
            name: "Tusker",
            desc: "Kill 30 enemies with an elephant (Campaign only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2778/cdd.jpg"
        },{
            game: "Hotline Miami",
            name: "Two Birds With One Stone",
            desc: "Hit two enemies with the same brick in one throw",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/6B3.jpg"
        },{
            game: "inFAMOUS 2",
            name: "Watch That First Step",
            desc: "Defeat an enemy by destroying the object they stand on.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/29.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "Excessive Force",
            desc: "Use a Karmic Streak attack to defeat exactly one enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/54c.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "JULIET51",
            desc: "51 successful dropkicks.",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/195.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "Black Celebration",
            desc: "Poison a Captain at his own Feast.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/af1.jpg"
        },{
            game: "Portal 2",
            name: "Empty Gesture",
            desc: "Drop your co-op partner in goo while they are gesturing by removing the bridge under them",
            imag: "http://www.playstationtrophies.org/images/trophies/610/40.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Dastardly",
            desc: "Place a hogtied woman on the train tracks, and witness her death by train.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/30.jpg"
        },{
            game: "Resident Evil 5",
            name: "Egg on Your Face",
            desc: "Defeat a Majini with a rotten egg.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/048.jpg"
        },{
            game: "Rocket League",
            name: "Still A Show-Off",
            desc: "Score a goal while reversing",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/490.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Stay Classy Steelport",
            desc: "Kill 25 Gang Members each with 'the Penetrator' AND the Fart in a Jar.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/50.jpg"
        },{
            game: "Sleeping Dogs",
            name: "A Slap in the Face",
            desc: "Kill someone with a fish.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/0EB.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Ass of Fire",
            desc: "You defeated 20 enemies using Cartman's Ass.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/F40.jpg"
        },{
            game: "The Evil Within",
            name: "Burn, Baby, Burn!",
            desc: "Kill 5 enemies with a torch.",
            imag: "http://www.playstationtrophies.org/images/trophies/3107/6d8.jpg"
        },{
            game: "The Last of Us: Left Behind",
            name: "Angel Knives",
            desc: "Defeat Black Fang without getting hit",
            imag: "http://www.playstationtrophies.org/images/trophies/2670/3b4.jpg"
        },{
            game: "The Order: 1886",
            name: "Between the Eyes",
            desc: "Kill 100 enemies with a headshot",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/7c2.jpg"
        },{
            game: "The Witcher 3: Wild Hunt",
            name: "Triple Threat",
            desc: "Kill 3 opponents in one fight using 3 different methods (swords, bombs, crossbow, Signs, etc.).",
            imag: "http://www.playstationtrophies.org/images/trophies/1904/916.jpg"
        },{
            game: "Tomb Raider",
            name: "Former Adventurer",
            desc: "Incapacitate 25 enemies with dodge counter.",
            imag: "http://www.playstationtrophies.org/images/trophies/2439/B93.jpg"
        },{
            game: "Until Dawn",
            name: "The Psycho Path",
            desc: "Sam or Ashley attacked the psycho with a weapon",
            imag: "http://www.playstationtrophies.org/images/trophies/1672/ef8.jpg"
        }]
    },{
        listName: "AlphaCookie's Strictly Business List of Cost Effective Titles",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_alpha.png",
        award: "http://i.imgur.com/Fn3Qg9z.png",
        trophies: [{
            game: "Battlefield: Hardline",
            name: "You Tazed Him, Bro!",
            desc: "Stun 5 criminals with the T62 CEW in Single Player",
            imag: "http://www.playstationtrophies.org/images/trophies/2806/e59.jpg"
        },{
            game: "The Binding of Isaac: Rebirth",
            name: "Boss Rush",
            desc: "Beat the Boss Rush",
            imag: "http://www.playstationtrophies.org/images/trophies/2220/ee7.jpg"
        },{
            game: "Bloodborne",
            name: "Martyr Logarius",
            desc: "Defeat Martyr Logarius",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/8c9.jpg"
        },{
            game: "Borderlands 2",
            name: "So Much Blood!",
            desc: "Gunzerked continuously for 90 seconds",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/63F.jpg"
        },{
            game: "Dark Souls II",
            name: "Brilliant Covenant",
            desc: "Discover a most brilliant covenant",
            imag: "http://www.playstationtrophies.org/images/trophies/1838/be1.jpg"
        },{
            game: "Dead Nation",
            name: "Mediocrity",
            desc: "Complete Campaign on 'Normal'",
            imag: "http://www.playstationtrophies.org/images/trophies/2580/738.jpg"
        },{
            game: "Doki Doki Universe",
            name: "And how does that make you feel?",
            desc: "Complete 25 quiz asteroids.",
            imag: "http://www.playstationtrophies.org/images/trophies/2433/8E0.jpg"
        },{
            game: "Dust: An Elysian Tail",
            name: "One Last Wish",
            desc: "Fulfill Bopo's wish for snow",
            imag: "http://www.playstationtrophies.org/images/trophies/3026/937.jpg"
        },{
            game: "God of War III",
            name: "Titan Slayer",
            desc: "Kill Cronos",
            imag: "http://www.playstationtrophies.org/images/trophies/319/002.jpg"
        },{
            game: "inFAMOUS First Light",
            name: "Expert",
            desc: "Complete 75% of all challenges",
            imag: "http://www.playstationtrophies.org/images/trophies/2878/4b9.jpg"
        },{
            game: "Jetpack Joyride",
            name: "Alpha Charlie Echo",
            desc: "Fly Over 2kms",
            imag: "http://www.playstationtrophies.org/images/trophies/3241/e74.jpg"
        },{
            game: "Joe Danger",
            name: "MEGA COMBO!",
            desc: "Get a x40 Combo (x100 on PS3 counts too, you overachiever)",
            imag: "http://www.playstationtrophies.org/images/trophies/2655/c52.jpg"
        },{
            game: "Machinarium",
            name: "Escaper",
            desc: "Escape Machinarium",
            imag: "http://www.playstationtrophies.org/images/trophies/1709/6AA.jpg"
        },{
            game: "Monsterbag",
            name: "Overkill",
            desc: "It's good to make sure the monster is really dead",
            imag: "http://www.playstationtrophies.org/images/trophies/3530/25b.jpg"
        },{
            game: "Paint Park Plus",
            name: "Love for stickers!",
            desc: "Pasted a sticker",
            imag: "http://www.playstationtrophies.org/images/trophies/1871/022.jpg"
        },{
            game: "Pixeljunk Shooter: Ultimate",
            name: "Double 11",
            desc: "Play the game at either 11:11 am or 11:11 pm",
            imag: "http://www.playstationtrophies.org/images/trophies/2596/749.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Let's Make a Scene",
            desc: "Complete Arcade mode with Sackboy",
            imag: "http://www.playstationtrophies.org/images/trophies/1587/44F.jpg"
        },{
            game: "Race the Sun",
            name: "Nighthawk",
            desc: "Reach level 15",
            imag: "http://www.playstationtrophies.org/images/trophies/2611/5c5.jpg"
        },{
            game: "RESOGUN",
            name: "Cool trophy!",
            desc: "Complete Mefitis",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/09.jpg"
        },{
            game: "Road Not Taken",
            name: "Good Samaritan",
            desc: "Rescued 30 Children",
            imag: "http://www.playstationtrophies.org/images/trophies/2447/e87.jpg"
        },{
            game: "Runner2: Future Legend of Rhythm Alien",
            name: "Dancing Fool",
            desc: "Dance 100 Times",
            imag: "http://www.playstationtrophies.org/images/trophies/1954/C2A.jpg"
        },{
            game: "Sonic & All-Stars Racing Transformed (Vita)",
            name: "Swirling Ranger!",
            desc: "Survive a Twister attack without crashing or being hit",
            imag: "http://www.playstationtrophies.org/images/trophies/1655/25E.jpg"
        },{
            game: "Spelunky",
            name: "Jungle Jammed",
            desc: "Reach the Ice Caves",
            imag: "http://www.playstationtrophies.org/images/trophies/1988/C08.jpg"
        },{
            game: "Super Stardust Delta",
            name: "Hero of the Galaxy",
            desc: "Arcade - Complete all planets",
            imag: "http://www.playstationtrophies.org/images/trophies/1091/01.jpg"
        },{
            game: "Titan Attacks!",
            name: "ULTIMATE SHIP",
            desc: "Everything maxed out",
            imag: "http://www.playstationtrophies.org/images/trophies/2713/040.jpg"
        },{
            game: "The Unfinished Swan",
            name: "Dreamer",
            desc: "Finish the King's Dream chapter",
            imag: "http://www.playstationtrophies.org/images/trophies/3132/65a.jpg"
        },{
            game: "The Legend of Korra",
            name: "Good Girl!",
            desc: "Completed a Naga Running sequence without hitting anything.",
            imag: "http://www.playstationtrophies.org/images/trophies/2886/c36.jpg"
        },{
            game: "Thomas Was Alone",
            name: "Part of the Problem",
            desc: "Bounce on Laura 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/26C.jpg"
        },{
            game: "Tower of Guns",
            name: "Start With a Jump...",
            desc: "Jump and Remain Airborn for 45 seconds",
            imag: "http://www.playstationtrophies.org/images/trophies/3305/92c.jpg"
        },{
            game: "Zombie Army Trilogy",
            name: "Good, bad, I'm the guy with the gun",
            desc: "Kill 50 Super Elites",
            imag: "http://www.playstationtrophies.org/images/trophies/3340/b14.jpg"
        }]
    },{
        listName: "Apple's Alternatives",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_apple.png",
        award: "http://i.imgur.com/UVu7Pf9.jpg",
        trophies: [{
            game: "3D Dot Game Heroes",
            name: "Triple 7s!",
            desc: "Collected 777G.",
            imag: "http://www.playstationtrophies.org/images/trophies/573/84E.jpg"
        },{
            game: "Atelier Ayesha: The Alchemist of Dusk",
            name: "A Garden of Memories",
            desc: "You've collected a lot of memories. It's proof that you went on a long journey.",
            imag: "http://www.playstationtrophies.org/images/trophies/1610/DAA.jpg"
        },{
            game: "Atelier Escha & Logy: Alchemists of the Dusk Sky",
            name: "A Grand Triumph",
            desc: "Stopped Flameu after she released her true power.",
            imag: "http://www.playstationtrophies.org/images/trophies/2147/2D4.jpg"
        },{
            game: "Castlevania: Lords of Shadow",
            name: "Master jeweler",
            desc: "Gather all hidden magic gems",
            imag: "http://www.playstationtrophies.org/images/trophies/420/30.jpg"
        },{
            game: "Catherine",
            name: "Take Your Time",
            desc: "Move a Dark Block 10 times in a row. (Golden Playhouse)",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/33.jpg"
        },{
            game: "Child of Eden",
            name: "Wanderer",
            desc: "Obtained all items in the Journey Archive.",
            imag: "http://www.playstationtrophies.org/images/trophies/626/16.jpg"
        },{
            game: "Child of Light",
            name: "Perfect Sonnet",
            desc: "Collect all Confessions.",
            imag: "http://www.playstationtrophies.org/images/trophies/2783/205.jpg"
        },{
            game: "Danganronpa: Trigger Happy Havoc",
            name: "Mr. Know-It-All",
            desc: "Filled in every page of every character's Report Card",
            imag: "http://www.playstationtrophies.org/images/trophies/2542/DA1.jpg"
        },{
            game: "Danganronpa 2: Goodbye Despair",
            name: "Gotta Raise 'Em All!",
            desc: "Fully raised every type of pets",
            imag: "http://www.playstationtrophies.org/images/trophies/3041/c9a.jpg"
        },{
            game: "Dyad",
            name: "Giraffes? Giraffes! From Outer Space",
            desc: "Complete the Trophy Level for Giraffes? Giraffes! In Outer Space",
            imag: "http://www.playstationtrophies.org/images/trophies/1633/C82.jpg"
        },{
            game: "El Shaddai: Ascension of the Metatron",
            name: "No Problem",
            desc: "Finish any chapter without collecting any armor-recovery items.",
            imag: "http://www.playstationtrophies.org/images/trophies/596/42.jpg"
        },{
            game: "Entwined",
            name: "Resolution",
            desc: "Finish all the Lifetimes as the evolved Dragon",
            imag: "http://www.playstationtrophies.org/images/trophies/2834/2d2.jpg"
        },{
            game: "Flower",
            name: "Dream",
            desc: "Beyond all flowers lies another room.",
            imag: "http://www.playstationtrophies.org/images/trophies/95/000.jpg"
        },{
            game: "Gravity Rush",
            name: "Top Cat",
            desc: "Raised Kat's reputation to \"Top Cat.\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1392/40.jpg"
        },{
            game: "htoL#NiQ -The Firefly Diary-",
            name: "Hopeless Romantic",
            desc: "Gazed at the moon in Stage 3-2",
            imag: "http://www.playstationtrophies.org/images/trophies/3125/aed.jpg"
        },{
            game: "ICO",
            name: "Bench Warmer",
            desc: "Save at all save points",
            imag: "http://www.playstationtrophies.org/images/trophies/749/13.jpg"
        },{
            game: "Journey",
            name: "Transcendence",
            desc: "Collect all unique glowing symbols across one or more journeys.",
            imag: "http://www.playstationtrophies.org/images/trophies/844/E0E.jpg"
        },{
            game: "Majin and the Forsaken Kingdom",
            name: "Chatterbox (m)",
            desc: "Talk to the Majin 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/504/27.jpg"
        },{
            game: "New Little King's Story",
            name: "All-time Submonster Champion",
            desc: "Obliterated Blue Dragon",
            imag: "http://www.playstationtrophies.org/images/trophies/1482/13.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Treasure Hunter",
            desc: "Awarded for finding all hidden treasure chests.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/B5C.jpg"
        },{
            game: "NIER",
            name: "Educated Warrior",
            desc: "Read the final novel segment.",
            imag: "http://www.playstationtrophies.org/images/trophies/379/17.jpg"
        },{
            game: "Odin Sphere Leifthrasir",
            name: "Maximum Alchemy",
            desc: "Created the highest grade in alchemy.",
            imag: "http://www.playstationtrophies.org/images/trophies/4302/fc3.jpg"
        },{
            game: "Okami HD",
            name: "All Creatures Great and Small",
            desc: "Complete your Animal Tome.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/3BE.jpg"
        },{
            game: "Resonance of Fate",
            name: "Four-Terminal Chain",
            desc: "A trophy for connecting four distinct terminals.",
            imag: "http://www.playstationtrophies.org/images/trophies/339/02.jpg"
        },{
            game: "Shadow of the Colossus",
            name: "Tower of Prayer",
            desc: "Save at all save points",
            imag: "http://www.playstationtrophies.org/images/trophies/874/28.jpg"
        },{
            game: "Tales of Graces f",
            name: "Gagonged!",
            desc: "Defeated the Rockgagong.",
            imag: "http://www.playstationtrophies.org/images/trophies/1702/E98.jpg"
        },{
            game: "Tales of Hearts R",
            name: "200-Hit Combo",
            desc: "Hit after hit after hit after hit after hit! You lay it on so thick and fast, the enemy doesn't stand a chance!",
            imag: "http://www.playstationtrophies.org/images/trophies/3194/69d.jpg"
        },{
            game: "Tears to Tiara II: Heir of the Overlord",
            name: "Stage 22 Complete",
            desc: "Clear stage 22.",
            imag: "http://www.playstationtrophies.org/images/trophies/3179/e2f.jpg"
        },{
            game: "The Legend of Heroes: Trails of Cold Steel",
            name: "Link Master",
            desc: "Raised any two characters to Link Level 5.",
            imag: "http://www.playstationtrophies.org/images/trophies/4279/e00.jpg"
        },{
            game: "Tokyo Jungle",
            name: "Jungle Man",
            desc: "Survive 45 years in SURVIVAL.",
            imag: "http://www.playstationtrophies.org/images/trophies/1518/E71.jpg"
        },{
            game: "Valkyria Chronicles",
            name: "Excellence in Leadership",
            desc: "Obtain the decoration given to an officer who has demonstrated remarkable skill as a leader through mastery of the art of command.",
            imag: "http://www.playstationtrophies.org/images/trophies/416/e0f.jpg"
        },{
            game: "Virtue's Last Reward",
            name: "A Certain Point of View",
            desc: "Caught a glimpse of another time.",
            imag: "http://www.playstationtrophies.org/images/trophies/1796/CA1.jpg"
        },{
            game: "Zero Time Dilemma",
            name: "SHIFTer",
            desc: "Clear all fragments.",
            imag: "http://www.playstationtrophies.org/images/trophies/4605/c8f.jpg"
        },{
            game: "Zone of the Enders HD",
            name: "Benedict Arnold",
            desc: "Defeat 10 enemies while controlling the Raptor",
            imag: "http://www.playstationtrophies.org/images/trophies/1056/FA9.jpg"
        },{
            game: "Zone of the Enders: The 2nd Runner HD",
            name: "Is It Hot In Here?",
            desc: "Reveal Ken's alternate outfit",
            imag: "http://www.playstationtrophies.org/images/trophies/1057/2DC.jpg"
        }]
    },{
        listName: "Ash's The Good, The Bad and The Odd",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_ash.png",
        award: "http://i.imgur.com/uNTjBnT.png",
        trophies: [{
            game: "BioShock 2",
            name: "9-Irony",
            desc: "Paid your respects to the founder of Rapture.",
            imag: "http://www.playstationtrophies.org/images/trophies/309/17.jpg"
        },{
            game: "Brothers: A Tale of Two Sons",
            name: "Whale Song",
            desc: "You practised singing.",
            imag: "http://www.playstationtrophies.org/images/trophies/1745/532.jpg"
        },{
            game: "Call of Duty: World at War",
            name: "Gunslinger (c)",
            desc: "Assassinate General Amsel with a pistol shot. (Solo only)",
            imag: "http://www.playstationtrophies.org/images/trophies/41/025.jpg"
        },{
            game: "Fallout 3",
            name: "Oasis",
            desc: "Completed 'Oasis'",
            imag: "http://www.playstationtrophies.org/images/trophies/70/022.jpg"
        },{
            game: "God of War III",
            name: "I didn't do it... But I wish I did!",
            desc: "Kill the Poseidon Princess",
            imag: "http://www.playstationtrophies.org/images/trophies/319/001.jpg"
        },{
            game: "Grand Theft Auto IV: The Lost and Damned",
            name: "TLAD: The Lost Boy",
            desc: "Become the leader of The Lost. (The Lost and Damned)",
            imag: "http://www.playstationtrophies.org/images/trophies/33/52.jpg"
        },{
            game: "Gravity Rush",
            name: "Gravitational Anomaly",
            desc: "Defeated 8 enemies with one special attack.",
            imag: "http://www.playstationtrophies.org/images/trophies/1392/30.jpg"
        },{
            game: "Guacamelee!",
            name: "Cock of the Walk",
            desc: "Defeat an enemy as a chicken",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/848.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Smart Girl",
            desc: "The Doc - Do not drink the Doc's beverage",
            imag: "http://www.playstationtrophies.org/images/trophies/321/34.jpg"
        },{
            game: "ICO",
            name: "Shining Sword",
            desc: "Acquire shining sword",
            imag: "http://www.playstationtrophies.org/images/trophies/749/12.jpg"
        },{
            game: "Jak II HD",
            name: "Strip Mine, Not Yours",
            desc: "Blow up Strip Mine in Eco Wells",
            imag: "http://www.playstationtrophies.org/images/trophies/1241/B23.jpg"
        },{
            game: "Killzone 2",
            name: "Untouchable (k)",
            desc: "Complete all missions on any difficulty level without dying",
            imag: "http://www.playstationtrophies.org/images/trophies/42/017.jpg"
        },{
            game: "LittleBigPlanet Vita",
            name: "Arcade Champion",
            desc: "Complete all achievements in all games from The Arcade.",
            imag: "http://www.playstationtrophies.org/images/trophies/1107/DCB.jpg"
        },{
            game: "Magus",
            name: "The Queen is Dead",
            desc: "Defeat the Daemon Queen.",
            imag: "http://www.playstationtrophies.org/images/trophies/2578/512.jpg"
        },{
            game: "Mass Effect",
            name: "Paramour (1)",
            desc: "Complete any romance subplot",
            imag: "http://www.playstationtrophies.org/images/trophies/1743/8F3.jpg"
        },{
            game: "Mortal Kombat",
            name: "Finish What You Start!",
            desc: "Perform a Fatality with all playable fighters",
            imag: "http://www.playstationtrophies.org/images/trophies/593/10.jpg"
        },{
            game: "Oddworld: Munch's Oddysee HD",
            name: "You Snooze, You Lose (o)",
            desc: "Kill a Big Bro Slig in his sleep.",
            imag: "http://www.playstationtrophies.org/images/trophies/1010/587.jpg"
        },{
            game: "Oddworld: New 'n' Tasty",
            name: "Still Life",
            desc: "Escape Stockyards and Free Fire Zone without triggering the alarm or dying",
            imag: "http://www.playstationtrophies.org/images/trophies/902/380.jpg"
        },{
            game: "Oddworld: Stranger's Wrath HD",
            name: "Now there's two?",
            desc: "Take out Sekto's personal bodyguards.",
            imag: "http://www.playstationtrophies.org/images/trophies/731/624.jpg"
        },{
            game: "Plants Vs. Zombies (Vita)",
            name: "Sproing! Sproing!",
            desc: "Complete Pogo Party without using Tall-Nuts or Magnet-shrooms.",
            imag: "http://www.playstationtrophies.org/images/trophies/1407/42.jpg"
        },{
            game: "Portal 2",
            name: "The Part Where He Kills You",
            desc: "This is that part",
            imag: "http://www.playstationtrophies.org/images/trophies/610/14.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Strange Things are Afoot",
            desc: "Complete a task for Stranger.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/17.jpg"
        },{
            game: "Resident Evil 6",
            name: "I Prefer Them Alive",
            desc: "Rescue two female survivors at the cathedral.",
            imag: "http://www.playstationtrophies.org/images/trophies/1061/F54.jpg"
        },{
            game: "Resistance 3",
            name: "BARF!",
            desc: "Make 6 Wardens puke at the same time in the prison",
            imag: "http://www.playstationtrophies.org/images/trophies/546/18.jpg"
        },{
            game: "Shadow of the Colossus",
            name: "The Sloth",
            desc: "Defeat 2nd Colossus",
            imag: "http://www.playstationtrophies.org/images/trophies/874/03.jpg"
        },{
            game: "Sound Shapes",
            name: "Death Mode: Cities",
            desc: "Complete the Death Mode level.",
            imag: "http://www.playstationtrophies.org/images/trophies/2404/E02.jpg"
        },{
            game: "Stick it to the Man",
            name: "Food for Thought",
            desc: "Read the mind of an eaten fish",
            imag: "http://www.playstationtrophies.org/images/trophies/2671/efa.jpg"
        },{
            game: "Tearaway",
            name: "Free Hug",
            desc: "Throw a Gopher at a Scrap",
            imag: "http://www.playstationtrophies.org/images/trophies/1674/314.jpg"
        },{
            game: "The Last of Us: Left Behind",
            name: "Don't Go - Survivor",
            desc: "Finish Left Behind on Survivor",
            imag: "http://www.playstationtrophies.org/images/trophies/2670/243.jpg"
        },{
            game: "Thomas Was Alone",
            name: "Part of the Problem",
            desc: "Bounce on Laura 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/26C.jpg"
        },{
            game: "Uncharted: Golden Abyss",
            name: "Ruffle My Feathers",
            desc: "Force Jose Parrot to squawk out 8 unique quips.",
            imag: "http://www.playstationtrophies.org/images/trophies/1092/56.jpg"
        }]
    },{
        listName: "Bounty V's I Game 4GOD List",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_bounty.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_bounty64.png",
        trophies: [{
            game: "Ace Combat: Assault Horizon",
            name: "Fearsome Guardian",
            desc: "Protected your allies using the gunship, and led a successful attack on the base.",
            imag: "http://www.playstationtrophies.org/images/trophies/698/06.jpg"
        },{
            game: "Assassin's Creed II",
            name: "Bloody Sunday",
            desc: "Complete DNA Sequence 4.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/08.jpg"
        },{
            game: "Bloodborne",
            name: "Blood-starved Beast",
            desc: "Defeat Blood-starved Beast.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/a58.jpg"
        },{
            game: "Burnout Paradise",
            name: "Smash 3 Burnout Billboards",
            desc: "Awarded when you smash through your 3rd pristine Burnout Billboard",
            imag: "http://www.playstationtrophies.org/images/trophies/1/005.jpg"
        },{
            game: "Dark Souls",
            name: "Covenant: Warrior of Sunlight",
            desc: "Discover Warrior of Sunlight covenant.",
            imag: "http://www.playstationtrophies.org/images/trophies/755/11.jpg"
        },{
            game: "Dark Souls II",
            name: "This is Dark Souls",
            desc: "Die for the first time",
            imag: "http://www.playstationtrophies.org/images/trophies/1838/5b9.jpg"
        },{
            game: "Dead Space",
            name: "Cannon Fodder",
            desc: "Complete Chapter 4 on any difficulty setting",
            imag: "http://www.playstationtrophies.org/images/trophies/26/003.jpg"
        },{
            game: "Dead Space 2",
            name: "Shut Down",
            desc: "Defeat the AI",
            imag: "http://www.playstationtrophies.org/images/trophies/355/09.jpg"
        },{
            game: "Dead Space 3",
            name: "Critical Mass",
            desc: "Recover the shuttle.",
            imag: "http://www.playstationtrophies.org/images/trophies/1559/974.jpg"
        },{
            game: "Demon's Souls",
            name: "Armor Spider's Trophy",
            desc: "Slayer of Demon \"Armor Spider\"",
            imag: "http://www.playstationtrophies.org/images/trophies/245/37.jpg"
        },{
            game: "Dragon's Dogma",
            name: "Getting a Head",
            desc: "Earned the approval of the Enlistment Corps.",
            imag: "http://www.playstationtrophies.org/images/trophies/994/4A9.jpg"
        },{
            game: "F1 2010",
            name: "Against all odds",
            desc: "You won a single player race after starting in last place",
            imag: "http://www.playstationtrophies.org/images/trophies/438/13.jpg"
        },{
            game: "F1 2011",
            name: "Do it Yourself",
            desc: "You won a Race in any mode using manual gears",
            imag: "http://www.playstationtrophies.org/images/trophies/964/12.jpg"
        },{
            game: "F1 2012",
            name: "Keeping it clean",
            desc: "You have completed a race without colliding with another car or object.",
            imag: "http://www.playstationtrophies.org/images/trophies/1458/66E.jpg"
        },{
            game: "Gran Turismo 6",
            name: "Down the Road and Back",
            desc: "Travel 62 miles (100km) in total.",
            imag: "http://www.playstationtrophies.org/images/trophies/2054/A3E.jpg"
        },{
            game: "GRID: Autosport",
            name: "Endured with the Best",
            desc: "Complete an Endurance Championship with the Ravenwest team.",
            imag: "http://www.playstationtrophies.org/images/trophies/2701/e48.jpg"
        },{
            game: "Hatsune Miku: Project DIVA F",
            name: "Concert Tour",
            desc: "You earned the title \"Concert Tour\"!",
            imag: "http://www.playstationtrophies.org/images/trophies/2251/F69.jpg"
        },{
            game: "Jak II HD",
            name: "Stripped Down",
            desc: "Rescue Vin at Strip Mine",
            imag: "http://www.playstationtrophies.org/images/trophies/1241/82D.jpg"
        },{
            game: "Journey",
            name: "History",
            desc: "Uncover all 10 ancient glyphs.",
            imag: "http://www.playstationtrophies.org/images/trophies/844/8B6.jpg"
        },{
            game: "Killzone: Shadow Fall",
            name: "Outsmarted",
            desc: "In singleplayer, get a quadruple kill with a single Frag Grenade",
            imag: "http://www.playstationtrophies.org/images/trophies/1931/14.jpg"
        },{
            game: "Legend of the Guardians: The Owls of Ga'Hoole",
            name: "O Rly?",
            desc: "Replay a mission",
            imag: "http://www.playstationtrophies.org/images/trophies/475/15.jpg"
        },{
            game: "LEGO The Lord of the Rings",
            name: "Let's hunt some Orc!",
            desc: "Complete 'Amon Hen'.",
            imag: "http://www.playstationtrophies.org/images/trophies/1535/F75.jpg"
        },{
            game: "Mirror's Edge",
            name: "Bag Lady",
            desc: "Find all three hidden bags in one chapter",
            imag: "http://www.playstationtrophies.org/images/trophies/43/013.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Boy Scout",
            desc: "Awarded for running 15 different errands.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/929.jpg"
        },{
            game: "Portal 2",
            name: "Stalemate Associate",
            desc: "Press the button!",
            imag: "http://www.playstationtrophies.org/images/trophies/610/07.jpg"
        },{
            game: "Project CARS",
            name: "Sunday Driver",
            desc: "Driven the speed limit (50 km/h) in an Italian car and appreciated the Azure coastal scenery",
            imag: "http://www.playstationtrophies.org/images/trophies/1908/3d0.jpg"
        },{
            game: "Shadow of the Colossus",
            name: "Aerial Dance",
            desc: "Defeat 5th Colossus",
            imag: "http://www.playstationtrophies.org/images/trophies/874/06.jpg"
        },{
            game: "Star Wars: The Force Unleashed",
            name: "Junkyard",
            desc: "Complete Level - Raxus Prime, act 1",
            imag: "http://www.playstationtrophies.org/images/trophies/195/04.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
            name: "Bring Down the Giant",
            desc: "Defeat the Gorog",
            imag: "http://www.playstationtrophies.org/images/trophies/397/04.jpg"
        },{
            game: "Skyrim",
            name: "Hard Worker",
            desc: "Chop wood, mine ore, and cook food",
            imag: "http://www.playstationtrophies.org/images/trophies/826/27.jpg"
        }]
    },{
        listName: "Bread's \"Y U No Play These Gamez?!\"",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_bread.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_breadskin64.png",
        trophies: [{
            game: "3D Dot Game Heroes",
            name: "That's a Big Fat Sword!",
            desc: "Maxed out the Giga Sword.",
            imag: "http://www.playstationtrophies.org/images/trophies/365/41.jpg"
        },{
            game: "Assassin's Creed IV Black Flag",
            name: "Devil Of The Caribbean",
            desc: "Defeat all 4 Legendary Ships.",
            imag: "http://www.playstationtrophies.org/images/trophies/2233/09a.jpg"
        },{
            game: "Assassin's Creed Syndicate",
            name: "Phantom",
            desc: "Learn every Stealth Skill as Evie.",
            imag: "http://www.playstationtrophies.org/images/trophies/3634/22d.jpg"
        },{
            game: "BioShock Infinite",
            name: "David & Goliath",
            desc: "Killed 20 \"Heavy Hitter\" enemies.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/33C.jpg"
        },{
            game: "Borderlands 2",
            name: "Up High, Down Low",
            desc: "Gave Claptrap a high five",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/39E.jpg"
        },{
            game: "Burnout Paradise",
            name: "Drive 750 miles",
            desc: "Awarded when you reach a total car distance driven of 750 miles",
            imag: "http://www.playstationtrophies.org/images/trophies/1/038.jpg"
        },{
            game: "Castle Crashers",
            name: "Kay Eye Ess Ess",
            desc: "Collect all 4 Princesses' kisses in a multiplayer game.",
            imag: "http://www.playstationtrophies.org/images/trophies/387/01.jpg"
        },{
            game: "Dark Cloud 2",
            name: "Supporting Cast",
            desc: "Recruit all possible companions to join your party.",
            imag: "http://www.playstationtrophies.org/images/trophies/4312/ba5.jpg"
        },{
            game: "Dead Space 2",
            name: "Hard to the Core",
            desc: "Complete the game on Hard Core setting",
            imag: "http://www.playstationtrophies.org/images/trophies/355/47.jpg"
        },{
            game: "Demon's Souls",
            name: "Master Bowman's Trophy",
            desc: "Obtained Best Bow by Spiderstone",
            imag: "http://www.playstationtrophies.org/images/trophies/245/19.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "Balls",
            desc: "Seems you like playing with balls, eh?",
            imag: "http://www.playstationtrophies.org/images/trophies/450/50.jpg"
        },{
            game: "Far Cry 3",
            name: "Never Saw it Coming (f)",
            desc: "Kill an enemy with a takedown from above from a glider, zipline or parachute (Single Player only).",
            imag: "http://www.playstationtrophies.org/images/trophies/922/E2C.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Stick Up Kid",
            desc: "GTA Online: Hold up all 20 Stores.",
            imag: "http://www.playstationtrophies.org/images/trophies/687/89c.jpg"
        },{
            game: "Hotline Miami",
            name: "1989",
            desc: "Kill 1989 enemies.",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/2A0.jpg"
        },{
            game: "Lara Croft and the Guardian of Light",
            name: "Breadwinner",
            desc: "Earn the top score objective in any level",
            imag: "http://www.playstationtrophies.org/images/trophies/433/07.jpg"
        },{
            game: "Life Is Strange",
            name: "Selfie Awareness",
            desc: "Take all optional photos in Episode 5: Polarized.",
            imag: "http://www.playstationtrophies.org/images/trophies/2971/b94.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Friendly",
            desc: "Complete a level with more than one player",
            imag: "http://www.playstationtrophies.org/images/trophies/14/19.jpg"
        },{
            game: "Mass Effect 3",
            name: "Legend",
            desc: "Mission accomplished.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/6CD.jpg"
        },{
            game: "Minecraft",
            name: "Bake Bread",
            desc: "Turn wheat into bread.",
            imag: "http://www.playstationtrophies.org/images/trophies/2376/C6E.jpg"
        },{
            game: "Mirror's Edge",
            name: "Martial artist",
            desc: "Perform a melee hit from a wallrun",
            imag: "http://www.playstationtrophies.org/images/trophies/43/040.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Humanitarian of the Year",
            desc: "Awarded for running 60 different errands.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/0EC.jpg"
        },{
            game: "Portal 2",
            name: "Gesticul-8",
            desc: "Perform all 8 gestures of your own volition in co-op",
            imag: "http://www.playstationtrophies.org/images/trophies/610/38.jpg"
        },{
            game: "Ratchet & Clank (2016)",
            name: "Ultimate Explorer",
            desc: "Collect every gold bolt.",
            imag: "http://www.playstationtrophies.org/images/trophies/2842/60a.jpg"
        },{
            game: "Ratchet & Clank: A Crack in Time",
            name: "My Blaster Runs Really, Really Hot",
            desc: "Score 10,000 points on My Blaster Runs Hot.",
            imag: "http://www.playstationtrophies.org/images/trophies/241/18.jpg"
        },{
            game: "Rayman Legends",
            name: "The competitor",
            desc: "Beat your friends' scores in the Challenges 30 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/1526/932.jpg"
        },{
            game: "Resident Evil 5",
            name: "A Friend in Need",
            desc: "Save partner 10 times when HELP is displayed",
            imag: "http://www.playstationtrophies.org/images/trophies/81/028.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Chief Inspector",
            desc: "Complete 100% of all missions, cases, favors, events, jobs and races.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/64B.jpg"
        },{
            game: "Sonic Generations",
            name: "All Stages Cleared!",
            desc: "Clear Sonic Generations.",
            imag: "http://www.playstationtrophies.org/images/trophies/999/19.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Friends in Strange Places",
            desc: "You befriended both crab people and gnomes.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/9B2.jpg"
        },{
            game: "Skyrim",
            name: "Taking Care of Business",
            desc: "Join the Thieves Guild.",
            imag: "http://www.playstationtrophies.org/images/trophies/826/16.jpg"
        },{
            game: "The Last of Us",
            name: "That's all I got",
            desc: "Survive all of Ellie's jokes.",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/4F4.jpg"
        },{
            game: "The Walking Dead",
            name: "Conversation Killer",
            desc: "Complete chapter 2 of episode 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/C89.jpg"
        },{
            game: "The Witcher 3: Wild Hunt",
            name: "Card Collector",
            desc: "Acquire all gwent cards available in the base version of the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/1904/034.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Combat Leapfrog",
            desc: "Defeat ten enemies in a row, alternating hand-to-hand combat and gunplay",
            imag: "http://www.playstationtrophies.org/images/trophies/373/10.jpg"
        },{
            game: "Yakuza 4",
            name: "Heir to the Powerful",
            desc: "Max out all characters to level 20.",
            imag: "http://www.playstationtrophies.org/images/trophies/586/10.jpg"
        }]
    },{
        listName: "Breaking Warbear's Representing the ABQ",
        banner: "http://i.imgur.com/2w2GzGK.jpg",
        award: "http://i.imgur.com/BiR5YVs.jpg",
        trophies: [{
            game: "BioShock Infinite",
            name: "Bolt From the Blue",
            desc: "In the Main Campaign, killed 5 enemies with a headshot while riding a Sky-Line.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/0CF.jpg"
        },{
            game: "Borderlands",
            name: "Pandora-dog Millionaire",
            desc: "Earned $1,000,000",
            imag: "http://www.playstationtrophies.org/images/trophies/39/31.jpg"
        },{
            game: "Call of Duty: Advanced Warfare",
            name: "Never Saw it Coming (c)",
            desc: "Boost jump, dash forward, then air stomp on an enemy.",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/56d.jpg"
        },{
            game: "Call of Duty: Modern Warfare 3",
            name: "Get Rich or Die Trying",
            desc: "Have $50,000 current balance in a Special Ops Survival game.",
            imag: "http://www.playstationtrophies.org/images/trophies/422/44.jpg"
        },{
            game: "Catherine",
            name: "Have an Ice Day",
            desc: "Slide an Ice Block 5 or more blocks. (Golden Playhouse)",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/30.jpg"
        },{
            game: "Dead Space",
            name: "Lab Rat",
            desc: "Complete Chapter 2 on any difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/26/001.jpg"
        },{
            game: "Dead Space 2",
            name: "Knock Knock",
            desc: "Complete the Drill Ride",
            imag: "http://www.playstationtrophies.org/images/trophies/355/13.jpg"
        },{
            game: "DEAD OR ALIVE 5 Last Round",
            name: "Change of Power",
            desc: "Press H+P+K during a Power Blow to tag in a partner and deliver a Tag Power Blow.",
            imag: "http://www.playstationtrophies.org/images/trophies/3408/c71.jpg"
        },{
            game: "Diablo III: Reaper of Souls",
            name: "Breaking Not So Bad",
            desc: "Use a merchant to repair an item.",
            imag: "http://www.playstationtrophies.org/images/trophies/2985/39a.jpg"
        },{
            game: "Dyad",
            name: "Danger",
            desc: "Complete the Trophy Level for Danger",
            imag: "http://www.playstationtrophies.org/images/trophies/1633/1E0.jpg"
        },{
            game: "Dying Light",
            name: "Trade Company",
            desc: "Sell items worth 10,000",
            imag: "http://www.playstationtrophies.org/images/trophies/2070/663.jpg"
        },{
            game: "Fallout 3",
            name: "Scientific Pursuits",
            desc: "Completed \"Scientific Pursuits\"",
            imag: "http://www.playstationtrophies.org/images/trophies/70/006.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "G.I. Blues",
            desc: "Completed G.I. Blues.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/48.jpg"
        },{
            game: "Far Cry 3",
            name: "The Good Stuff",
            desc: "Craft a special syringe.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/AA8.jpg"
        },{
            game: "Far Cry 4",
            name: "Tread Lightly",
            desc: "Liberate any Outpost without triggering an alarm in any mode (Campaign only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2778/7f4.jpg"
        },{
            game: "Flower",
            name: "Pure",
            desc: "Journey to the city unscathed.",
            imag: "http://www.playstationtrophies.org/images/trophies/95/007.jpg"
        },{
            game: "Flyhunter Origins",
            name: "House my Flyhunting?",
            desc: "Capture the Housefly",
            imag: "http://www.playstationtrophies.org/images/trophies/3234/72d.jpg"
        },{
            game: "HEAVY RAIN",
            name: "The Chef",
            desc: "Eureka - Prepare a good omelette on time",
            imag: "http://www.playstationtrophies.org/images/trophies/321/37.jpg"
        },{
            game: "inFAMOUS First Light",
            name: "That's So Fetch",
            desc: "Complete all Neon Graffiti",
            imag: "http://www.playstationtrophies.org/images/trophies/2878/9f5.jpg"
        },{
            game: "Magus",
            name: "I Feel...Drained...",
            desc: "Absorb the color from a power stone.",
            imag: "http://www.playstationtrophies.org/images/trophies/2578/644.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "Rise and Fall",
            desc: "After an uruk kills you to become a Captain, help him become a Warchief, then kill him.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/312.jpg"
        },{
            game: "Minecraft",
            name: "Local Brewery",
            desc: "Brew a potion.",
            imag: "http://www.playstationtrophies.org/images/trophies/2376/63A.jpg"
        },{
            game: "Ratchet Deadlocked HD",
            name: "Line 'em Up",
            desc: "Earn \"In a Row\" on Valix",
            imag: "http://www.playstationtrophies.org/images/trophies/1705/FCF.jpg"
        },{
            game: "Polar Panic",
            name: "Trophy Bear",
            desc: "Collect all 10 extra life pick-ups",
            imag: "http://www.playstationtrophies.org/images/trophies/313/011.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Bearly Legal",
            desc: "Kill and skin 18 grizzly bears.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/23.jpg"
        },{
            game: "Sly 3: Honor Among Thieves",
            name: "OMG A Flying Turtle!",
            desc: "Purchase Hover Pack",
            imag: "http://www.playstationtrophies.org/images/trophies/797/35.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Heisenberg",
            desc: "You defeated the Meth Tweekers while wearing the Evil Cartman goatee and bald cap.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/959.jpg"
        },{
            game: "Super Hang-On",
            name: "Unforgettable Name",
            desc: "Fill a track ranking with a single name.",
            imag: "http://www.playstationtrophies.org/images/trophies/1543/99C.jpg"
        },{
            game: "The Wolf Among Us",
            name: "Right to an Attorney",
            desc: "Completed Chapter 1 of Episode 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/1996/145.jpg"
        },{
            game: "Voodoo Chronicles: The First Sign",
            name: "Chemistry",
            desc: "Win Chemist",
            imag: "http://www.playstationtrophies.org/images/trophies/2176/039.jpg"
        }]
    },{
        listName: "Chrisheadshot's Aim Hacks Club",
        banner: "http://i.imgur.com/nAYG4Nn.png",
        award: "http://i.imgur.com/HYsVMI3.png",
        trophies: [{
            game: "Assassin's Creed: Freedom Cry",
            name: "Firepower",
            desc: "Kill 5 guards at once with a blunderbuss.",
            imag: "http://www.playstationtrophies.org/images/trophies/2551/788.jpg "
        },{
            game: "BioShock Infinite",
            name: "Bolt From the Blue",
            desc: "In the Main Campaign, killed 5 enemies with a headshot while riding a Sky-Line.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/0CF.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Two Birds with One Stone",
            desc: "Kill 2 enemies with a single bullet in Single Player or Special Ops.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/43.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "The Only True Stopper",
            desc: "Headshot Every Type of Enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/739.jpg"
        },{
            game: "Far Cry 4",
            name: "Two Birds",
            desc: "Using a sniper rifle, kill 2 targets with a single shot (Campaign only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2777/cc7.jpg"
        },{
            game: "Game of Thrones",
            name: "Honed and Ready",
            desc: "Completed Chapter 4 of Episode 4",
            imag: "http://www.playstationtrophies.org/images/trophies/2441/944.jpg"
        },{
            game: "God of War III",
            name: "Releasing the Floodgates",
            desc: "Kill Poseidon",
            imag: "http://www.playstationtrophies.org/images/trophies/319/001.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Wanted: Alive or Alive",
            desc: "Deliver a bail bond target alive.",
            imag: "http://www.playstationtrophies.org/images/trophies/3057/ea0.jpg"
        },{
            game: "Grand Theft Auto: San Andreas",
            name: "Beat the Cock",
            desc: "Win the Beat the Cock marathon.",
            imag: "http://www.playstationtrophies.org/images/trophies/4201/7b7.jpg"
        },{
            game: "Grand Theft Auto: Vice City",
            name: "Straight to the Dome",
            desc: "Perform 100 headshots.",
            imag: "http://www.playstationtrophies.org/images/trophies/4199/753.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy",
            name: "Hand Over Fish",
            desc: "Catch 200 Pounds of Fish",
            imag: "http://www.playstationtrophies.org/images/trophies/1217/4FA.jpg"
        },{
            game: "Life Is Strange",
            name: "Rangefinder",
            desc: "Take optional photo #4 in Episode 4: Dark Room",
            imag: "http://www.playstationtrophies.org/images/trophies/2971/ef9.jpg"
        },{
            game: "Ratchet & Clank 2: Going Commando",
            name: "Speed Demon",
            desc: "On Planet Barlow, get a time of 2:10 or less in the hoverbike race",
            imag: "http://www.playstationtrophies.org/images/trophies/1454/85C.jpg"
        },{
            game: "Ratchet & Clank 3: Up Your Arsenal",
            name: "Stay Squeeky Clean",
            desc: "Complete the \"Path of Death\" on Florana without taking any damage",
            imag: "http://www.playstationtrophies.org/images/trophies/1455/0AE.jpg"
        },{
            game: "Ratchet & Clank: Into the Nexus",
            name: "In Case of Zombies...",
            desc: "Purchase all weapons.",
            imag: "http://www.playstationtrophies.org/images/trophies/2172/122.jpg"
        },{
            game: "Red Dead Redemption",
            name: "The Gunslinger",
            desc: "Score a headshot on any enemy using Expert targeting mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/27.jpg"
        },{
            game: "RESOGUN",
            name: "How do I stop this thing?!",
            desc: "Kill 50 enemies with one boost",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/11.jpg"
        },{
            game: "Rocket League",
            name: "Break Shot",
            desc: "Score a goal by hitting your opponent into the ball",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/e6f.jpg"
        },{
            game: "Saints Row IV",
            name: "The Full Kinzie",
            desc: "Do everything you can for Kinzie -- Quests, Loyalty Missions... everything.",
            imag: "http://www.playstationtrophies.org/images/trophies/3031/2c3.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Sharpshooter",
            desc: "Shoot out a cop's tires while fleeing in a police chase.",
            imag: "http://www.playstationtrophies.org/images/trophies/3103/a82.jpg"
        },{
            game: "Sly Cooper and the Thievius Raccoonus",
            name: "Giving The Dog A Bone",
            desc: "Defeat Muggshot",
            imag: "http://www.playstationtrophies.org/images/trophies/612/23.jpg"
        },{
            game: "Sound Shapes",
            name: "Beat School: All You Need is Wub",
            desc: "Complete the Beat School level.",
            imag: "http://www.playstationtrophies.org/images/trophies/2404/D00.jpg"
        },{
            game: "Tales from the Borderlands",
            name: "Blood Money",
            desc: "Completed Chapter 6 of Episode 1",
            imag: "http://www.playstationtrophies.org/images/trophies/2442/d14.jpg"
        },{
            game: "The Last of Us",
            name: "For emergencies only",
            desc: "Fully upgrade all weapons",
            imag: "http://www.playstationtrophies.org/images/trophies/2670/af9.jpg"
        },{
            game: "The Walking Dead",
            name: "Goodbye, She Quietly Says",
            desc: "Complete chapter 1 of episode 3.",
            imag: "http://www.playstationtrophies.org/images/trophies/3111/e62.jpg"
        },{
            game: "The Walking Dead: Michonne",
            name: "Lies",
            desc: "Completed Chapter 6 of Episode 1",
            imag: "http://www.playstationtrophies.org/images/trophies/3730/af8.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Headed Out",
            desc: "Headed out with the group",
            imag: "http://www.playstationtrophies.org/images/trophies/3095/6e2.jpg"
        },{
            game: "The Wolf Among Us",
            name: "Right to an Attorney",
            desc: "Completed Chapter 1 of Episode 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/3099/e11.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "Headshot Expert (1)",
            desc: "Kill five enemies in a row with headshots",
            imag: "http://www.playstationtrophies.org/images/trophies/3686/ae1.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "250 Headshots",
            desc: "Defeat 250 enemies with headshots",
            imag: "http://www.playstationtrophies.org/images/trophies/4012/e89.jpg"
        }]
    },{
        listName: "DaFaztFingaz' Faztezt Fingaz",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_dff.png",
        award: "http://i.imgur.com/qnXu75M.png",
        trophies: [{
            game: "Borderlands",
            name: "Speedy McSpeederton",
            desc: "Raced around the Ludicrous Speedway in record time",
            imag: "http://www.ps3trophies.org/images/trophies/39/13.jpg"
        },{
            game: "Call of Duty: World at War",
            name: "Sum of All Zeros",
            desc: "Down 45 Japanese Zeros in 'Black Cats'. (Solo only)",
            imag: "http://www.ps3trophies.org/images/trophies/41/041.jpg"
        },{
            game: "Crysis 2",
            name: "Speeding Ticket",
            desc: "Break the speed limit in front of 10 speed cameras",
            imag: "http://www.ps3trophies.org/images/trophies/377/36.jpg"
        },{
            game: "Dead Space",
            name: "Crackshot",
            desc: "Achieve a perfect score in the Shooting Gallery",
            imag: "http://www.ps3trophies.org/images/trophies/26/031.jpg"
        },{
            game: "Derrick the Deathfin",
            name: "SPEED NEED",
            desc: "Get a gold medal in a speed level",
            imag: "http://www.ps3trophies.org/images/trophies/1536/B3D.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "Good Soul",
            desc: "Against all odds, you saved Faridah Malik's life.",
            imag: "http://www.ps3trophies.org/images/trophies/450/40.jpg"
        },{
            game: "Devil May Cry 3 HD",
            name: "Hellish Honor",
            desc: "Achieve an S Rank on all missions (any difficulty or character).",
            imag: "http://www.ps3trophies.org/images/trophies/1225/43F.jpg"
        },{
            game: "Dyad",
            name: "Miracles",
            desc: "Complete the Trophy Level for Miracles",
            imag: "http://www.ps3trophies.org/images/trophies/1633/485.jpg"
        },{
            game: "God of War",
            name: "Speed of Jason McDonald",
            desc: "Beat the game in under 5 hours on any Difficulty",
            imag: "http://www.ps3trophies.org/images/trophies/263/3.jpg"
        },{
            game: "Gran Turismo 5",
            name: "GT-R Official Record",
            desc: "Achieve a time of 7'29.03 on the Nurburgring Nordschleife in a Nissan GT-R '07. The record must be achieved in a Time Trial in the Arcade mode version of the car with tires of Sports Hard grade or lower equipped.",
            imag: "http://www.ps3trophies.org/images/trophies/320/04.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Close Shave (g)",
            desc: "Complete all Under the Bridge and Knife Flight challenges.",
            imag: "http://www.ps3trophies.org/images/trophies/687/883.jpg"
        },{
            game: "Hitman: Absolution",
            name: "The Russian Hare",
            desc: "47 precision headshots using a sniper rifle",
            imag: "http://www.ps3trophies.org/images/trophies/678/4D2.jpg"
        },{
            game: "Just Cause 2",
            name: "Stunt Flyer",
            desc: "Fly an airplane close to the ground for 30 seconds.",
            imag: "http://www.ps3trophies.org/images/trophies/329/01.jpg"
        },{
            game: "Karateka",
            name: "Swift Victory",
            desc: "Rescued Mariko in under 30 minutes",
            imag: "http://www.ps3trophies.org/images/trophies/1397/122.jpg"
        },{
            game: "Killzone 2",
            name: "Killing Spree",
            desc: "Kill 5 Helghast in 15 seconds - Kill 5 Helghast in 15 seconds whilst on foot and maintaining at least 85% health",
            imag: "http://www.ps3trophies.org/images/trophies/42/024.jpg"
        },{
            game: "Kingdom Hearts Final Mix HD",
            name: "One-Winged Angel",
            desc: "Defeat Sephiroth in the Platinum Match at Olympus Coliseum",
            imag: "http://www.ps3trophies.org/images/trophies/1939/282.jpg"
        },{
            game: "Mirror's Edge",
            name: "Chapter 3 Speedrun",
            desc: "Complete a Speedrun of Chapter 3 below the target time.",
            imag: "http://www.playstationtrophies.org/images/trophies/43/024.jpg"
        },{
            game: "Prince of Persia",
            name: "Speed Kill",
            desc: "Kill 10 generic enemies before they spawn.",
            imag: "http://www.ps3trophies.org/images/trophies/59/013.jpg"
        },{
            game: "Prototype",
            name: "Au",
            desc: "Achieve a rating of Gold or better in all Events.",
            imag: "http://www.ps3trophies.org/images/trophies/152/37.jpg"
        },{
            game: "Pure",
            name: "Zero to hero",
            desc: "Acquire a special trick within 30 secs of a Race starting.",
            imag: "http://www.ps3trophies.org/images/trophies/132/2.jpg"
        },{
            game: "Rage",
            name: "Just a Flesh Wound",
            desc: "Complete the final round of 5 Finger Filet",
            imag: "http://www.ps3trophies.org/images/trophies/354/18.jpg"
        },{
            game: "Red Faction: Armageddon",
            name: "Lock And Load",
            desc: "Keep Berserk active for at least 21 seconds in one use.",
            imag: "http://www.ps3trophies.org/images/trophies/583/35.jpg"
        },{
            game: "Red Faction: Guerrilla",
            name: "Warp Speed",
            desc: "Beat all Transporter Pro times.",
            imag: "http://www.ps3trophies.org/images/trophies/142/15.jpg"
        },{
            game: "Remember Me",
            name: "Dropping L-Bombs",
            desc: "Trigger two Logic Bombs in less than 15 seconds",
            imag: "http://www.ps3trophies.org/images/trophies/1671/932.jpg"
        },{
            game: "Retro/Grade",
            name: "Pro Campaign Complete",
            desc: "Beat the game on the Pro difficulty or harder",
            imag: "http://www.ps3trophies.org/images/trophies/1684/C61.jpg"
        },{
            game: "Super Stardust HD",
            name: "Token Hoarder",
            desc: "Arcade - Collect 15 tokens with a single boost",
            imag: "http://www.ps3trophies.org/images/trophies/13/silver.jpg"
        },{
            game: "Swarm",
            name: "In A Hurry",
            desc: "Achieve a 2X time bonus",
            imag: "http://www.ps3trophies.org/images/trophies/630/05.jpg"
        },{
            game: "The Darkness II",
            name: "Skeet Shoot",
            desc: "Throw an enemy into the air and kill him with gunfire before he lands",
            imag: "http://www.ps3trophies.org/images/trophies/685/31.jpg"
        },{
            game: "Velocity Ultra",
            name: "Neutrino Speed Is Too Slow",
            desc: "Earn a PERFECT medal on all Critical Urgency zones.",
            imag: "http://www.ps3trophies.org/images/trophies/2055/A0E.jpg"
        },{
            game: "WipEout HD",
            name: "Zone Zeus",
            desc: "In Zone Mode, reach Zone 75 on any track.",
            imag: "http://www.ps3trophies.org/images/trophies/21/023.jpg"
        }]
    },{
        listName: "DarkDante's Devilish Docket",
        banner: "http://i.imgur.com/HnhVf1s.png",
        award: "http://i.imgur.com/RDrRLhp.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Perfect Harmony",
            desc: "Tint your clothes with those colors: Wetland Ebony and Wetland Ivory.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/47.jpg"
        },{
            game: "Bayonetta",
            name: "I'm A Bit... I Mean Witch.",
            desc: "Execute a Torture Attack.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/22.jpg"
        },{
            game: "Danganronpa: Trigger Happy Havoc",
            name: "From Zero to Hero",
            desc: "Finished the Prologue",
            imag: "http://www.playstationtrophies.org/images/trophies/2542/D4E.jpg"
        },{
            game: "Dante's Inferno",
            name: "Poetry in Motion",
            desc: "Perform a 666 hit combo",
            imag: "http://www.playstationtrophies.org/images/trophies/322/28.jpg"
        },{
            game: "Deadly Premonition: The Director's Cut",
            name: "Delivery Man Q",
            desc: "Follow up on Becky's friends and find \"Delivery Man Q\" from Anna's diary. Sneak into the house of someone whose name starts with a Q, find evidence and take it to Becky.",
            imag: "http://www.playstationtrophies.org/images/trophies/1448/75B.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "The D Project",
            desc: "You watched the entire credit list and saw the surprise at the end.",
            imag: "http://www.playstationtrophies.org/images/trophies/450/39.jpg"
        },{
            game: "Devil May Cry HD",
            name: "Warming Up!",
            desc: "Finish the game on Normal Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/1223/360.jpg"
        },{
            game: "Devil May Cry 2 HD",
            name: "A Secret Revealed",
            desc: "Complete a Secret Mission",
            imag: "http://www.playstationtrophies.org/images/trophies/1224/CFC.jpg"
        },{
            game: "Devil May Cry 3 HD",
            name: "Blood, Sweat, and Tears",
            desc: "Pass 666 levels in Bloody Palace Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/1225/833.jpg"
        },{
            game: "Devil May Cry 4: Special Edition",
            name: "Devil In A Blue Coat",
            desc: "Clear the game with Vergil.",
            imag: "http://www.playstationtrophies.org/images/trophies/3499/9c2.jpg"
        },{
            game: "DMC: Devil May Cry",
            name: "Devils never cry",
            desc: "Complete all missions on the Dante Must Die difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/750/FB3.jpg"
        },{
            game: "Drakengard 3",
            name: "Crimson Intoner",
            desc: "Defeat 1000 enemies.",
            imag: "http://www.playstationtrophies.org/images/trophies/1970/2F5.jpg"
        },{
            game: "Fallout 3",
            name: "Silver-Tongued Devil",
            desc: "Won 50 Speech Challenges",
            imag: "http://www.playstationtrophies.org/images/trophies/70/043.jpg"
        },{
            game: "Far Cry 4",
            name: "The King Is Dead",
            desc: "Decide Pagan Min's fate (Campaign only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2777/a07.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "Off The Boat",
            desc: "You have completed the first mission.",
            imag: "http://www.playstationtrophies.org/images/trophies/33/001.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "San Andreas Sightseer",
            desc: "Explore all of Los Santos and Blaine County",
            imag: "http://www.playstationtrophies.org/images/trophies/687/ed3.jpg"
        },{
            game: "Killer is Dead",
            name: "Scratch One Samurai",
            desc: "Completed Episode 7.",
            imag: "http://www.playstationtrophies.org/images/trophies/1492/74E.jpg"
        },{
            game: "L.A. Noire",
            name: "Magpie",
            desc: "Find and inspect 95% of all clues.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/30.jpg"
        },{
            game: "Mafia II",
            name: "Sharp Suiter",
            desc: "Buy your first luxury suit.",
            imag: "http://www.playstationtrophies.org/images/trophies/351/35.jpg"
        },{
            game: "Metal Gear Solid 3",
            name: "PEACE WALKER",
            desc: "Finish game without killing anyone",
            imag: "http://www.playstationtrophies.org/images/trophies/1054/46.jpg"
        },{
            game: "METAL GEAR SOLID 4",
            name: "Crop Circle",
            desc: "Found a crop circle and heard a mysterious voice.",
            imag: "http://www.playstationtrophies.org/images/trophies/515/7DD.jpg"
        },{
            game: "Muramasa Rebirth",
            name: "665 and a Half Won't Do!",
            desc: "Defeat 666 monsters.",
            imag: "http://www.playstationtrophies.org/images/trophies/2057/DEE.jpg"
        },{
            game: "Okami HD",
            name: "Out of the Gate Swinging",
            desc: "Defeat all enemies at all three Devil Gate trial caves.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/568.jpg"
        },{
            game: "Persona 4 Golden",
            name: "Legend of Inaba",
            desc: "Legend of Inaba",
            imag: "http://www.playstationtrophies.org/images/trophies/1926/831.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Demon Hunter",
            desc: "Complete Arcade Mode with Dante",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/EDF.jpg"
        },{
            game: "Saints Row: The Third",
            name: "kill-deckers.exe",
            desc: "Complete 'http://deckers.die'.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/09.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Case Closed",
            desc: "Complete all cases.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/BE2.jpg"
        },{
            game: "Skyrim",
            name: "Hail Sithis!",
            desc: "Complete 'Hail Sithis!'",
            imag: "http://www.playstationtrophies.org/images/trophies/826/21.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Charted! - Easy",
            desc: "Easy - Finish the game in Easy Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/214/43.jpg"
        },{
            game: "Virtue's Last Reward",
            name: "A Consumate Collection",
            desc: "Found ALL the files!",
            imag: "http://www.playstationtrophies.org/images/trophies/1796/3EE.jpg"
        }]
    },{
        listName: "Doctor Bink's Trophy Laboratory",
        banner: "http://i.imgur.com/U8OHKla.png",
        award: "http://i.imgur.com/en7lL9S.jpg",
        trophies: [{
            game: "Borderlands: The Pre-Sequel",
            name: "Who You Gonna Call?",
            desc: "Completed the \"Sub-Level 13\" missions with 3 other players.",
            imag: "http://www.playstationtrophies.org/images/trophies/2667/92c.jpg"
        },{
            game: "Driver: San Francisco",
            name: "Radioactive!",
            desc: "Complete 50 Activities",
            imag: "http://www.playstationtrophies.org/images/trophies/363/34.jpg"
        },{
            game: "Evolve",
            name: "Darwinism",
            desc: "Win a match without losing any health as a Monster outside of the Tutorials.",
            imag: "http://www.playstationtrophies.org/images/trophies/2485/064.jpg"
        },{
            game: "Flower",
            name: "Discovery",
            desc: "Find and bloom a secret flower.",
            imag: "http://www.playstationtrophies.org/images/trophies/95/013.jpg"
        },{
            game: "God Mode",
            name: "Embryo",
            desc: "Destroy 50 scarab eggs before they hatch",
            imag: "http://www.playstationtrophies.org/images/trophies/1870/38D.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Smart Girl",
            desc: "The Doc - Do not drink the Doc's beverage",
            imag: "http://www.playstationtrophies.org/images/trophies/321/34.jpg"
        },{
            game: "Helldivers",
            name: "I'm no Zoologist, but how do you classify a 20 foot tentacle?",
            desc: "Face each new enemy once.",
            imag: "http://www.playstationtrophies.org/images/trophies/2221/1e4.jpg"
        },{
            game: "Hotline Miami",
            name: "Eye For Details",
            desc: "Collect all the puzzle pieces",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/C8C.jpg"
        },{
            game: "inFAMOUS 2",
            name: "Ambulance Chaser",
            desc: "Complete Hearts and Minds Campaign.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/18.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy",
            name: "Maximum Power!",
            desc: "Collect 101 Power Cells",
            imag: "http://www.playstationtrophies.org/images/trophies/1217/6DA.jpg"
        },{
            game: "Mass Effect 2",
            name: "Scientist",
            desc: "Complete any research project in the Normandy's laboratory",
            imag: "http://www.playstationtrophies.org/images/trophies/703/49.jpg"
        },{
            game: "Need For Speed: Hot Pursuit",
            name: "Godzilla",
            desc: "Get any medal in 'Run to the Hills' driving the Nissan GT-R SpecV without using any weapons",
            imag: "http://www.playstationtrophies.org/images/trophies/606/45.jpg"
        },{
            game: "Never Alone",
            name: "Dendrologist",
            desc: "You found all the Cultural Insights in the Forest.",
            imag: "http://www.playstationtrophies.org/images/trophies/3219/ff5.jpg"
        },{
            game: "Oddworld: Stranger's Wrath HD",
            name: "Go Organic",
            desc: "Bounty Packrat Palooka",
            imag: "http://www.playstationtrophies.org/images/trophies/731/1CB.jpg"
        },{
            game: "Okami HD",
            name: "All Creatures Great and Small",
            desc: "Complete your Animal Tome.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/3BE.jpg"
        },{
            game: "Peggle 2",
            name: "I Got a Fever",
            desc: "Cleared all orange pegs in a level (Singleplayer Only)",
            imag: "http://www.playstationtrophies.org/images/trophies/3034/b52.jpg"
        },{
            game: "Ratchet & Clank: A Crack in Time",
            name: "Insomniac",
            desc: "Visit the Insomniac Museum.",
            imag: "http://www.playstationtrophies.org/images/trophies/241/17.jpg"
        },{
            game: "Ratchet & Clank 2: Going Commando",
            name: "Mutation Complete",
            desc: "Defeat Mutated Protopet",
            imag: "http://www.playstationtrophies.org/images/trophies/1454/5FE.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Nurture or Nature?",
            desc: "Complete 'Remember My Family'.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/09.jpg"
        },{
            game: "RESOGUN",
            name: "Micromanagement",
            desc: "Save two humans within a span of one second",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/10.jpg"
        },{
            game: "Saints Row IV",
            name: "Walking the Dinosaur",
            desc: "Spent 30 minutes with Chicken Ned's prehistoric ancestor.",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/61.jpg"
        },{
            game: "Shadow of the Colossus",
            name: "Endangered Lizards",
            desc: "Killed all shining lizards",
            imag: "http://www.playstationtrophies.org/images/trophies/874/29.jpg"
        },{
            game: "SSX",
            name: "I'm Alive!",
            desc: "Rewind out of Death for the First Time (not achievable in Tutorial)",
            imag: "http://www.playstationtrophies.org/images/trophies/850/37C.jpg"
        },{
            game: "Tekken Tag Tournament HD",
            name: "Doctor B!",
            desc: "K.O. an onlooker in Tekken Bowl.",
            imag: "http://www.playstationtrophies.org/images/trophies/1085/ED5.jpg"
        },{
            game: "The Last of Us",
            name: "Endure and Survive",
            desc: "Collect all comics",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/30B.jpg"
        },{
            game: "The Order: 1886",
            name: "Power of Observation",
            desc: "Inspect all objects",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/302.jpg"
        },{
            game: "The Unfinished Swan",
            name: "Minimalist",
            desc: "Reach the Watchtower without throwing more than 3 balls.",
            imag: "http://www.playstationtrophies.org/images/trophies/3132/b4d.jpg"
        },{
            game: "Tiny Brains",
            name: "Intelligence Level: Tolstoi",
            desc: "Defeat the final boss in Tiny Story mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2382/a07.jpg"
        },{
            game: "Transformers: War For Cybertron",
            name: "Paging Ratchet",
            desc: "Revive 5 Autobot soldiers in Defend Iacon.",
            imag: "http://www.playstationtrophies.org/images/trophies/364/07.jpg"
        },{
            game: "X-Men Origins: Wolverine",
            name: "Environmentally Friendly",
            desc: "Killed 10 enemies using objects in the environment",
            imag: "http://www.playstationtrophies.org/images/trophies/113/044.jpg"
        }]
    },{
        listName: "Fletch's \"Valar Morghulis\"",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_fletch.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_fletchar64.png",
        trophies: [{
            game: "Assassin's Creed III",
            name: "Jager Bomb",
            desc: "After becoming fully notorious, kill 10 Jagers before losing your notoriety.",
            imag: "http://www.playstationtrophies.org/images/trophies/1400/A2A.jpg"
        },{
            game: "Assassin's Creed IV Black Flag",
            name: "Roped In",
            desc: "Perform 5 air assassinations from a swinging rope.",
            imag: "http://www.playstationtrophies.org/images/trophies/1949/F36.jpg"
        },{
            game: "Assassin's Creed: Revelations",
            name: "Mosh Pit",
            desc: "Have 10 guards poisoned at the same time",
            imag: "http://www.playstationtrophies.org/images/trophies/918/42.jpg"
        },{
            game: "Alien vs Predator",
            name: "One Ugly Mother",
            desc: "Complete Predator Campaign on Nightmare difficulty setting",
            imag: "http://www.playstationtrophies.org/images/trophies/323/30.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Pay Your Respects",
            desc: "A moment of remembrance",
            imag: "http://www.playstationtrophies.org/images/trophies/398/45.jpg"
        },{
            game: "Borderlands",
            name: "My Brother is an Italian Plumber",
            desc: "Killed an enemy plumber-style",
            imag: "http://www.playstationtrophies.org/images/trophies/39/06.jpg"
        },{
            game: "Darksiders",
            name: "River of Blood",
            desc: "Shed 3000 gallons of demon blood.",
            imag: "http://www.playstationtrophies.org/images/trophies/276/33.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "The Only True Stopper",
            desc: "Headshot every type of enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/739.jpg"
        },{
            game: "Far Cry 3",
            name: "Toxophilite",
            desc: "Kill a target from 70m or more with the bow (Single Player only).",
            imag: "http://www.playstationtrophies.org/images/trophies/922/124.jpg"
        },{
            game: "Far Cry 4",
            name: "The People's Champ",
            desc: "Reach Arena Rank 5 (Campaign Arena only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2777/9e5.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Red Mist",
            desc: "Complete all rampages",
            imag: "http://www.playstationtrophies.org/images/trophies/687/f0c.jpg"
        },{
            game: "God of War III",
            name: "Bloody Hell",
            desc: "Cover Kratos in 500 buckets of blood by killing the enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/319/001.jpg"
        },{
            game: "Guacamelee!",
            name: "Flawless",
            desc: "Defeat an arena without taking any damage",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/409.jpg"
        },{
            game: "Hitman: Absolution",
            name: "Whoops",
            desc: "Achieve your first accidental kill",
            imag: "http://www.playstationtrophies.org/images/trophies/678/B77.jpg"
        },{
            game: "inFAMOUS 2",
            name: "I'm As Shocked As You Are",
            desc: "Defeat an enemy or civilian by stepping in water",
            imag: "http://www.playstationtrophies.org/images/trophies/571/44.jpg"
        },{
            game: "L.A. Noire",
            name: "Roscoe And Friends",
            desc: "Kill at least one bad guy with every gun.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/29.jpg"
        },{
            game: "LEGO Batman 3: Beyond Gotham",
            name: "The Bright Knight",
            desc: "Play as Adam West",
            imag: "http://www.playstationtrophies.org/images/trophies/2798/39.jpg"
        },{
            game: "LittleBigPlanet 2",
            name: "Mortal Coil Shuffler Extraordinaire",
            desc: "Accumulate 20 deaths in one story level.",
            imag: "http://www.playstationtrophies.org/images/trophies/533/17.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "Zed's Dead, Baby, Zed's Dead",
            desc: "Defeated Zed",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/012.jpg"
        },{
            game: "Mafia II",
            name: "Out For Justice",
            desc: "Learn what it means to be a Scaletta",
            imag: "http://www.playstationtrophies.org/images/trophies/351/48.jpg"
        },{
            game: "Portal 2",
            name: "Pit Boss (p)",
            desc: "Show that pit who's boss",
            imag: "http://www.playstationtrophies.org/images/trophies/610/18.jpg"
        },{
            game: "Prototype 2",
            name: "Two For The Price Of One",
            desc: "Simultaneously kill 2 Brawlers using a single Devastator",
            imag: "http://www.playstationtrophies.org/images/trophies/848/FD9.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Dastardly",
            desc: "Place a hogtied woman on the train tracks, and witness her death by train",
            imag: "http://www.playstationtrophies.org/images/trophies/340/30.jpg"
        },{
            game: "Rocket League",
            name: "Stocked",
            desc: "Collect 150 Items",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/52e.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Stay Classy Steelport",
            desc: "Kill 25 Gang Members each with \"the Penetrator\" AND the Fart in a Jar.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/50.jpg"
        },{
            game: "Skyrim",
            name: "Dragon Hunter",
            desc: "Absorb 20 dragon souls",
            imag: "http://www.playstationtrophies.org/images/trophies/826/45.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Stick Savior",
            desc: "You defeated Princess Kenny and recovered the stick of truth",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/11C.jpg"
        },{
            game: "STAR WARS Battlefront",
            name: "A tremor in the Force",
            desc: "Play once as all the different heroes in the original game (Multiplayer)",
            imag: "http://www.playstationtrophies.org/images/trophies/2097/550.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
            name: "Poor Bob",
            desc: "Force Grip a Stormtrooper, impale him with a lightsaber, zap him with Force Lightning, then throw him into an object.",
            imag: "http://www.playstationtrophies.org/images/trophies/397/44.jpg"
        },{
            game: "The Last of Us",
            name: "The Last of Us - Survivor +",
            desc: "Complete the game on Survivor +",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/767.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Long Way Down",
            desc: "Witnessed a murder.",
            imag: "http://www.playstationtrophies.org/images/trophies/2352/18.jpg"
        },{
            game: "Tomb Raider",
            name: "Predator",
            desc: "Kill 50 enemies with the bow",
            imag: "http://www.playstationtrophies.org/images/trophies/831/EBC.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Survivor (u2)",
            desc: "Defeat 75 enemies in a row without dying",
            imag: "http://www.playstationtrophies.org/images/trophies/214/14.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Expert Ninja",
            desc: "Defeat 5 enemies in a row using Stealth attacks",
            imag: "http://www.playstationtrophies.org/images/trophies/373/42.jpg"
        },{
            game: "Uncharted 4: A Thief's End",
            name: "Charted! - Speedrun",
            desc: "Complete the game in 6 hours or less",
            imag: "http://www.playstationtrophies.org/images/trophies/2388/700.jpg"
        }]
    },{
        listName: "Football's Favourites",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_football.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_football64.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "High Dive",
            desc: "Perform a Leap of Faith from the Top of Florence's Glotto's Campanile.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/41.jpg"
        },{
            game: "Anarchy: Rush Hour",
            name: "Buy all cars",
            desc: "Buy all possible cars.",
            imag: "http://www.playstationtrophies.org/images/trophies/480/33.jpg"
        },{
            game: "Burnout Paradise",
            name: "Complete 10 Freeburn Challenges",
            desc: "Awarded when you complete your 10th Freeburn Challenge",
            imag: "http://www.playstationtrophies.org/images/trophies/1/048.jpg"
        },{
            game: "Buzz!: Quiz TV",
            name: "The Barnard Award Bronze",
            desc: "Score over 1500 points in a singleplayer game",
            imag: "http://www.playstationtrophies.org/images/trophies/103/015.jpg"
        },{
            game: "FIFA Street",
            name: "Online Dominance",
            desc: "Win all 9 online cups",
            imag: "http://www.playstationtrophies.org/images/trophies/1152/97A.jpg"
        },{
            game: "Frogger Returns",
            name: "The Swamp",
            desc: "Frogger has returned home!!!",
            imag: "http://www.playstationtrophies.org/images/trophies/470/353.jpg"
        },{
            game: "God of War",
            name: "I'll Take the Physical Challenge",
            desc: "Complete the Challenge of the Gods",
            imag: "http://www.playstationtrophies.org/images/trophies/263/3.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Electrified",
            desc: "The Butterfly - Complete the Butterfly Trial successfully",
            imag: "http://www.playstationtrophies.org/images/trophies/321/22.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy",
            name: "Hand Over Fish",
            desc: "Catch 200 Pounds of Fish",
            imag: "http://www.playstationtrophies.org/images/trophies/1217/4FA.jpg"
        },{
            game: "Jetpack Joyride",
            name: "Romeo Alpha Delta",
            desc: "Fly over 5kms",
            imag: "http://www.playstationtrophies.org/images/trophies/1872/C96.jpg"
        },{
            game: "L.A. Noire",
            name: "Bulletproof Windshield",
            desc: "Kill the drivers of both MP vehicles in the gun battle at Hughes Aircraft, before they pull up.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/55.jpg"
        },{
            game: "Lara Croft and the Guardian of Light",
            name: "Jump Jump",
            desc: "Jump from Totec's shield while he is jumping",
            imag: "http://www.playstationtrophies.org/images/trophies/433/05.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Booty Master",
            desc: "Collect all the prize bubbles on the story levels",
            imag: "http://www.playstationtrophies.org/images/trophies/14/36.jpg"
        },{
            game: "Need for Speed: Undercover",
            name: "First of Many",
            desc: "Win a Ranked Multiplayer event against 7 human players",
            imag: "http://www.playstationtrophies.org/images/trophies/131/07.jpg"
        },{
            game: "Ratchet & Clank 2: Going Commando",
            name: "You're My Hero",
            desc: "Protect all tourists on Planet Todano from the squirrels",
            imag: "http://www.playstationtrophies.org/images/trophies/1454/7F9.jpg"
        },{
            game: "Ratchet & Clank 3: Up Your Arsenal",
            name: "Hit the Motherload",
            desc: "Collect all 101 Sewer Crystals on Aquatos",
            imag: "http://www.playstationtrophies.org/images/trophies/1455/36B.jpg"
        },{
            game: "Ratchet & Clank: A Crack in Time",
            name: "Insomniac",
            desc: "Visit the Insomniac Museum.",
            imag: "http://www.playstationtrophies.org/images/trophies/241/17.jpg"
        },{
            game: "RESOGUN",
            name: "Denied!",
            desc: "Save a human from Abductor's beam",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/17.jpg"
        },{
            game: "Sound Shapes",
            name: "Death Mode: Mechanica",
            desc: "Complete the Death Mode level.",
            imag: "http://www.playstationtrophies.org/images/trophies/1406/0D2.jpg"
        },{
            game: "The Last of Us",
            name: "Hunter",
            desc: "Complete the Hunter Journey",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/87C.jpg"
        },{
            game: "The Walking Dead",
            name: "What Remains",
            desc: "Complete Episode 5: \"No Time Left\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/B8D.jpg"
        },{
            game: "Tomb Raider: Legend",
            name: "Gooooooooooooooooooooooooal!",
            desc: "Kick the soccer ball against the door of the church in Peru",
            imag: "http://www.playstationtrophies.org/images/trophies/856/07.jpg"
        },{
            game: "Tomb Raider: Underworld",
            name: "Master Survivalist",
            desc: "Complete the game on hardest possible settings",
            imag: "http://www.playstationtrophies.org/images/trophies/143/03.jpg"
        },{
            game: "Treasures of Montezuma Blitz",
            name: "Nuclear Blast",
            desc: "Destroy every token present on game board.",
            imag: "http://www.playstationtrophies.org/images/trophies/1567/2E0.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "Survivor (u)",
            desc: "Kill 50 enemies in a row without dying",
            imag: "http://www.playstationtrophies.org/images/trophies/8/2.jpg"
        },{
            game: "Uncharted 4: A Thief's End",
            name: "Best Score!",
            desc: "Beat the best score in the retro videogame",
            imag: "http://www.playstationtrophies.org/images/trophies/2388/004.jpg"
        },{
            game: "Voodoo Dice",
            name: "Voodoo sorcerer",
            desc: "Complete all the levels in each world by beating the Voodoo time",
            imag: "http://www.playstationtrophies.org/images/trophies/568/03.jpg"
        },{
            game: "Wake-up Club",
            name: "Best Pals",
            desc: "The Wake-up Club has been successful 365 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/1515/BE4.jpg"
        },{
            game: "WipEout 2048",
            name: "Speed Thrills",
            desc: "ELITE PASS any A+ Class Challenge",
            imag: "http://www.playstationtrophies.org/images/trophies/1093/17.jpg"
        },{
            game: "WipEout HD",
            name: "Da Bomb",
            desc: "Destroy all 14 bombs in any Detonator event.",
            imag: "http://www.playstationtrophies.org/images/trophies/21/40.jpg"
        },{
            game: "WWE Legends of WrestleMania",
            name: "Manager",
            desc: "Win using a manager in an Exhibition match",
            imag: "http://www.playstationtrophies.org/images/trophies/88/001.jpg"
        }]
    },{
        listName: "Fynn's Bite the Bullet! List",
        banner: "http://i.imgur.com/daODOOs.png",
        award: "http://i.imgur.com/JuvGOCx.png",
        trophies: [{
            game: "Battlefield: Bad Company 2",
            name: "Guns Guns Guns",
            desc: "Campaign: find 15 collectable weapons",
            imag: "http://www.playstationtrophies.org/images/trophies/326/17.jpg"
        },{
            game: "Battlefield 3",
            name: "Army of Two",
            desc: "Completed all co-op missions on Hard",
            imag: "http://www.playstationtrophies.org/images/trophies/883/29.jpg"
        },{
            game: "Battlefield 4",
            name: "Above and beyond the call",
            desc: "Complete all Assignments in the Campaign",
            imag: "http://www.playstationtrophies.org/images/trophies/2235/6B7.jpg"
        },{
            game: "BioShock",
            name: "Brass Balls",
            desc: "Complete the game on Hard difficulty without using a Vita-Chamber",
            imag: "http://www.playstationtrophies.org/images/trophies/23/51.jpg"
        },{
            game: "BioShock Infinite",
            name: "Bolt From the Blue",
            desc: "Killed 5 enemies with a headshot while riding a Sky-Line.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/0CF.jpg"
        },{
            game: "Call of Duty: Black Ops",
            name: "Perks in Spaaaaace!",
            desc: "In Moon, purchase every perk in one game.",
            imag: "http://www.playstationtrophies.org/images/trophies/344/69.jpg"
        },{
            game: "Call of Duty: Black Ops II",
            name: "Overachiever",
            desc: "In Origins, complete all 4 challenges in one game",
            imag: "http://www.playstationtrophies.org/images/trophies/1344/90.jpg"
        },{
            game: "Call of Duty: Black Ops Declassified",
            name: "Double Down",
            desc: "Kill 8 enemies with 4 or fewer bullets in 'OPS M.I.A.' Operation",
            imag: "http://www.playstationtrophies.org/images/trophies/1586/F86.jpg"
        },{
            game: "Call of Duty: Ghosts",
            name: "Completionist",
            desc: "Complete all challenges and escape in Regular or Hardcore difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/2237/17E.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Star 69",
            desc: "Earn 69 stars in Special Ops.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/36.jpg"
        },{
            game: "Call of Duty: Modern Warfare 3",
            name: "Unstoppable (c)",
            desc: "Reach Wave 15 in each mission of Special Ops Survival mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/422/47.jpg"
        },{
            game: "Call of Duty: World at War",
            name: "Pack Addict!",
            desc: "Upgrade 5 weapons at the Pack A Punch Machine. (Map Pack 3 only)",
            imag: "http://www.playstationtrophies.org/images/trophies/41/063.jpg"
        },{
            game: "Fallout 3",
            name: "Yes, I Play with Dolls",
            desc: "Collected 10 Vault-Tec Bobbleheads",
            imag: "http://www.playstationtrophies.org/images/trophies/70/049.jpg"
        },{
            game: "Far Cry 3",
            name: "Fully Inked",
            desc: "Earn every tattoo by learning all the skills.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/238.jpg"
        },{
            game: "Jurassic: The Hunted",
            name: "Nuck Chorris Rex",
            desc: "Complete the game without dying",
            imag: "http://www.playstationtrophies.org/images/trophies/274/29.jpg"
        },{
            game: "Killzone 3",
            name: "Completist",
            desc: "Destroyed every destructible weapon on the MAWLR while on foot and on the Intruder",
            imag: "http://www.playstationtrophies.org/images/trophies/430/25.jpg"
        },{
            game: "Killzone: Mercenary",
            name: "Clean House",
            desc: "Complete all Demolition contracts",
            imag: "http://www.playstationtrophies.org/images/trophies/1675/03F.jpg"
        },{
            game: "L.A. Noire",
            name: "Every Herb Bearing Seed",
            desc: "Complete 'Reefer Madness'.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/57.jpg"
        },{
            game: "Medal of Honor",
            name: "Like a Surgeon",
            desc: "Singleplayer: While long range sniping, hit one of every body part",
            imag: "http://www.playstationtrophies.org/images/trophies/396/38.jpg"
        },{
            game: "Payday: The Heist",
            name: "Gold digger",
            desc: "Beat SLAUGHTERHOUSE within 15 minutes, taking all the gold. To complete this challenge, you will have to have played the heist from the start.",
            imag: "http://www.playstationtrophies.org/images/trophies/1135/2223.jpg"
        },{
            game: "Resident Evil 5",
            name: "Bull's-eye",
            desc: "Defeat 30 enemies with the Longbow.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/034.jpg"
        },{
            game: "Resistance 3",
            name: "Frickin' Laser Beams",
            desc: "Get to the first mineshaft without being hit by sniper fire in Mt. Pleasant, PA",
            imag: "http://www.playstationtrophies.org/images/trophies/546/15.jpg"
        },{
            game: "Resistance: Burning Skies",
            name: "Boom",
            desc: "Kill 100 Chimera with headshots in the Single Player Campaign",
            imag: "http://www.playstationtrophies.org/images/trophies/1153/45D.jpg"
        },{
            game: "Sniper Elite V2",
            name: "Make Every Bullet Count",
            desc: "Complete a level with 100% accuracy, using only rifles",
            imag: "http://www.playstationtrophies.org/images/trophies/988/000.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "Close Combat Carnage",
            desc: "Kill 4 enemies with a shotgun in 10 seconds or less. (campaign only)",
            imag: "http://www.playstationtrophies.org/images/trophies/613/C29.jpg"
        },{
            game: "The Darkness II",
            name: "That's Why I'm the Boss",
            desc: "Impress Dolfo in two different ways",
            imag: "http://www.playstationtrophies.org/images/trophies/685/27.jpg"
        },{
            game: "Tomb Raider",
            name: "Inconceivable!",
            desc: "Complete all challenges.",
            imag: "http://www.playstationtrophies.org/images/trophies/831/5FE.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "Charted! - Crushing",
            desc: "Crushing - Finish the game in Crushing Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/8/3.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "You Can't Break Me",
            desc: "Complete all 3 co-op objective maps on Crushing",
            imag: "http://www.playstationtrophies.org/images/trophies/214/61.jpg"
        },{
            game: "Uncharted: Golden Abyss",
            name: "Steel Fist Expert (g)",
            desc: "Defeat 10 enemies in a row with a single punch, after softening them up with gunfire.",
            imag: "http://www.playstationtrophies.org/images/trophies/1092/25.jpg"
        }]
    },{
        listName: "Germain's Japanese Gems",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_germain.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_germain64.jpg",
        trophies: [{
            game: "3D Dot Game Heroes",
            name: "And Everyone Lived Happily Ever After!",
            desc: "Cleared the game with the princess restored.",
            imag: "http://www.playstationtrophies.org/images/trophies/365/24.jpg"
        },{
            game: "Acceleration of Suguri X-Edition",
            name: "What's Your Story",
            desc: "Unlock all character story lines on any difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/917/13.jpg"
        },{
            game: "AKIBA'S TRIP: Undead & Undressed",
            name: "Living Embodiment of Her Happiness",
            desc: "Achieved the little sister ending.",
            imag: "http://www.playstationtrophies.org/images/trophies/2956/859.jpg"
        },{
            game: "Ar tonelico Qoga: Knell of Ar Ciel",
            name: "\"Nothing, Ma!\"",
            desc: "Hit the Panic Button 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/931/03.jpg"
        },{
            game: "Daytona USA",
            name: "YOU JUST LOST YOUR...",
            desc: "Find the hidden sign at the dead end in ADVANCED Course of ARCADE MODE.",
            imag: "http://www.playstationtrophies.org/images/trophies/1208/05.jpg"
        },{
            game: "Dead or Alive 5",
            name: "On the Edge of Your Seat",
            desc: "Play Spectator mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2205/CB0.jpg"
        },{
            game: "Disgaea 3",
            name: "ABC's of Hitting",
            desc: "Get hit by ABC Gum.",
            imag: "http://www.playstationtrophies.org/images/trophies/178/1.jpg"
        },{
            game: "Disgaea 4: A Promise Unforgotten",
            name: "Step Back and Watch the Fireworks",
            desc: "Explode ten Prinnies in a row.",
            imag: "http://www.playstationtrophies.org/images/trophies/1024/36.jpg"
        },{
            game: "Disgaea D2: A Brighter Darkness",
            name: "Ooh La Laharl!",
            desc: "Requirement: Pass the Bill to get Girl Laharl. So...you like Laharl as a girl?",
            imag: "http://www.playstationtrophies.org/images/trophies/2312/F13.jpg"
        },{
            game: "Fairy Fencer F",
            name: "The World's Money is Not Enough",
            desc: "Lola joined the party. \"Despite my appearance, I'm actually a fairy.\"",
            imag: "http://www.playstationtrophies.org/images/trophies/3066/c2b.jpg"
        },{
            game: "Fighting Vipers",
            name: "Skirt Destroyer",
            desc: "As Candy unequip armor each Arcade stg or break her lower armor after 10 straight wins in Offline VS",
            imag: "http://www.playstationtrophies.org/images/trophies/1825/D00.jpg"
        },{
            game: "Final Fantasy X HD",
            name: "All Together",
            desc: "All party members come together",
            imag: "http://www.playstationtrophies.org/images/trophies/1184/011.jpg"
        },{
            game: "Final Fantasy X-2",
            name: "Dressed for the Occasion",
            desc: "Change Dresspheres on Yuna, Rikku, and Paine in one battle",
            imag: "http://www.playstationtrophies.org/images/trophies/2480/383.jpg"
        },{
            game: "Final Fantasy XIII",
            name: "Superstar",
            desc: "Earned a 5-star ranking in the battle to determine the world's fate.",
            imag: "http://www.playstationtrophies.org/images/trophies/307/36.jpg"
        },{
            game: "Final Fantasy XIII-2",
            name: "Giant's Fist",
            desc: "Dealt 99,999 damage with a single attack.",
            imag: "http://www.playstationtrophies.org/images/trophies/890/4C2.jpg"
        },{
            game: "Hatsune Miku: Project DIVA F",
            name: "Art Collection",
            desc: "You earned the title \"Art Collection\"!",
            imag: "http://www.playstationtrophies.org/images/trophies/2251/3A4.jpg"
        },{
            game: "Hatsune Miku: Project DIVA F 2nd",
            name: "Pardon Me!",
            desc: "You earned the title \"Pardon Me!\"!",
            imag: "http://www.playstationtrophies.org/images/trophies/2635/7D1.jpg"
        },{
            game: "Hyperdimension Neptunia mk2",
            name: "Happily Ever After (h)",
            desc: "Viewed the True ending.",
            imag: "http://www.playstationtrophies.org/images/trophies/1393/5AF.jpg"
        },{
            game: "Hyperdimension Neptunia Re;Birth1",
            name: "True Ending",
            desc: "Watched the True Ending",
            imag: "http://www.playstationtrophies.org/images/trophies/3004/27f.jpg"
        },{
            game: "Hyperdimension Neptunia Victory",
            name: "Hot Stuff: Neptune",
            desc: "\"Everyone's Lily Rank is maxed out with me! Wow, it looks like I'm all kinds of popular!\" -Neptune",
            imag: "http://www.playstationtrophies.org/images/trophies/1892/3DE.jpg"
        },{
            game: "Last Rebellion",
            name: "Fine, dood, we're outta here!",
            desc: "Prinny IV Defeated",
            imag: "http://www.playstationtrophies.org/images/trophies/391/02.jpg"
        },{
            game: "Resonance of Fate",
            name: "Tera-Driver",
            desc: "A trophy for loading over a terabit of data from the disc.",
            imag: "http://www.playstationtrophies.org/images/trophies/339/20.jpg"
        },{
            game: "Senran Kagura Shinovi Versus",
            name: "Presentation of Diploma",
            desc: "Completed all stories.",
            imag: "http://www.playstationtrophies.org/images/trophies/1942/705.jpg"
        },{
            game: "Sonic The Fighters",
            name: "A Small Transformation",
            desc: "Turn small by being attacked (ie, by Amy's↓+P, etc) in Arcade Mode or Offline Versus",
            imag: "http://www.playstationtrophies.org/images/trophies/1826/4E7.jpg"
        },{
            game: "SOULCALIBUR II HD ONLINE",
            name: "Soul Calibur",
            desc: "Acquired Soul Calibur in Weapon Master",
            imag: "http://www.playstationtrophies.org/images/trophies/2190/4D4.jpg"
        },{
            game: "SoulCalibur V",
            name: "Home is Faraway",
            desc: "Story: cleared final episode.",
            imag: "http://www.playstationtrophies.org/images/trophies/1016/243.jpg"
        },{
            game: "Tekken Tag Tournament 2",
            name: "Behold the Tekken Lord!",
            desc: "You became Tekken Lord in Offline Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/756/F31.jpg"
        },{
            game: "Trinity Universe",
            name: "Be the Shooting Star",
            desc: "Hit Count in a Fury Chain exceeds 700.",
            imag: "http://www.playstationtrophies.org/images/trophies/536/13.jpg"
        },{
            game: "Under Defeat HD: Deluxe Edition",
            name: "STOCKPILING ARMS",
            desc: "SCORE A SPECIFIC AMOUNT OR HIGHER FOR AMMUNITION CONSERVATION",
            imag: "http://www.playstationtrophies.org/images/trophies/1753/0F0.jpg"
        },{
            game: "Virtua Fighter 5 Final Showdown",
            name: "Ten Tests Complete",
            desc: "Complete ten tests in License Challenge Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/1169/8C6.jpg"
        },{
            game: "Ys: Memories of Celceta",
            name: "Better Man",
            desc: "Defeated Duren in one-on-one combat.",
            imag: "http://www.playstationtrophies.org/images/trophies/2412/738.jpg"
        },{
            game: "Disgaea 5: Alliance of Vengeance",
            name: "Gimme a Trophy!",
            desc: "Condition：Pass a bill that gives you a trophy. Yes, you earned it.",
            imag: "http://www.playstationtrophies.org/images/trophies/3928/2ac.jpg"
        },{
            game: "Gal*Gun: Double Peace",
            name: "Pilferer of Panties",
            desc: "Collect All of the Panties From the Changing Room",
            imag: "http://www.playstationtrophies.org/images/trophies/4690/b20.jpg"
        },{
            game: "Megadimension Neptunia VII",
            name: "Ultimate Evolution",
            desc: "Changed into Next Form for the first time.",
            imag: "http://www.playstationtrophies.org/images/trophies/1111/87c.jpg"
        },{
            game: "Senran Kagura: Estival Versus",
            name: "My Waifu",
            desc: "Completed all of Yumi's missions in Shinobi Girl's Heart.",
            imag: "http://www.playstationtrophies.org/images/trophies/3502/d58.jpg"
        },{
            game: "Valkyria Chronicles",
            name: "The Splintered Horn",
            desc: "Obtain the decoration presented to a squad  or team to honor a fallen member. It stands among Gallia's oldest  decorations still issued. ",
            imag: "http://www.playstationtrophies.org/images/trophies/416/8ad.jpg"
        }]
    },{
        listName: "Ggamer15's Don't Lose Your (Custom Trophy List) Way",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_ggamer.png",
        award: "https://i.imgur.com/QPvdxK9.png",
        trophies: [{
            game: "Apotheon",
            name: "Irresistible",
            desc: "Aquire the Cestus of Aphrodite",
            imag: "http://www.playstationtrophies.org/images/trophies/2746/9ee.jpg"
        },{
            game: "Axiom Verge",
            name: "Clone",
            desc: "Defeat one of Athetos' aborted clones.",
            imag: "http://www.playstationtrophies.org/images/trophies/2740/184.jpg"
        },{
            game: "Bastion",
            name: "Pet Sitter",
            desc: "Get four different domesticated creatures in the Bastion.",
            imag: "http://www.playstationtrophies.org/images/trophies/3439/b89.jpg"
        },{
            game: "Bloodborne",
            name: "Honouring Wishes",
            desc: "Captivated by the Moon Presence, you pledge to watch over the Hunter's Dream.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/513.jpg"
        },{
            game: "Broken Age",
            name: "\"What's up with all the feathers?\"",
            desc: "Commission a custom garment",
            imag: "http://www.playstationtrophies.org/images/trophies/3501/1e7.jpg"
        },{
            game: "Entwined",
            name: "Eternity",
            desc: "Finish the Story Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/2834/006.jpg"
        },{
            game: "FEZ",
            name: "Mightier than the sword",
            desc: "Find the Writing Cube artifact.",
            imag: "http://www.playstationtrophies.org/images/trophies/2125/954.jpg"
        },{
            game: "Final Fantasy Type-0",
            name: "Hard Work's Reward",
            desc: "Completed a secret training session.",
            imag: "http://www.playstationtrophies.org/images/trophies/2846/0ed.jpg"
        },{
            game: "Grim Fandango Remastered",
            name: "\"Plus, we look good in these clothes!\"",
            desc: "Talk to Glottis about leaving.",
            imag: "http://www.playstationtrophies.org/images/trophies/2909/58c.jpg"
        },{
            game: "Home",
            name: "Like it never even happened",
            desc: "Pick up nothing along the way.",
            imag: "http://www.playstationtrophies.org/images/trophies/3155/2b6.jpg"
        },{
            game: "Hotline Miami",
            name: "Smell Something Burning",
            desc: "Kill the crapping gangster with a fireaxe",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/23B.jpg"
        },{
            game: "Hotline Miami 2: Wrong Number",
            name: "DON'T LET ANGER GET THE BEST OF YOU",
            desc: "Clear all of the Writer's levels without killing",
            imag: "http://www.playstationtrophies.org/images/trophies/2666/fc9.jpg"
        },{
            game: "inFAMOUS First Light",
            name: "Great Responsibility",
            desc: "50 Hostage Saves",
            imag: "http://www.playstationtrophies.org/images/trophies/2878/332.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "Reconciliation",
            desc: "Finish the story with Good Karma",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/000.jpg"
        },{
            game: "Murdered: Soul Suspect",
            name: "One of Us",
            desc: "Revisited the scene of your murder and discovered there was a witness",
            imag: "http://www.playstationtrophies.org/images/trophies/2525/db1.jpg"
        },{
            game: "Octodad: Dadliest Catch",
            name: "Stay True to Yourself",
            desc: "Sneak to the cafeteria without the use of a disguise.",
            imag: "http://www.playstationtrophies.org/images/trophies/2256/10a.jpg"
        },{
            game: "OlliOlli2: Welcome to Olliwood",
            name: "The First One is the Hardest",
            desc: "Get your first 1,000,000+ combo",
            imag: "http://www.playstationtrophies.org/images/trophies/3398/6f2.jpg"
        },{
            game: "Pillar",
            name: "Great Knowledge and Understanding",
            desc: "Understand the Pillar.",
            imag: "http://www.playstationtrophies.org/images/trophies/3404/272.jpg"
        },{
            game: "Rogue Legacy",
            name: "Barophobia",
            desc: "Use the special class at least once.",
            imag: "http://www.playstationtrophies.org/images/trophies/2870/a01.jpg"
        },{
            game: "Shovel Knight",
            name: "Decked Out",
            desc: "Purchase or unlock all relics, equipment, and upgrades.",
            imag: "http://www.playstationtrophies.org/images/trophies/3440/274.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Fashion Statement",
            desc: "Change all your clothes in your wardrobe or a clothing store.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/AE8.jpg"
        },{
            game: "Sportsfriends",
            name: "Overcoming The Odds",
            desc: "Super Pole Riders - Win a match with maximum \"luck\" handicap",
            imag: "http://www.playstationtrophies.org/images/trophies/2715/830.jpg"
        },{
            game: "Starwhal",
            name: "Die One Thousand Deaths",
            desc: "Die 1000 times in Challenge Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/2743/2b8.jpg"
        },{
            game: "Surgeon Simulator",
            name: "Let's See That Sick Filth Again",
            desc: "Perform a 180° spoon flip.",
            imag: "http://www.playstationtrophies.org/images/trophies/2847/c7e.jpg"
        },{
            game: "The Evil Within",
            name: "One of the Many",
            desc: "Defeat the ultimate evil within.",
            imag: "http://www.playstationtrophies.org/images/trophies/3107/c89.jpg"
        },{
            game: "The Order: 1886",
            name: "Undivided Attention",
            desc: "Kill 25 enemies during Blacksight",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/d77.jpg"
        },{
            game: "Thomas Was Alone",
            name: "A Noble Quest",
            desc: "Find both trophy pickups in 'Iterate'.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/711.jpg"
        },{
            game: "Titan Souls",
            name: "Short Back and Sides",
            desc: "Cut all the vines off the plant Titan",
            imag: "http://www.playstationtrophies.org/images/trophies/2905/077.jpg"
        },{
            game: "Transistor",
            name: "Risk()",
            desc: "Complete five encounters with all 10 Limiters in use.",
            imag: "http://www.playstationtrophies.org/images/trophies/2113/9f4.jpg"
        },{
            game: "White Night",
            name: "The Scent of Blood",
            desc: "Finish Chapter 4",
            imag: "http://www.playstationtrophies.org/images/trophies/3374/e0e.jpg"
        }]
    },{
        listName: "Glenn's Comedy Club of Trophies",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_glenn.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_glenn64.jpg",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Fly Swatter",
            desc: "Kick a Guard while using the Flying Machine.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/23.jpg"
        },{
            game: "Assassin's Creed III",
            name: "Jager Bomb",
            desc: "After becoming fully Notorious, kill 10 Jagers before losing your notoriety.",
            imag: "http://www.playstationtrophies.org/images/trophies/1400/A2A.jpg"
        },{
            game: "Assassin's Creed Syndicate",
            name: "A Spanner in the Works",
            desc: "Complete Memory Sequence 1.",
            imag: "http://www.playstationtrophies.org/images/trophies/3634/496.jpg"
        },{
            game: "Far Cry 3",
            name: "Higher Than a Kite",
            desc: "Use your wingsuit to reach the Southern island.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/16E.jpg"
        },{
            game: "FIFA 15",
            name: "Cool Squad Bro",
            desc: "Copy a Squad from the end of an online match",
            imag: "http://www.playstationtrophies.org/images/trophies/2831/891.jpg"
        },{
            game: "FIFA 16",
            name: "Just a little off the sides",
            desc: "Change your Online Pro haircut",
            imag: "http://www.playstationtrophies.org/images/trophies/3669/9da.jpg"
        },{
            game: "FIFA Street",
            name: "Got any Nutmeg?",
            desc: "Panna your first Opponent",
            imag: "http://www.playstationtrophies.org/images/trophies/1152/804.jpg"
        },{
            game: "Goat Simulator",
            name: "I freaking love goats",
            desc: "Find all collectibles on level 2",
            imag: "http://www.playstationtrophies.org/images/trophies/3795/3f8.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Kifflom!",
            desc: "Complete your path to enlightenment... or not.",
            imag: "http://www.playstationtrophies.org/images/trophies/687/05c.jpg"
        },{
            game: "GRID 2",
            name: "SWAGtastic!",
            desc: "You beat the target time in a Vehicle Challenge.",
            imag: "http://www.playstationtrophies.org/images/trophies/1371/8C7.jpg"
        },{
            game: "Guacamelee!",
            name: "We built this city on Guac and Roll",
            desc: "Discover Santa Luchita",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/5F0.jpg"
        },{
            game: "inFAMOUS",
            name: "Member of the Mineral Club",
            desc: "Find 50% of the Shards",
            imag: "http://www.playstationtrophies.org/images/trophies/122/1.jpg"
        },{
            game: "Iron Man 2",
            name: "Extra Crispy",
            desc: "Defeat 100 enemies with Iron Man's laser.",
            imag: "http://www.playstationtrophies.org/images/trophies/404/30.jpg"
        },{
            game: "James Bond 007: Blood Stone",
            name: "Free Fall",
            desc: "Throw 5 people off balconies",
            imag: "http://www.playstationtrophies.org/images/trophies/666/18.jpg"
        },{
            game: "L.A. Noire",
            name: "Keep A Lid On",
            desc: "Complete a brawl without losing your hat as an LAPD Detective or Investigator.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/37.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Sticky Fingers",
            desc: "Collect 50% of the prize bubbles on the story levels",
            imag: "http://www.playstationtrophies.org/images/trophies/14/13.jpg"
        },{
            game: "Mafia II",
            name: "Get Rich or Die Flyin'",
            desc: "Get all wheels of your car into the air for at least 20 meters and then touch the ground again.",
            imag: "http://www.playstationtrophies.org/images/trophies/351/25.jpg"
        },{
            game: "Men in Black: Alien Crisis",
            name: "Smile for the Camera!",
            desc: "Neuralize 7 humans in Story Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/1220/4FF.jpg"
        },{
            game: "Midnight Club: Los Angeles",
            name: "Streaker",
            desc: "Win 5 races in a row offline.",
            imag: "http://www.playstationtrophies.org/images/trophies/34/001.jpg"
        },{
            game: "Motorstorm RC",
            name: "Ghost Busted",
            desc: "Beat a friend's ghost in a Race or Hot Lap event who currently sits above you in the leaderboards.",
            imag: "http://www.playstationtrophies.org/images/trophies/1301/07.jpg"
        },{
            game: "Rayman Origins",
            name: "Kung Fu Combo!",
            desc: "Perform a swipe-to-air Kick Combo!",
            imag: "http://www.playstationtrophies.org/images/trophies/1381/31.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Austin Overpowered",
            desc: "Complete Twin Rocks, Pike's Basin, and Gaptooth Breach Hideouts in Single Player.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/13.jpg"
        },{
            game: "Shift 2: Unleashed",
            name: "Nailed It",
            desc: "Track Mastered your first location",
            imag: "http://www.playstationtrophies.org/images/trophies/696/27.jpg"
        },{
            game: "Sleeping Dogs",
            name: "A Slap in the Face",
            desc: "Kill someone with a fish.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/0EB.jpg"
        },{
            game: "Sly 3: Honor Among Thieves",
            name: "Everyone needs a foxy lady",
            desc: "Carmelita to the rescue again",
            imag: "http://www.playstationtrophies.org/images/trophies/797/18.jpg"
        },{
            game: "Split/Second",
            name: "Untouchable (ss)",
            desc: "Win a Race event without crashing.",
            imag: "http://www.playstationtrophies.org/images/trophies/393/12.jpg"
        },{
            game: "Table Top Racing: World Tour",
            name: "Prof. Of Pimpology!",
            desc: "Fully upgrade all Supercars",
            imag: "http://www.playstationtrophies.org/images/trophies/3129/649.jpg"
        },{
            game: "The Sims 3",
            name: "Graduated",
            desc: "Complete the in-game tutorial.",
            imag: "http://www.playstationtrophies.org/images/trophies/544/03.jpg"
        },{
            game: "The Walking Dead",
            name: "You Fight Like A Dairy Farmer",
            desc: "Complete chapter 7 of episode 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/18C.jpg"
        },{
            game: "Thomas Was Alone",
            name: "Three Amigos",
            desc: "Find both trophy pickups in 'Array'.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/BB2.jpg"
        },{
            game: "Tomb Raider: Legend",
            name: "Biggest Bang for the Buck",
            desc: "Blow up 2 mercenaries with 1 propane tank while riding the motorcycle",
            imag: "http://www.playstationtrophies.org/images/trophies/856/13.jpg"
        },{
            game: "Tomb Raider",
            name: "Tastes Like Chicken!",
            desc: "Kill and loot 10 small animals (rabbits, chickens, rats).",
            imag: "http://www.playstationtrophies.org/images/trophies/831/CE8.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Pro-Pain",
            desc: "Defeat 10 enemies with propane or acetylene tank explosions",
            imag: "http://www.ps3trophies.org/images/trophies/373/33.jpg"
        },{
            game: "Uncharted 4: A Thief's End",
            name: "Don't Feed the Animals",
            desc: "Play with the lemur in the market and let it steal your apple",
            imag: "http://www.playstationtrophies.org/images/trophies/2388/e6e.jpg"
        },{
            game: "Uncharted: Golden Abyss",
            name: "Touch My Rear",
            desc: "Use the rear touch pad to climb a rope or chain.",
            imag: "http://www.ps3trophies.org/images/trophies/1092/54.jpg"
        }]
    },{
        listName: "Gotta Beat The Noid's List",
        banner: "http://i.imgur.com/tztFrfm.png",
        award: "http://i.imgur.com/YRCmDDt.png",
        trophies: [{
            game: "Another World",
            name: "The End",
            desc: "To another world...",
            imag: "http://www.playstationtrophies.org/images/trophies/2819/f98.jpg"
        },{
            game: "Astebreed",
            name: "TO ALTER REALITY",
            desc: "Cleared the game on the Easy Difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/3485/565.jpg"
        },{
            game: "Bloodborne",
            name: "Yharnam Sunrise",
            desc: "You lived through the hunt, and saw another day.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/4cb.jpg"
        },{
            game: "Call of Duty: Advanced Warfare",
            name: "A New Era",
            desc: "Complete the campaign on any difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/8b5.jpg"
        },{
            game: "Call of Duty: Ghosts",
            name: "The Ghost Killer",
            desc: "Confront Rorke (Complete \"The Ghost Killer\" on any difficulty.)",
            imag: "http://www.playstationtrophies.org/images/trophies/2237/150.jpg"
        },{
            game: "Contrast",
            name: "FIN",
            desc: "Unlocks when the player completes the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/2114/04.jpg"
        },{
            game: "Entwined",
            name: "Eternity",
            desc: "Finish the Story Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/2834/006.jpg"
        },{
            game: "Far Cry 4",
            name: "The King Is Dead",
            desc: "Decide Pagan Min's fate (Campaign only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2777/a07.jpg"
        },{
            game: "Hatoful Boyfriend",
            name: "While it lasts",
            desc: "Get Ryouta ending (ED no.01)",
            imag: "http://www.playstationtrophies.org/images/trophies/3230/9a7.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "Unstoppable (i)",
            desc: "Finish the game on Expert difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/3db.jpg"
        },{
            game: "Jamestown+",
            name: "P(e)acemaker",
            desc: "Pacify the Heart of Mars.",
            imag: "http://www.playstationtrophies.org/images/trophies/2742/422.jpg"
        },{
            game: "Killzone: Shadow Fall",
            name: "The Savior",
            desc: "Complete level 'The Savior' and prevent the escalation of a new war",
            imag: "http://www.playstationtrophies.org/images/trophies/1931/13.jpg"
        },{
            game: "Metal Gear Solid V: Ground Zeroes",
            name: "Accomplished",
            desc: "Clear all missions (including Side Ops and Extra Ops)",
            imag: "http://www.playstationtrophies.org/images/trophies/1287/a0b.jpg"
        },{
            game: "Octodad: Dadliest Catch",
            name: "World's Best Dad (o)",
            desc: "Beat the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/2256/e7a.jpg"
        },{
            game: "Outlast",
            name: "PUNISHED",
            desc: "Finish the game",
            imag: "http://www.playstationtrophies.org/images/trophies/2122/186.jpg"
        },{
            game: "Slender: The Arrival",
            name: "I'm Free!",
            desc: "Beat the game on normal difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/3496/fb4.jpg"
        },{
            game: "Sound Shapes",
            name: "Campaign Complete",
            desc: "Complete all Campaign levels.",
            imag: "http://www.playstationtrophies.org/images/trophies/2381/9CC.jpg"
        },{
            game: "Strider",
            name: "Class-A Ninja",
            desc: "Complete game on Normal difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/2548/2ED.jpg"
        },{
            game: "Strike Suit Zero",
            name: "Save Earth",
            desc: "Reach the end of the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/1147/643.jpg"
        },{
            game: "Super Motherload",
            name: "Destroyer of Worlds",
            desc: "Destroy Mars and Earth simultaneously by your cowardly inaction.",
            imag: "http://www.playstationtrophies.org/images/trophies/2383/04.jpg"
        },{
            game: "The Evil Within",
            name: "First Step into Darkness",
            desc: "Complete the game on Casual difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/3107/7ff.jpg"
        },{
            game: "The Last of Us",
            name: "No Matter What - Easy",
            desc: "Easy - Complete the game on Easy",
            imag: "http://www.playstationtrophies.org/images/trophies/2670/5d6.jpg"
        },{
            game: "The Swindle",
            name: "Stolen Time",
            desc: "Complete the game within the 100 day limit",
            imag: "http://www.playstationtrophies.org/images/trophies/3401/74e.jpg"
        },{
            game: "The Walking Dead",
            name: "What Remains",
            desc: "Complete Episode 5: \"No Time Left\"",
            imag: "http://www.playstationtrophies.org/images/trophies/3111/5ae.jpg"
        },{
            game: "The Wolf Among Us",
            name: "Happily Ever After (w)",
            desc: "Completed Episode 5: \"Cry Wolf\"",
            imag: "http://www.playstationtrophies.org/images/trophies/3099/d83.jpg"
        },{
            game: "Tiny Brains",
            name: "Intelligence Level: Tolstoi",
            desc: "Defeat the final boss in Tiny Story mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2382/a07.jpg"
        },{
            game: "Titan Attacks!",
            name: "TITAN",
            desc: "Completed the Titan levels",
            imag: "http://www.playstationtrophies.org/images/trophies/2713/b72.jpg"
        },{
            game: "Ultratron",
            name: "Letum",
            desc: "Defeated Letum",
            imag: "http://www.playstationtrophies.org/images/trophies/3622/5eb.jpg"
        },{
            game: "Wolfenstein: The New Order",
            name: "Liberation",
            desc: "Complete game on any difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/2041/e0f.jpg"
        },{
            game: "Wolfenstein: The Old Blood",
            name: "Hero",
            desc: "Complete game on any difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/3447/34b.jpg"
        }]
    },{
        listName: "Harry's \"Bestest of Friends\"",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_harry.png",
        award: "http://i.imgur.com/4E4mP4k.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "An Old Friend Returns",
            desc: "Escape the hideout.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/19.jpg"
        },{
            game: "Back to the Future: The Game",
            name: "Hello, Young Friend",
            desc: "Talked Emmett into completing the Rocket Drill",
            imag: "http://www.playstationtrophies.org/images/trophies/1245/08.jpg"
        },{
            game: "Burnout Paradise",
            name: "Invite a friend to join you in Paradise City",
            desc: "Awarded for sending an online game invite to another player",
            imag: "http://www.playstationtrophies.org/images/trophies/1/039.jpg"
        },{
            game: "Buzz! Junior: RoboJam",
            name: "Feathered Friend",
            desc: "Score a minimum of 2500 points in single player mode in Pillow Fight.",
            imag: "http://www.playstationtrophies.org/images/trophies/136/07.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "Making Friends",
            desc: "Reactivated all of the Sink's robotic assistants.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/63.jpg"
        },{
            game: "Family Guy: Back To The Multiverse",
            name: "Help From My Friends",
            desc: "Use the collectible special inventory items 25 times in Story Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/1532/126.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "Pool Shark",
            desc: "You beat a friend at pool.",
            imag: "http://www.playstationtrophies.org/images/trophies/33/003.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "A Friendship Resurrected",
            desc: "With friends like this who needs enemies?",
            imag: "http://www.playstationtrophies.org/images/trophies/3057/7b4.jpg"
        },{
            game: "Hannah Montana The Movie",
            name: "Bullseye",
            desc: "Play the Horse Races game at the Fair with three of your friends.",
            imag: "http://www.playstationtrophies.org/images/trophies/121/012.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Good Friends",
            desc: "The Park - Play two games with Shaun successfully and buy him candy",
            imag: "http://www.playstationtrophies.org/images/trophies/321/08.jpg"
        },{
            game: "Hotline Miami",
            name: "I Got New Friends",
            desc: "Unlock All Weapons",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/4F4.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Friendly",
            desc: "Complete a level with more than one player",
            imag: "http://www.playstationtrophies.org/images/trophies/14/19.jpg"
        },{
            game: "Max Payne 3",
            name: "Dearest of all my friends",
            desc: "Kill somebody on your friends list",
            imag: "http://www.playstationtrophies.org/images/trophies/353/05C.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Friend of the People",
            desc: "Complete Arcade Mode with Toro",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/C00.jpg"
        },{
            game: "Ratchet & Clank: All 4 One",
            name: "Friendship through Firepower",
            desc: "Buy your first weapon.",
            imag: "http://www.playstationtrophies.org/images/trophies/704/33.jpg"
        },{
            game: "Ratchet & Clank 3: Up Your Arsenal",
            name: "Friend of the Rangers",
            desc: "Complete every battle mission",
            imag: "http://www.playstationtrophies.org/images/trophies/2901/efb.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Friends in High Places",
            desc: "Use a pardon letter with more than $5000 bounty in Single Player.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/32.jpg"
        },{
            game: "Resident Evil 5",
            name: "A Friend in Need",
            desc: "Save partner 10 times when HELP is displayed.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/028.jpg"
        },{
            game: "Saints Row IV",
            name: "Friend of the Raptors",
            desc: "Complete all Five Missions",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/57.jpg"
        },{
            game: "Sam & Max: The Devil's Playhouse - Episode 4: Beyond the Alley of the Dolls",
            name: "Tell 'Em Penn Says Hi",
            desc: "Impressed friends with card trick",
            imag: "http://www.playstationtrophies.org/images/trophies/659/06.jpg"
        },{
            game: "Sniper Elite III",
            name: "Sniping with friends",
            desc: "Complete the campaign in co-op",
            imag: "http://www.playstationtrophies.org/images/trophies/2303/026.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "More Popular Than John Lennon",
            desc: "Everyone in South Park is your friend.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/34F.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "Friendly Fire",
            desc: "Show Mercy",
            imag: "http://www.playstationtrophies.org/images/trophies/613/111.jpg"
        },{
            game: "Sportsfriends",
            name: "Musicfriends",
            desc: "J.S. Joust - Start a game with the secret Sportsfriends music option",
            imag: "http://www.playstationtrophies.org/images/trophies/2715/0f1.jpg"
        },{
            game: "Tales from Space: Mutant Blobs Attack",
            name: "Blob Friends Forever",
            desc: "Collect all Blob Friends in the game",
            imag: "http://www.playstationtrophies.org/images/trophies/1401/13.jpg"
        },{
            game: "Tekken Tag Tournament 2",
            name: "The Best of Friends",
            desc: "You pulled off 3 partner-specific Tag Throws.",
            imag: "http://www.playstationtrophies.org/images/trophies/756/549.jpg"
        },{
            game: "The Evil Within",
            name: "My Best Friend",
            desc: "Completely upgrade one weapon.",
            imag: "http://www.playstationtrophies.org/images/trophies/3107/e99.jpg"
        },{
            game: "The Last of Us: Left Behind",
            name: "BFFs",
            desc: "All optional conversations found in Left Behind",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/c81.jpg"
        },{
            game: "The Walking Dead",
            name: "Reunited",
            desc: "Found an old friend.",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/49.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Old Friends",
            desc: "Made it to the ski lodge.",
            imag: "http://www.playstationtrophies.org/images/trophies/2352/14.jpg"
        }]
    },{
        listName: "Irvine's Idyllic Inventory of Trophies",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_irvine.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_irvine64.png",
        trophies: [{
            game: "Back to the Future: The Game",
            name: "Back In Time",
            desc: "Traveled back in time to rescue Doc.",
            imag: "http://www.playstationtrophies.org/images/trophies/591/02.jpg"
        },{
            game: "BioShock 2",
            name: "Grand Daddy",
            desc: "Defeated 3 Big Daddies without dying during the fight.",
            imag: "http://www.playstationtrophies.org/images/trophies/309/28.jpg"
        },{
            game: "Brink",
            name: "Not over till the fat lady sings!",
            desc: "Take down an enemy with gunfire while knocked down",
            imag: "http://www.playstationtrophies.org/images/trophies/356/14.jpg"
        },{
            game: "Call of Duty Classic",
            name: "War Hero",
            desc: "Complete the game on Veteran difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/277/31.jpg"
        },{
            game: "Call of Duty: World at War",
            name: "For the Motherland",
            desc: "Complete 'Heart of the Reich' on Veteran difficulty. (Solo only)",
            imag: "http://www.playstationtrophies.org/images/trophies/41/014.jpg"
        },{
            game: "Dead Rising 2",
            name: "Zombie Genocide Master",
            desc: "Kill 72,000 zombies",
            imag: "http://www.playstationtrophies.org/images/trophies/325/04.jpg"
        },{
            game: "Dead Space",
            name: "There's Always Peng",
            desc: "Find the Peng Treasure",
            imag: "http://www.playstationtrophies.org/images/trophies/26/047.jpg"
        },{
            game: "Duke Nukem Forever",
            name: "Balls of Steel",
            desc: "Earn a 1,000,000 pinball score in SP",
            imag: "http://www.playstationtrophies.org/images/trophies/730/30.jpg"
        },{
            game: "EA Sports UFC",
            name: "It's Showtime!",
            desc: "KO an opponent via cage kick",
            imag: "http://www.playstationtrophies.org/images/trophies/2094/b3c.jpg"
        },{
            game: "Eat Lead: The Return of Matt Hazard",
            name: "Pure Energy",
            desc: "Kill 50 enemies with the Energy Pistol. 'Blaster? I hardly know 'er!'",
            imag: "http://www.playstationtrophies.org/images/trophies/93/042.jpg"
        },{
            game: "Far Cry 3",
            name: "Say Hi to the Internet",
            desc: "Find the lost Hollywood star.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/00F.jpg"
        },{
            game: "FIFA 14",
            name: "No Goal For You!",
            desc: "Perform a Diving Header Clearance",
            imag: "http://www.playstationtrophies.org/images/trophies/1854/EA4.jpg"
        },{
            game: "FIFA Street",
            name: "Street Legend",
            desc: "Defeat Messi in a street challenge game",
            imag: "http://www.playstationtrophies.org/images/trophies/1152/396.jpg"
        },{
            game: "Guacamelee!",
            name: "That was Hard Mode?",
            desc: "Defeat the game on Hard mode",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/0A3.jpg"
        },{
            game: "Hotline Miami",
            name: "Get A Life",
            desc: "Get A+ on all the chapters",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/CBA.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy",
            name: "The Super Orberator",
            desc: "Collect 2000 Precursor Orbs",
            imag: "http://www.playstationtrophies.org/images/trophies/1217/992.jpg"
        },{
            game: "Jetpack Joyride",
            name: "Romeo Alpha Delta",
            desc: "Fly over 5kms",
            imag: "http://www.playstationtrophies.org/images/trophies/1819/C8B.jpg"
        },{
            game: "LEGO Harry Potter: Years 1-4",
            name: "Quiet Please!",
            desc: "Turn the sound and music down to 0 in the options menu whilst in the library",
            imag: "http://www.playstationtrophies.org/images/trophies/331/33.jpg"
        },{
            game: "LEGO Marvel Super Heroes",
            name: "Avengers Assembled",
            desc: "Collect all Avengers characters in the game (Single Player)",
            imag: "http://www.playstationtrophies.org/images/trophies/1875/E0F.jpg"
        },{
            game: "LittleBigPlanet 2",
            name: "Aces in Spades",
            desc: "Ace 10 different Story levels in a row",
            imag: "http://www.playstationtrophies.org/images/trophies/533/09.jpg"
        },{
            game: "Mirror's Edge",
            name: "aaaand safe!",
            desc: "String together the following: wallrun, jump, coil (over obstacle), skill roll",
            imag: "http://www.playstationtrophies.org/images/trophies/43/035.jpg"
        },{
            game: "NCIS",
            name: "Hey, I'm a hacker.",
            desc: "Complete first database search",
            imag: "http://www.playstationtrophies.org/images/trophies/1253/03.jpg"
        },{
            game: "Need for Speed: Most Wanted",
            name: "Fast Forward",
            desc: "Trigger a speed camera at over 200mph (321.97km/h)",
            imag: "http://www.playstationtrophies.org/images/trophies/1579/EB1.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Mr. Bubbles",
            desc: "Complete Arcade Mode with Big Daddy",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/CC2.jpg"
        },{
            game: "Prison Break",
            name: "Invisible",
            desc: "Complete every chapter without being seen.",
            imag: "http://www.playstationtrophies.org/images/trophies/403/43.jpg"
        },{
            game: "Saints Row IV",
            name: "Zoo Keeper",
            desc: "Kill 25 Wardens.",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/7E3.jpg"
        },{
            game: "Sniper Elite V2",
            name: "Deadeye (s)",
            desc: "Snipe an enemy through his eye",
            imag: "http://www.playstationtrophies.org/images/trophies/988/360.jpg"
        },{
            game: "The Cave",
            name: "Win-win-win-win-win-win-win",
            desc: "Everyone reached the bottom.",
            imag: "http://www.playstationtrophies.org/images/trophies/1554/EC2.jpg"
        },{
            game: "The Saboteur",
            name: "Trick or Treat",
            desc: "You stealth killed a Nazi General while disguised.",
            imag: "http://www.playstationtrophies.org/images/trophies/298/43.jpg"
        },{
            game: "X-Men Origins: Wolverine",
            name: "Found!",
            desc: "You found a mysterious hatch!",
            imag: "http://www.playstationtrophies.org/images/trophies/113/039.jpg"
        },{
            game: "EA UFC 2",
            name: "Throw It On The Ground",
            desc: "Knockout your opponent with a slam.",
            imag: "http://www.playstationtrophies.org/images/trophies/4115/69f.jpg"
        },{
            game: "FIFA 16",
            name: "It's a Lottery",
            desc: "Win a penalty shoot-out",
            imag: "http://www.playstationtrophies.org/images/trophies/3669/4a7.jpg"
        },{
            game: "Until Dawn",
            name: "Scream Too!",
            desc: "Mike cut off his fingers to free himself from the bear trap",
            imag: "http://www.playstationtrophies.org/images/trophies/1672/a33.jpg"
        },{
            game: "The Order: 1886",
            name: "Brilliant!",
            desc: "Shoot an airborne grenade during Blacksight",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/89e.jpg"
        },{
            game: "Rocket League",
            name: "Far, Far Away...",
            desc: "Drive a total of 50 km",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/a34.jpg"
        }]
    },{
        listName: "Kinjall's Travel Journal",
        banner: "http://i.imgur.com/zfSdLEe.png",
        award: "http://i.imgur.com/hHYWD1e.png",
        trophies: [{
            game: "3D Dot Game Heroes",
            name: "Have a Nice Night?",
            desc: "Spent the night in Raejack with the princess.",
            imag: "http://www.playstationtrophies.org/images/trophies/573/253.jpg"
        },{
            game: "Alice: Madness Returns",
            name: "Eyes on the Size",
            desc: "Find the hidden Shrink Sense Decal",
            imag: "http://www.playstationtrophies.org/images/trophies/671/38.jpg"
        },{
            game: "Assassin's Creed IV Black Flag",
            name: "Seven Deadly Seas",
            desc: "Explore all underwater shipwrecks.",
            imag: "http://www.playstationtrophies.org/images/trophies/2233/90e.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Crocodile Tears",
            desc: "Venture into Killer Croc's lair and come out alive",
            imag: "http://www.playstationtrophies.org/images/trophies/192/14.jpg"
        },{
            game: "Bayonetta",
            name: "The Path To The Heavens",
            desc: "Discover all Alfheim portals.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/44.jpg"
        },{
            game: "Beyond: Two Souls",
            name: "Revenge",
            desc: "Taught 3 or more of the teens a lesson, or started the house fire, with Aiden.",
            imag: "http://www.playstationtrophies.org/images/trophies/1585/740.jpg"
        },{
            game: "BioShock",
            name: "Prolific Photographer",
            desc: "Take at least one photo in every research group",
            imag: "http://www.playstationtrophies.org/images/trophies/23/28.jpg"
        },{
            game: "Danganronpa: Trigger Happy Havoc",
            name: "Hope's Peak Confidential",
            desc: "Filled in every page of Kyoko's Report Card",
            imag: "http://www.playstationtrophies.org/images/trophies/2542/D9A.jpg"
        },{
            game: "Dishonored",
            name: "Well Mannered",
            desc: "You completed the Boyle Estate mission without spoiling the party",
            imag: "http://www.playstationtrophies.org/images/trophies/3718/3e5.jpg"
        },{
            game: "God of War",
            name: "Splash",
            desc: "Kiss the Nyad",
            imag: "http://www.playstationtrophies.org/images/trophies/263/1.jpg"
        },{
            game: "Gravity Rush",
            name: "Lost in Time and Space",
            desc: "Heard the mysterious couple's complete story.",
            imag: "http://www.playstationtrophies.org/images/trophies/1392/37.jpg"
        },{
            game: "Guacamelee!",
            name: "That's one big Gato Frito",
            desc: "Kill the Alebrije",
            imag: "http://www.playstationtrophies.org/images/trophies/2475/ede.jpg"
        },{
            game: "Hotline Miami",
            name: "Smell Something Burning",
            desc: "Kill the crapping gangster with a fireaxe",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/23B.jpg"
        },{
            game: "ICO",
            name: "Spiked Club",
            desc: "Acquire spiked club",
            imag: "http://www.playstationtrophies.org/images/trophies/749/11.jpg"
        },{
            game: "Journey",
            name: "Adventure",
            desc: "Pass through 15 gates while surfing through the sunken city.",
            imag: "http://www.playstationtrophies.org/images/trophies/3570/690.jpg"
        },{
            game: "Life Is Strange",
            name: "Shutterbug",
            desc: "Take all optional photos in Episode 4: Dark Room",
            imag: "http://www.playstationtrophies.org/images/trophies/2971/b9b.jpg"
        },{
            game: "LittleBigPlanet",
            name: " Incredible Height!",
            desc: "Travel to an incredible height",
            imag: "http://www.playstationtrophies.org/images/trophies/14/18.jpg"
        },{
            game: "Mirror's Edge",
            name: "Hey, it's-a-me!",
            desc: "Execute a stomp move on an enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/43/044.jpg"
        },{
            game: "Muramasa Rebirth",
            name: "From the Depths of R'lyeh",
            desc: "Defeat the Sea Monster",
            imag: "http://www.playstationtrophies.org/images/trophies/2057/923.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Fly the Friendlier Skies",
            desc: "Awarded for befriending Tengri.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/827.jpg"
        },{
            game: "NIER",
            name: "Key Collector",
            desc: "You unlocked the key to the Shadowlord's castle.",
            imag: "http://www.playstationtrophies.org/images/trophies/379/06.jpg"
        },{
            game: "Okami HD",
            name: "Dragonian Dilemma",
            desc: "Meet Otohime.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/8D1.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Fightin' Around the World",
            desc: "Knock someone out in melee in every saloon in the game in Single Player.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/16.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Canadian Handshake",
            desc: "You've farted on people 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/34E.jpg"
        },{
            game: "Super Time Force Ultra",
            name: "They Are Looking",
            desc: "This ones totally a secret but you'll know it when you see it so hustle and look sharp",
            imag: "http://www.playstationtrophies.org/images/trophies/3566/d9f.jpg"
        },{
            game: "Tearaway",
            name: "Globe Trotter",
            desc: "Take a photo in each chapter",
            imag: "http://www.playstationtrophies.org/images/trophies/1674/F2C.jpg"
        },{
            game: "The Banner Saga",
            name: "Diplomat",
            desc: "Get permission to destroy a varl landmark.",
            imag: "http://www.playstationtrophies.org/images/trophies/4306/f9c.jpg"
        },{
            game: "Skyrim",
            name: "Explorer (s)",
            desc: "Discover 100 Locations",
            imag: "http://www.playstationtrophies.org/images/trophies/826/40.jpg"
        },{
            game: "The Last of Us",
            name: "Master of Unlocking",
            desc: "Unlock all shiv doors",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/0B9.jpg"
        },{
            game: "Transistor",
            name: "Bracket()",
            desc: "Confront Royce beyond Cloudbank.",
            imag: "http://www.playstationtrophies.org/images/trophies/2113/e42.jpg"
        }]
    },{
        listName: "Krid's Korrupt Kollection",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_krid.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_krid64.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Red Light Addict",
            desc: "Spend 5000 florins on Courtesans.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/49.jpg"
        },{
            game: "Bayonetta",
            name: "Angel Slayer",
            desc: "Complete all Alfheim portals.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/46.jpg"
        },{
            game: "Back to the Future: The Game",
            name: "Seven Minutes in Heaven",
            desc: "Got caught making out with Jennifer.",
            imag: "http://www.playstationtrophies.org/images/trophies/840/04.jpg"
        },{
            game: "BioShock",
            name: "Toaster in the Tub",
            desc: "The player has shocked an enemy in the water",
            imag: "http://www.playstationtrophies.org/images/trophies/23/48.jpg"
        },{
            game: "Braid",
            name: "Full Speed Run",
            desc: "Did some kind of speed run through the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/279/12.jpg"
        },{
            game: "Call of Duty: World at War",
            name: "For the Motherland",
            desc: "Complete 'Heart of the Reich' on Veteran difficulty. (Solo only)",
            imag: "http://www.playstationtrophies.org/images/trophies/41/014.jpg"
        },{
            game: "Dead Space",
            name: "Butcher (d)",
            desc: "Dismember 1000 Limbs",
            imag: "http://www.playstationtrophies.org/images/trophies/26/029.jpg"
        },{
            game: "Devil May Cry HD",
            name: "The Devil Made Me Do It",
            desc: "Finish the game without using any Yellow Orbs",
            imag: "http://www.playstationtrophies.org/images/trophies/1223/F69.jpg"
        },{
            game: "F1 2010",
            name: "Schuperb",
            desc: "In single player you've beaten Michael Schumacher's record of 40 wins from Pole Position",
            imag: "http://www.playstationtrophies.org/images/trophies/438/27.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "Murder Nature",
            desc: "Kill all the Animal Types",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/8B7.jpg"
        },{
            game: "Final Fantasy X HD",
            name: "Perseverance",
            desc: "Defeat Penance",
            imag: "http://www.playstationtrophies.org/images/trophies/1184/d77.jpg"
        },{
            game: "God of War",
            name: "God Killer",
            desc: "Kill Ares",
            imag: "http://www.playstationtrophies.org/images/trophies/263/2.jpg"
        },{
            game: "God of War: Chains of Olympus",
            name: "Two Girls One Spartan",
            desc: "Entertain the Persian harem",
            imag: "http://www.playstationtrophies.org/images/trophies/1068/12.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Perfect Crime",
            desc: "Clean Manfred's shop of evidence + Let Lauren, Hassan and Kramer die + Kill Madison and Jayden",
            imag: "http://www.playstationtrophies.org/images/trophies/321/56.jpg"
        },{
            game: "Hitman 2: Silent Assassin",
            name: "Call the caddy",
            desc: "Kill 18 people using the golf club",
            imag: "http://www.playstationtrophies.org/images/trophies/1770/423.jpg"
        },{
            game: "Jurassic Park: The Intruder",
            name: "World's Best Dad (j)",
            desc: "Say things to Jess that no parent should ever say.",
            imag: "http://www.playstationtrophies.org/images/trophies/590/960.jpg"
        },{
            game: "LEGO Harry Potter: Years 1-4",
            name: "Role Reversal",
            desc: "Defeat Harry (as Voldemort), in the Graveyard",
            imag: "http://www.playstationtrophies.org/images/trophies/331/32.jpg"
        },{
            game: "LEGO The Lord of the Rings",
            name: "One does not simply...",
            desc: "Walk into Mordor.",
            imag: "http://www.playstationtrophies.org/images/trophies/1535/D5E.jpg"
        },{
            game: "Limbo",
            name: "No Point in Dying",
            desc: "Complete the game in one sitting with five or less deaths",
            imag: "http://www.playstationtrophies.org/images/trophies/1119/12.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "Black Celebration",
            desc: "Poison a Captain at his own Feast.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/af1.jpg"
        },{
            game: "Portal 2",
            name: "Empty Gesture",
            desc: "Drop your co-op partner in goo while they are gesturing by removing the bridge under them",
            imag: "http://www.playstationtrophies.org/images/trophies/610/40.jpg"
        },{
            game: "Prince of Persia The Forgotten Sands",
            name: "This is Persia!",
            desc: "Kick 20 enemies off of ledges.",
            imag: "http://www.playstationtrophies.org/images/trophies/360/02.jpg"
        },{
            game: "Ratchet & Clank",
            name: "Vandal",
            desc: "Destroy all streetlights in Oltanis",
            imag: "http://www.playstationtrophies.org/images/trophies/1436/6E5.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Manifest Destiny",
            desc: "Kill the last buffalo in the Great Plains in Single Player.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/21.jpg"
        },{
            game: "RESOGUN",
            name: "I came in like a Resogun",
            desc: "Accumulate a total Wrecking combo of 1,000 in Demolition mode",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/47.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Perverted",
            desc: "You watched your parents have sex for 60 seconds.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/543.jpg"
        },{
            game: "Star Wars: The Force Unleashed",
            name: "\"I'm Not Your Father, But...\"",
            desc: "Take Luke to school",
            imag: "http://www.playstationtrophies.org/images/trophies/195/65.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
                name: "Sith Kicker",
                desc: "Drop kick 10 Ewoks.",
                imag: "http://www.playstationtrophies.org/images/trophies/397/55.jpg"
        },{
            game: "The Cave",
                name: "Corruption",
                desc: "Saw the darkness in all our hearts.",
                imag: "http://www.playstationtrophies.org/images/trophies/1554/000.jpg"
        },{
            game: "Valiant Hearts: The Great War",
                name: "King of the hill 145",
                desc: "Shoot the German flag with the cannon at Vimy's ridge",
                imag: "http://www.playstationtrophies.org/images/trophies/2756/79a.jpg"
        }]
    },{
        listName: "Lab's \"Did Someone Say Chimichanga?\" List",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_lab.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_labartu64.png",
        trophies: [{
            game: "Assassin's Creed IV Black Flag",
            name: "Hungover",
            desc: "Wake up in a haystack.",
            imag: "http://www.playstationtrophies.org/images/trophies/2233/866.jpg"
        },{
            game: "Assassin's Creed Syndicate",
            name: "WHAT IS WRONG WITH YOU",
            desc: "Flip five vehicles by shooting their horses.",
            imag: "http://www.playstationtrophies.org/images/trophies/3634/351.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Freakshow Rodeo",
            desc: "Ride Titan henchman and knock down 10 thugs (any play mode)",
            imag: "http://www.playstationtrophies.org/images/trophies/192/30.jpg"
        },{
            game: "Bayonetta",
            name: "Angel May Cry",
            desc: "Complete half of all Alfheim portals.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/45.jpg"
        },{
            game: "Borderlands 2",
            name: "Well That Was Easy",
            desc: "Completed the mission \"Shoot This Guy in the Face\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/CCB.jpg"
        },{
            game: "Bully",
            name: "Eggsellent!",
            desc: "Egg 25 cars.",
            imag: "http://www.playstationtrophies.org/images/trophies/4480/90a.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Look Ma Two Hands",
            desc: "Kill 10 enemies in a row using akimbo weapons in Single Player or Special Ops.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/49.jpg"
        },{
            game: "Catherine",
            name: "I Can Fly!",
            desc: "Jump on a Spring Block 3 times in a row. (Golden Playhouse)",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/32.jpg"
        },{
            game: "Darksiders",
            name: "Who's Counting?",
            desc: "Defeat more angels than Ulthane",
            imag: "http://www.playstationtrophies.org/images/trophies/276/13.jpg"
        },{
            game: "Deadpool",
            name: "HEEEEY YOOOOO GUYYYYYSSSS!",
            desc: "Take no damage on the waterslide",
            imag: "http://www.playstationtrophies.org/images/trophies/1641/F5E.jpg"
        },{
            game: "Dead to Rights: Retribution",
            name: "Scrotality",
            desc: "Perform a Shadow groin takedown",
            imag: "http://www.playstationtrophies.org/images/trophies/376/33.jpg"
        },{
            game: "ENSLAVED: Odyssey to the West",
            name: "Bad Doggy",
            desc: "Rescue Trip from the Dog in less than 36 seconds.",
            imag: "http://www.playstationtrophies.org/images/trophies/488/22.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "Just the Tip",
            desc: "Kill a Dragon with the Bow",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/AFD.jpg"
        },{
            game: "Fuse",
            name: "Bro Code Violation",
            desc: "Perform a stealth takedown on the Raven soldier at the urinal.",
            imag: "http://www.playstationtrophies.org/images/trophies/1066/D19.jpg"
        },{
            game: "God of War II",
            name: "You Know the Germans Make Good Stuff...",
            desc: "Collect all Uber Chests",
            imag: "http://www.playstationtrophies.org/images/trophies/264/3.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Out of Your Depth",
            desc: "You're gonna need a bigger boat...",
            imag: "http://www.playstationtrophies.org/images/trophies/687/0bc.jpg"
        },{
            game: "Guacamelee!",
            name: "Delicious",
            desc: "Complete the World's Greatest Enchilada quest",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/DDE.jpg"
        },{
            game: "Mass Effect 2",
            name: "Insanity",
            desc: "Complete the game in the 'Insanity' difficulty level without changing the setting",
            imag: "http://www.playstationtrophies.org/images/trophies/703/28.jpg"
        },{
            game: "Mirror's Edge",
            name: "Sweet goodbye",
            desc: "Triggered the flip-off move",
            imag: "http://www.playstationtrophies.org/images/trophies/43/043.jpg"
        },{
            game: "Mirror's Edge Catalyst",
            name: "Five Finger Discount",
            desc: "Remove 10 electronic parts from Conglomerate terminals",
            imag: "http://www.playstationtrophies.org/images/trophies/2098/0ba.jpg"
        },{
            game: "Portal 2",
            name: "Pit Boss (p)",
            desc: "Show that pit who's boss",
            imag: "http://www.playstationtrophies.org/images/trophies/610/18.jpg"
        },{
            game: "Prototype 2",
            name: "Arcade Action",
            desc: "Karate kick a helicopter.",
            imag: "http://www.playstationtrophies.org/images/trophies/848/D02.jpg"
        },{
            game: "Ratchet & Clank (2016)",
            name: "Not My Job",
            desc: "Allow the extermibots to kill 35 amoeboids in Rilgar.",
            imag: "http://www.playstationtrophies.org/images/trophies/2842/437.jpg"
        },{
            game: "Rayman Legends",
            name: "Bouncing Island",
            desc: "Collect all the lums flying above the bouncing island in \"The Mysterious Inflatable Island\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1526/85C.jpg"
        },{
            game: "Rayman Origins",
            name: "Back At You!",
            desc: "You Bubblized a Hunter with his own live missile!",
            imag: "http://www.playstationtrophies.org/images/trophies/651/37.jpg"
        },{
            game: "Red Dead Redemption",
            name: "What About Hand Grenades?",
            desc: "Get a ringer in a game of Horseshoes.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/12.jpg"
        },{
            game: "Remember Me",
            name: "Fuzzy logic",
            desc: "Hit 5 enemies at once with a Logic Bomb while they are stunned by the Sensen DOS",
            imag: "http://www.playstationtrophies.org/images/trophies/1671/118.jpg"
        },{
            game: "Resident Evil 5",
            name: "They're ACTION Figures!",
            desc: "Collect all the figurines.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/027.jpg"
        },{
            game: "Sleeping Dogs",
            name: "A Slap in the Face",
            desc: "Kill someone with a fish.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/0EB.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Are We Cool?",
            desc: "You found Jesus while playing as a Jew.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/654.jpg"
        },{
            game: "Star Wars: The Force Unleashed",
            name: "Worst Day-Shift Manager Ever",
            desc: "Kill 12 Stormtroopers as Vader during the Prologue",
            imag: "http://www.playstationtrophies.org/images/trophies/195/48.jpg"
        },{
            game: "Tomb Raider",
            name: "Former Adventurer",
            desc: "Incapacitate 25 enemies with dodge counter.",
            imag: "http://www.playstationtrophies.org/images/trophies/831/B93.jpg"
        },{
            game: "Uncharted 4: A Thief's End",
            name: "Shh Sleep Now",
            desc: "Stealth take-down 30 enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/2388/6d2.jpg"
        },{
            game: "Valiant Hearts: The Great War",
            name: "Good doggy",
            desc: "Pet the dog",
            imag: "http://www.playstationtrophies.org/images/trophies/2756/be9.jpg"
        },{
            game: "WATCH DOGS",
            name: "Sanity Check",
            desc: "Collect all 8 Burner Phones",
            imag: "http://www.playstationtrophies.org/images/trophies/2250/db0.jpg"
        }]
    },{
        listName: "Luffybuggy's Challenge Dojo List",
        banner: "http://i.imgur.com/HhT2iVL.jpg",
        award: "http://i.imgur.com/PsIMJ2O.jpg",
        trophies: [{
            game: "Castlevania: Harmony of Despair",
            name: "Hunter Legend",
            desc: "Complete Hard Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/1120/12.jpg"
        },{
            game: "Castlevania: Lords of Shadow - Mirror of Fate HD",
            name: "I'm a Belmont!",
            desc: "Finish the game on Hard without lowering the difficulty or enabling navigation aids from the map",
            imag: "http://www.playstationtrophies.org/images/trophies/2224/830.jpg"
        },{
            game: "Darkstalkers Resurrection",
            name: "Aensland of Makai",
            desc: "Complete the first tier of the award \"Sucked Dry\".",
            imag: "http://www.playstationtrophies.org/images/trophies/1762/E26.jpg"
        },{
            game: "Dead Rising 2: Off The Record",
            name: "Alpha Vs. Omega",
            desc: "Have Denyce attack and damage Sgt Boykin.",
            imag: "http://www.playstationtrophies.org/images/trophies/995/51.jpg"
        },{
            game: "Devil May Cry HD",
            name: "The Devil Made Me Do It",
            desc: "Finish the game without using any Yellow Orbs",
            imag: "http://www.playstationtrophies.org/images/trophies/1223/F69.jpg"
        },{
            game: "Fighting Vipers",
            name: "Perfect",
            desc: "Win a round without receiving any damage in Arcade Mode (any difficulty)",
            imag: "http://www.playstationtrophies.org/images/trophies/1825/DB4.jpg"
        },{
            game: "J-Stars Victory Vs +",
            name: "The Road to Glory",
            desc: "Win every battle on Victory Road.",
            imag: "http://www.playstationtrophies.org/images/trophies/3330/a30.jpg"
        },{
            game: "Mega Man 10",
            name: "BLUE BOMBER",
            desc: "Clear the game in under an hour.",
            imag: "http://www.playstationtrophies.org/images/trophies/405/02.jpg"
        },{
            game: "METAL GEAR SOLID 4",
            name: "Sounds of the Battlefield",
            desc: "Obtained all iPod® tracks (excluding tracks obtained via password).",
            imag: "http://www.playstationtrophies.org/images/trophies/515/EE1.jpg"
        },{
            game: "Outlast",
            name: "LUNATIC",
            desc: "Finish the game in Insane mode",
            imag: "http://www.playstationtrophies.org/images/trophies/2122/711.jpg"
        },{
            game: "Resident Evil",
            name: "Ghost of a Chance",
            desc: "Finish the game in Invisible Enemy mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2957/ecf.jpg"
        },{
            game: "Resonance of Fate",
            name: "Bullet Barrage",
            desc: "A trophy for landing a combo of over 500 hits.",
            imag: "http://www.playstationtrophies.org/images/trophies/339/02.jpg"
        },{
            game: "Rocket Knight",
            name: "Legendary Possum",
            desc: "Completed Gold Sparkster Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/526/04.jpg"
        },{
            game: "SEGA MEGA DRIVE Ultimate Collection",
            name: "Master the System",
            desc: "Unlock Everything",
            imag: "http://www.playstationtrophies.org/images/trophies/85/031.jpg"
        },{
            game: "Shantae: Risky's Revenge - Director's Cut",
            name: "Potions Smotions",
            desc: "Beat the genie clone without using potions",
            imag: "http://www.playstationtrophies.org/images/trophies/3746/cfa.jpg"
        },{
            game: "Sonic & All-Stars Racing Transformed",
            name: "SEGA Super Star",
            desc: "Earn your Triple-Star License",
            imag: "http://www.playstationtrophies.org/images/trophies/1528/A2C.jpg"
        },{
            game: "Sonic Adventure 2",
            name: "You Are The Legend",
            desc: "Win A RANK in all stages in story mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/1602/C00.jpg"
        },{
            game: "Sonic CD",
            name: "Saviour of the Planet",
            desc: "Destroy all the robot teleporters and Metal Sonic holograms in the past",
            imag: "http://www.playstationtrophies.org/images/trophies/1172/E82.jpg"
        },{
            game: "Sonic Generations",
            name: "Red Ring Collector",
            desc: "Get all Red Star Rings.",
            imag: "http://www.playstationtrophies.org/images/trophies/999/48.jpg"
        },{
            game: "Sonic the Hedgehog 4: Episode 1",
            name: "Untouchable (s)",
            desc: "Clear the E.G.G. STATION ZONE without taking any damage.",
            imag: "http://www.playstationtrophies.org/images/trophies/407/12.jpg"
        },{
            game: "Space Channel 5: Part 2",
            name: "Fever Dancer",
            desc: "Clear the Single Player Ulala's Dance Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/784/05.jpg"
        },{
            game: "Street Fighter III: 3rd Strike Online Edition",
            name: "Practice Makes Perfect",
            desc: "Complete the challenge 'Practice Makes Perfect'.",
            imag: "http://www.playstationtrophies.org/images/trophies/684/2B5.jpg"
        },{
            game: "Strider",
            name: "Special Class-A",
            desc: "Complete game on Hard difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/2186/E7A.jpg"
        },{
            game: "Super Monkey Ball: Banana Splitz",
            name: "Monkey Master",
            desc: "Cleared Monkey Ball Master Course!",
            imag: "http://www.playstationtrophies.org/images/trophies/1360/3C1.jpg"
        },{
            game: "Tales of Graces f",
            name: "Bryce in 60 Seconds",
            desc: "Defeated that jerk with the claw in a minute or less.",
            imag: "http://www.playstationtrophies.org/images/trophies/935/864.jpg"
        },{
            game: "Tekken 6",
            name: "Machine Crusher",
            desc: "Defeat NANCY-MI847J.",
            imag: "http://www.playstationtrophies.org/images/trophies/250/50.jpg"
        },{
            game: "The House of the Dead III",
            name: "TIME ATTACKER",
            desc: "Clear Time Attack Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/1348/7A7.jpg"
        },{
            game: "Ultimate Marvel vs. Capcom 3",
            name: "High-Score Hero",
            desc: "Earn 500,000 points in Arcade mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/1151/06.jpg"
        },{
            game: "Virtua Fighter 2",
            name: "Stage 5 Complete",
            desc: "Complete Stage 5 of Arcade Mode (any difficulty)",
            imag: "http://www.playstationtrophies.org/images/trophies/1827/7B3.jpg"
        },{
            game: "Yakuza 3",
            name: "Ultimate Challenger",
            desc: "Play all rounds in Ultimate Skill mode after beating the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/316/37.jpg"
        }]
    },{
        listName: "Mendel's Bad Guy Club",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_mendel.png",
        award: "http://www.playstationtrophies.org/images/news/badguys64.png",
        trophies: [{
            game: "Assassin's Creed: Revelations",
            name: "Bully",
            desc: "Find and beat up Duccio",
            imag: "http://www.playstationtrophies.org/images/trophies/918/50.jpg"
        },{
            game: "Asura's Wrath",
            name: "Like a Fish",
            desc: "Consume more alcohol than you should.",
            imag: "http://www.playstationtrophies.org/images/trophies/751/AAB.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Party Pooper",
            desc: "KO all the henchmen celebrating your arrival at the party",
            imag: "http://www.playstationtrophies.org/images/trophies/192/20.jpg"
        },{
            game: "Beyond: Two Souls",
            name: "Uncontrollable",
            desc: "Took every opportunity to be evil with Aiden",
            imag: "http://www.playstationtrophies.org/images/trophies/1585/691.jpg"
        },{
            game: "BioShock",
            name: "Irony",
            desc: "The player has taken a picture of Sander Cohen's corpse",
            imag: "http://www.playstationtrophies.org/images/trophies/23/46.jpg"
        },{
            game: "Broken Age",
            name: "Holy Smokes",
            desc: "Deploy a weapon of mass destruction",
            imag: "http://www.playstationtrophies.org/images/trophies/3501/0bb.jpg"
        },{
            game: "Castle Crashers",
            name: "The Traitor",
            desc: "Defeat any boss by playing one of his own minions.",
            imag: "http://www.playstationtrophies.org/images/trophies/387/03.jpg"
        },{
            game: "Dead Space: Extraction",
            name: "Taking Your Time, McNeill?",
            desc: "Admire the view in the crashed shuttle",
            imag: "http://www.playstationtrophies.org/images/trophies/875/204.jpg"
        },{
            game: "Dishonored",
            name: "Manipulator",
            desc: "You made others kill 5 of their own allies",
            imag: "http://www.playstationtrophies.org/images/trophies/1123/48D.jpg"
        },{
            game: "DuckTales: Remastered",
            name: "Score to Settle",
            desc: "Scrooge doesn't take kindly to being swindled by statues",
            imag: "http://www.playstationtrophies.org/images/trophies/1986/573.jpg"
        },{
            game: "Fallout 3",
            name: "Psychotic Prankster",
            desc: "Placed a grenade or mine while pickpocketing",
            imag: "http://www.playstationtrophies.org/images/trophies/70/047.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "The Courier Who Broke The Bank",
            desc: "Got banned from all the Strip's casinos.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/30.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Altruist Acolyte",
            desc: "Deliver an unsuspecting victim to the Altruist Cult.",
            imag: "http://www.playstationtrophies.org/images/trophies/687/864.jpg"
        },{
            game: "Grim Fandango Remastered",
            name: "*sniff* *sniff*",
            desc: "Make the angelitos cry.",
            imag: "http://www.playstationtrophies.org/images/trophies/2909/315.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Perfect Crime",
            desc: "Clean Manfred's shop of evidence + Let Lauren, Hassan and Kramer die + Kill Madison and Jayden + Origami Killer free",
            imag: "http://www.playstationtrophies.org/images/trophies/321/56.jpg"
        },{
            game: "Hitman: Absolution",
            name: "Whoops",
            desc: "Achieve your first accident kill",
            imag: "http://www.playstationtrophies.org/images/trophies/678/B77.jpg"
        },{
            game: "Hotline Miami",
            name: "Smell Something Burning",
            desc: "Kill the crapping gangster with a fireaxe",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/23B.jpg"
        },{
            game: "inFAMOUS 2",
            name: "Discerning Taste",
            desc: "Take down a street performer who is imitating a statue.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/43.jpg"
        },{
            game: "LittleBigPlanet 2",
            name: "Turbo Slapper",
            desc: "Slap more than one player at once",
            imag: "http://www.playstationtrophies.org/images/trophies/533/29.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "I Swear! I Did It By Mistake!",
            desc: "Peeped under Juliet's skirt once.",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/016.jpg"
        },{
            game: "Metal Gear Solid 2",
            name: "Sexting",
            desc: "Send Otacon a picture of the marine with no pants",
            imag: "http://www.playstationtrophies.org/images/trophies/1053/07.jpg"
        },{
            game: "Mirror's Edge",
            name: "Sweet goodbye",
            desc: "Triggered the flip-off move",
            imag: "http://www.playstationtrophies.org/images/trophies/43/043.jpg"
        },{
            game: "Monkey Island 2 Special Edition: LeChuck's Revenge",
            name: "Five Minutes Later...",
            desc: "Allow Guybrush to die",
            imag: "http://www.playstationtrophies.org/images/trophies/523/09.jpg"
        },{
            game: "Need for Speed: Most Wanted",
            name: "Mauled",
            desc: "Wreck 10 cops in a single pursuit in the Ford F-150 SVT Raptor",
            imag: "http://www.playstationtrophies.org/images/trophies/1579/7B0.jpg"
        },{
            game: "Portal 2",
            name: "You Made Your Point",
            desc: "Refuse to solve the first test in Chapter 8",
            imag: "http://www.playstationtrophies.org/images/trophies/610/29.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Dastardly",
            desc: "Place a hogtied woman on the train tracks, and witness her death by train.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/30.jpg"
        },{
            game: "Rocketbirds: Hardboiled Chicken",
            name: "For What Reason?",
            desc: "Launch the silo missile",
            imag: "http://www.playstationtrophies.org/images/trophies/1192/23.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Acceptance",
            desc: "You accepted your fate and chose the name Douchebag yourself.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/18F.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "Unfriendly Fire",
            desc: "Save a bullet",
            imag: "http://www.playstationtrophies.org/images/trophies/613/7FC.jpg"
        },{
            game: "The Binding of Isaac: Rebirth",
            name: "Judas",
            desc: "Kill Satan",
            imag: "http://www.playstationtrophies.org/images/trophies/2220/5e9.jpg"
        },{
            game: "The Cave",
            name: "Such Bad Children",
            desc: "Broke things",
            imag: "http://www.playstationtrophies.org/images/trophies/1554/552.jpg"
        },{
            game: "Skyrim",
            name: "Master Criminal",
            desc: "Bounty of 1000 gold in all nine holds",
            imag: "http://www.playstationtrophies.org/images/trophies/826/36.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "He's Gonna Need a Sturgeon",
            desc: "Hit three enemies with fish in the market",
            imag: "http://www.playstationtrophies.org/images/trophies/373/47.jpg"
        },{
            game: "Until Dawn",
            name: "The Psycho Path",
            desc: "Sam or Ashley attacked the psycho with a weapon",
            imag: "http://www.playstationtrophies.org/images/trophies/1672/ef8.jpg"
        },{
            game: "Bloodborne",
            name: "Childhood's Beginning",
            desc: "You became an infant Great One, lifting humanity into its next childhood.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/35e.jpg"
        }]
    },{
        listName: "Moosh's Trophy Train Wreck",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_moosh.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_moosh64.png",
        trophies: [{
            game: "Assassin's Creed IV Black Flag",
            name: "Siren Song",
            desc: "Rescue pirate hostages by distracting enemies with \"dancers.\"",
            imag: "http://www.playstationtrophies.org/images/trophies/2233/d45.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Catch!",
            desc: "Catch a Batarang (any play mode)",
            imag: "http://www.playstationtrophies.org/images/trophies/192/26.jpg"
        },{
            game: "BioShock",
            name: "Toaster in the Tub",
            desc: "The player has shocked an enemy in the water",
            imag: "http://www.playstationtrophies.org/images/trophies/23/48.jpg"
        },{
            game: "BioShock Infinite",
            name: "The Bird or The Cage",
            desc: "Completed The Hand of the Prophet.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/B69.jpg"
        },{
            game: "Far Cry 3",
            name: "Say Hi to the Internet",
            desc: "Find the lost Hollywood star.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/00F.jpg"
        },{
            game: "Far Cry 4",
            name: "The People's Champ",
            desc: "Reach Arena Rank 5 (Campaign Arena only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2777/9e5.jpg"
        },{
            game: "Game of Thrones",
            name: "Love and Hostility",
            desc: "Completed Chapter 6 of Episode 2",
            imag: "http://www.playstationtrophies.org/images/trophies/2441/ff1.jpg"
        },{
            game: "God of War",
            name: "Get Me a Beer Kid",
            desc: "Free yourself from the depths of Hades",
            imag: "http://www.playstationtrophies.org/images/trophies/263/1.jpg"
        },{
            game: "God of War II",
            name: "Learning to Fly",
            desc: "Acquire the Icarus Wings",
            imag: "http://www.playstationtrophies.org/images/trophies/264/1.jpg"
        },{
            game: "God of War III",
            name: "Bloody Hell",
            desc: "Cover Kratos in 500 buckets of blood by killing the enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/319/001.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Altruist Acolyte",
            desc: "Deliver an unsuspecting victim to the Altruist Cult.",
            imag: "http://www.playstationtrophies.org/images/trophies/3057/127.jpg"
        },{
            game: "Grim Fandango Remastered",
            name: "\"Consider it an homage.\"",
            desc: "Have Olivia recite one of your poems.",
            imag: "http://www.playstationtrophies.org/images/trophies/2909/271.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Nerd",
            desc: "Find all clues using ARI (Crime scene + Mad Jack + Fish tank) and find the Origami Killer",
            imag: "http://www.playstationtrophies.org/images/trophies/321/54.jpg"
        },{
            game: "Hitman: Absolution",
            name: "Chamber of Secrets",
            desc: "Locate room 899",
            imag: "http://www.playstationtrophies.org/images/trophies/678/2FB.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "Coloring Inside the Lines",
            desc: "Complete all the Stencil Art",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/df3.jpg"
        },{
            game: "Jurassic Park: The Intruder",
            name: "Life Finds a Way",
            desc: "Stay alive from beginning to end.",
            imag: "http://www.playstationtrophies.org/images/trophies/590/369.jpg"
        },{
            game: "L.A. Noire",
            name: "Hollywoodland",
            desc: "Find and inspect all gold film canisters.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/41.jpg"
        },{
            game: "LEGO The Lord of the Rings",
            name: "It won't be that easy!",
            desc: "During 'Prologue', jump into the fires of Mount Doom as Isildur.",
            imag: "http://www.playstationtrophies.org/images/trophies/1535/588.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "The Spirit of Mordor",
            desc: "Start a Riot by commanding a Warchief to attack another Warchief.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/fb1.jpg"
        },{
            game: "Minecraft",
            name: "On A Rail",
            desc: "Travel by minecart to a point at least 500m in a single direction from where you started.",
            imag: "http://www.playstationtrophies.org/images/trophies/2257/fb2.jpg"
        },{
            game: "Murdered: Soul Suspect",
            name: "Terror on the Tracks",
            desc: "Uncovered The Terror on the Tracks ghost story",
            imag: "http://www.playstationtrophies.org/images/trophies/2525/b58.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Buckin' Awesome",
            desc: "Break the Kentucky Saddler, the American Standardbred, and the Hungarian Half-bred.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/19.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Kleptomaniac",
            desc: "Hijack 5 trucks and collect their cargo.",
            imag: "http://www.playstationtrophies.org/images/trophies/2959/c95.jpg"
        },{
            game: "Skyrim",
            name: "Snake Tongue",
            desc: "Successfully persuade, bribe, and intimidate",
            imag: "http://www.playstationtrophies.org/images/trophies/826/29.jpg"
        },{
            game: "The Order: 1886",
            name: "Modern Marvels",
            desc: "Kill 40 enemies with science weapons",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/f41.jpg"
        },{
            game: "The Raven",
            name: "Sprinter",
            desc: "You have caught the runaway train!",
            imag: "http://www.playstationtrophies.org/images/trophies/2168/953.jpg"
        },{
            game: "The Walking Dead",
            name: "What now?",
            desc: "Complete chapter 4 of episode 3.",
            imag: "http://www.playstationtrophies.org/images/trophies/3111/f31.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Still. Not. Bitten.",
            desc: "Took care of yourself.",
            imag: "http://www.playstationtrophies.org/images/trophies/3095/9d5.jpg"
        },{
            game: "The Wolf Among Us",
            name: "A Silver Bullet",
            desc: "Completed Chapter 3 of Episode 5.",
            imag: "http://www.playstationtrophies.org/images/trophies/3099/192.jpg"
        },{
            game: "Tomb Raider",
            name: "Clever Girl",
            desc: "Purchase all skills in one category.",
            imag: "http://www.playstationtrophies.org/images/trophies/2439/F38.jpg"
        }]
    },{
        listName: "Mulli's Honey Badger Don't Care About Your Trophies",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_mulli.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_mulli64.png",
        trophies: [{
            game: "Alien Isolation",
            name: "100 Times Too Many",
            desc: "Get killed by the Alien 100 times",
            imag: "http://www.playstationtrophies.org/images/trophies/2453/8f7.jpg"
        },{
            game: "Assassin's Creed Unity",
            name: "Panoramic View",
            desc: "Synchronize all Viewpoints.",
            imag: "http://www.playstationtrophies.org/images/trophies/2628/5b6.jpg"
        },{
            game: "BioShock",
            name: "A Man Chooses",
            desc: "Complete the game on Survivor difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/23/52.jpg"
        },{
            game: "Borderlands 2",
            name: "Friendship Rules",
            desc: "Revived someone from \"Fight for Your Life!\" that is on your friends list",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/0AA.jpg"
        },{
            game: "Dead Space 3",
            name: "There's Always Peng!",
            desc: "Find Peng.",
            imag: "http://www.playstationtrophies.org/images/trophies/1559/40E.jpg"
        },{
            game: "Dragon Age: Inquisition",
            name: "Dragons' Bane",
            desc: "Slay 10 high dragons in single-player mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2254/11c.jpg"
        },{
            game: "Evolve",
            name: "Left For Dead",
            desc: "Incapacitate a Hunter and leave them to bleed out outside of the Tutorials",
            imag: "http://www.playstationtrophies.org/images/trophies/2485/1b3.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "Just the Tip",
            desc: "Kill a Dragon with the Bow",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/AFD.jpg"
        },{
            game: "Final Fantasy X HD",
            name: "Learning!",
            desc: "Learn to use all enemy abilities",
            imag: "http://www.playstationtrophies.org/images/trophies/1184/7b7.jpg"
        },{
            game: "God of War II",
            name: "You Know the Germans Make Good Stuff...",
            desc: "Collect all Uber Chests",
            imag: "http://www.playstationtrophies.org/images/trophies/264/3.jpg"
        },{
            game: "Hotline Miami",
            name: "Sounds Of Animals Fighting",
            desc: "Wear all masks at least once",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/848.jpg"
        },{
            game: "Hotline Miami 2: Wrong Number",
            name: "DON'T LET ANGER GET THE BEST OF YOU",
            desc: "Clear all of the Writer's levels without killing",
            imag: "http://www.playstationtrophies.org/images/trophies/2666/fc9.jpg"
        },{
            game: "Journey",
            name: "Companion",
            desc: "Finish the game with the same partner for the majority of the journey and return to the beginning.",
            imag: "http://www.playstationtrophies.org/images/trophies/844/0CB.jpg"
        },{
            game: "LEGO The Lord of the Rings",
            name: "One does not simply...",
            desc: "Walk into Mordor.",
            imag: "http://www.playstationtrophies.org/images/trophies/1535/D5E.jpg"
        },{
            game: "Mass Effect 2",
            name: "No One Left Behind",
            desc: "Keep your team alive through the suicide mission",
            imag: "http://www.playstationtrophies.org/images/trophies/703/29.jpg"
        },{
            game: "Metal Gear Solid 3",
            name: "The Early End",
            desc: "Kill The End before the boss battle",
            imag: "http://www.playstationtrophies.org/images/trophies/1054/41.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "To Rule them All",
            desc: "Witness the creation of The Rings of Power.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/8f0.jpg"
        },{
            game: "Okami HD",
            name: "Who Let the Dogs Out?",
            desc: "Defeat the Kusa 5.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/158.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Dastardly",
            desc: "Place a hogtied woman on the train tracks, and witness her death by train.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/30.jpg"
        },{
            game: "RESOGUN",
            name: "Masterful dodger of revenge bullets and stuff alike",
            desc: "Complete a level on Master difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/14.jpg"
        },{
            game: "SEGA MEGA DRIVE Ultimate Collection",
            name: "Three Times a Charm",
            desc: "Streets of Rage: Complete 1st Level using all 3 characters",
            imag: "http://www.playstationtrophies.org/images/trophies/85/026.jpg"
        },{
            game: "Shadow of the Colossus",
            name: "The Forbidden",
            desc: "Clear the game in normal difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/874/18.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "More Popular Than Jesus",
            desc: "You made friends with half of South Park.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/1BF.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "The Horror",
            desc: "Face the horrors of war.",
            imag: "http://www.playstationtrophies.org/images/trophies/613/386.jpg"
        },{
            game: "The Golf Club",
            name: "I Would Walk...",
            desc: "Play holes totalling length of 500 miles.",
            imag: "http://www.playstationtrophies.org/images/trophies/2511/7bc.jpg"
        },{
            game: "The Last of Us",
            name: "That's all I got",
            desc: "Survive all of Ellie's jokes",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/4F4.jpg"
        },{
            game: "The Wolf Among Us",
            name: "What Big Eyes You Have",
            desc: "Completed Chapter 3 of Episode 3.",
            imag: "http://www.playstationtrophies.org/images/trophies/1996/E48.jpg"
        },{
            game: "Thomas Was Alone",
            name: "Thomas Was Not Alone",
            desc: "Finish the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/8B9.jpg"
        },{
            game: "Transistor",
            name: "Goodbye()",
            desc: "Recurse through the story.",
            imag: "http://www.playstationtrophies.org/images/trophies/2113/7cb.jpg"
        },{
            game: "Valiant Hearts: The Great War",
            name: "Good doggy",
            desc: "Pet the dog",
            imag: "http://www.playstationtrophies.org/images/trophies/2756/be9.jpg"
        }]
    },{
        listName: "Number's Collectors Club",
        banner: "http://i.imgur.com/JzY5mrc.png",
        award: "http://i.imgur.com/MBlf6Qd.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "In Memory of Petruccio",
            desc: "Collect all the Feathers.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/48.jpg"
        },{
            game: "Assassin's Creed Unity",
            name: "Panoramic View",
            desc: "Synchronize all Viewpoints in Paris.",
            imag: "http://www.playstationtrophies.org/images/trophies/2628/5b6.jpg"
        },{
            game: "BioShock",
            name: "Historian",
            desc: "Find every audio diary",
            imag: "http://www.playstationtrophies.org/images/trophies/23/50.jpg"
        },{
            game: "BioShock 2",
            name: "Rapture Historian",
            desc: "Found 100 audio diaries.",
            imag: "http://www.playstationtrophies.org/images/trophies/309/37.jpg"
        },{
            game: "BioShock Infinite",
            name: "Eavesdropper",
            desc: "In the Main Campaign, collected every Voxophone.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/425.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "The Road Less Traveled",
            desc: "Collect 22 enemy intel items.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/44.jpg"
        },{
            game: "Dead Space",
            name: "Merchant",
            desc: "Collect 8 schematics",
            imag: "http://www.playstationtrophies.org/images/trophies/26/023.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "Doctorate",
            desc: "Read all 29 XP books within a single playthrough.",
            imag: "http://www.playstationtrophies.org/images/trophies/2341/9E5.jpg"
        },{
            game: "Dishonored",
            name: "Occultist",
            desc: "You collected 10 bone charms",
            imag: "http://www.playstationtrophies.org/images/trophies/1123/23E.jpg"
        },{
            game: "DMC: Devil May Cry",
            name: "And you are set free",
            desc: "Free half of the Lost Souls ",
            imag: "http://www.playstationtrophies.org/images/trophies/750/02F.jpg"
        },{
            game: "Far Cry 3",
            name: "Say Hi to the Internet",
            desc: "Find the lost Hollywood star.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/00F.jpg"
        },{
            game: "Far Cry 4",
            name: "Caretaker Of Memory",
            desc: "Find 10 Lost Letters (Campaign only).",
            imag: "http://www.playstationtrophies.org/images/trophies/2777/a25.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "From Beyond the Stars",
            desc: "Collect and return all spaceship parts.",
            imag: "http://www.playstationtrophies.org/images/trophies/687/445.jpg"
        },{
            game: "Hitman: Absolution",
            name: "Information is Power",
            desc: "Collect all evidence",
            imag: "http://www.playstationtrophies.org/images/trophies/678/321.jpg"
        },{
            game: "inFAMOUS",
            name: "Just Scratched the Surface",
            desc: "Collect all Dead Drops in the Neon District.",
            imag: "http://www.playstationtrophies.org/images/trophies/122/1.jpg"
        },{
            game: "inFAMOUS 2",
            name: "Shardcore",
            desc: "Pick up 50% of blast shards scattered around New Marais.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/05.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "Bweep! Bweep! Bweep!",
            desc: "Collect half the Blast Shards",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/092.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy",
            name: "Power Lunch",
            desc: "Collect 25 Power Cells",
            imag: "http://www.playstationtrophies.org/images/trophies/1217/14D.jpg"
        },{
            game: "L.A. Noire",
            name: "Star Map",
            desc: "Discover all landmark locations around the city.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/34.jpg"
        },{
            game: "Mafia II",
            name: "Collector's Item",
            desc: "Find at least one collectible in the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/351/39.jpg"
        },{
            game: "Metal Gear Solid 3",
            name: "Just What the Doctor Ordered",
            desc: "Collect every type of medicinal plant",
            imag: "http://www.playstationtrophies.org/images/trophies/1054/21.jpg"
        },{
            game: "Murdered: Soul Suspect",
            name: "Collector 1",
            desc: "Collected an artifact",
            imag: "http://www.playstationtrophies.org/images/trophies/2525/53b.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Getting the Goods",
            desc: "Find 25% of all Collectibles.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/32.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "Spotter",
            desc: "Recover one Intel Item.",
            imag: "http://www.playstationtrophies.org/images/trophies/613/770.jpg"
        },{
            game: "The Last of Us",
            name: "I got this",
            desc: "Find all training manuals",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/883.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "First Treasure (1)",
            desc: "Find one treasure",
            imag: "http://www.playstationtrophies.org/images/trophies/8/1.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Apprentice Fortune Hunter",
            desc: "Find ten treasures",
            imag: "http://www.playstationtrophies.org/images/trophies/214/03.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Relic Finder (3)",
            desc: "Find the Strange Relic",
            imag: "http://www.playstationtrophies.org/images/trophies/373/08.jpg"
        },{
            game: "Wolfenstein: The New Order",
            name: "All that glitters",
            desc: "Collect 25 gold items",
            imag: "http://www.playstationtrophies.org/images/trophies/2552/5e0.jpg"
        },{
            game: "Wolfenstein: The Old Blood",
            name: "Paperboy",
            desc: "Collect 5 letters",
            imag: "http://www.playstationtrophies.org/images/trophies/3447/f1a.jpg"
        }]
    },{
        listName: "Olsen's Bullet Hell",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_olsen.png",
        award: "http://www.playstationtrophies.org/images/news/bullethell64.png",
        trophies: [{
            game: "Alpha Protocol",
            name: "One With The Shadows",
            desc: "Complete 3 missions with less than 5 kills and with no enemies alerted to your presence.",
            imag: "http://www.playstationtrophies.org/images/trophies/51/46.jpg"
        },{
            game: "Assassin's Creed III Liberation",
            name: "Umbrella",
            desc: "Kill 25 enemies with the Parasol Gun",
            imag: "http://www.playstationtrophies.org/images/trophies/1155/1D2.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Contract Terminated",
            desc: "Stop the contract operative",
            imag: "http://www.playstationtrophies.org/images/trophies/398/17.jpg"
        },{
            game: "Batman: Arkham Origins",
            name: "Gotham Protector",
            desc: "Master the Gotham Protector Dark Knight track",
            imag: "http://www.playstationtrophies.org/images/trophies/2009/A46.jpg"
        },{
            game: "Battlefield 3",
            name: "Army of Two",
            desc: "Completed all co-op missions on Hard",
            imag: "http://www.playstationtrophies.org/images/trophies/883/29.jpg"
        },{
            game: "Battlefield 4",
            name: ".45 old school",
            desc: "Perform 45 kills with the M1911 Handgun in Multiplayer",
            imag: "http://www.playstationtrophies.org/images/trophies/1640/B30.jpg"
        },{
            game: "BioShock Infinite",
            name: "Heartbreaker",
            desc: "Killed a Handyman by only shooting his heart.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/1E4.jpg"
        },{
            game: "Crysis",
            name: "Cool In A Crysis",
            desc: "Complete the game on Hard or Delta difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/1183/23.jpg"
        },{
            game: "Dead Nation",
            name: "Aim For The Head",
            desc: "Perform 500 Headshots",
            imag: "http://www.playstationtrophies.org/images/trophies/592/24.jpg"
        },{
            game: "Dead Space 2",
            name: "Epic Dismemberment",
            desc: "Dismember 2,500 Necromorph Limbs (single player only)",
            imag: "http://www.playstationtrophies.org/images/trophies/355/26.jpg"
        },{
            game: "Diablo III",
            name: "Greed over Need",
            desc: "Kill 100 Treasure Goblins.",
            imag: "http://www.playstationtrophies.org/images/trophies/1935/045.jpg"
        },{
            game: "Doom Classic Complete",
            name: "Knuckle Sammich",
            desc: "Kill a CyberDemon with your fists in singleplayer.",
            imag: "http://www.playstationtrophies.org/images/trophies/1814/211.jpg"
        },{
            game: "DOOM 3",
            name: "Ready for Action!",
            desc: "Get the BFG-9000 from Security Chief's office in DOOM 3",
            imag: "http://www.playstationtrophies.org/images/trophies/1561/14A.jpg"
        },{
            game: "Fallout 3",
            name: "You Gotta Shoot 'Em in the Head",
            desc: "Completed 'You Gotta Shoot 'Em in the Head'",
            imag: "http://www.playstationtrophies.org/images/trophies/70/026.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "Master of the Arsenal",
            desc: "Caused 10,000 damage with Gun Runners' Arsenal (GRA) Weapons.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/73.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "The Only True Stopper",
            desc: "Headshot Every Type of Enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/739.jpg"
        },{
            game: "Injustice: Gods Among Us",
            name: "Perfect Aim",
            desc: "Win a match as Deathstroke without missing a shot (minimum 12 shots)",
            imag: "http://www.playstationtrophies.org/images/trophies/1572/41A.jpg"
        },{
            game: "Killzone 3",
            name: "Eagle Eye",
            desc: "Shot and killed 6 Helghast using the Sniper Rifle without reloading or switching weapons",
            imag: "http://www.playstationtrophies.org/images/trophies/430/36.jpg"
        },{
            game: "Killzone: Mercenary",
            name: "Full Deck",
            desc: "Collect a full deck of Valour cards",
            imag: "http://www.playstationtrophies.org/images/trophies/1675/EE7.jpg"
        },{
            game: "L.A. Noire",
            name: "Roscoe And Friends",
            desc: "Kill at least one bad guy with every gun.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/29.jpg"
        },{
            game: "Mafia II",
            name: "Hairdresser",
            desc: "Kill 5 enemies in rapid succession with a headshot.",
            imag: "http://www.playstationtrophies.org/images/trophies/351/31.jpg"
        },{
            game: "Mass Effect",
            name: "Extreme Power Gamer",
            desc: "Reach 60th level with one character",
            imag: "http://www.playstationtrophies.org/images/trophies/1743/DB0.jpg"
        },{
            game: "Mass Effect 2",
            name: "No One Left Behind",
            desc: "Keep your team alive through the suicide mission",
            imag: "http://www.playstationtrophies.org/images/trophies/703/29.jpg"
        },{
            game: "Mass Effect 3",
            name: "Veteran",
            desc: "Kill 5,000 enemies.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/37F.jpg"
        },{
            game: "Portal 2",
            name: "No Hard Feelings",
            desc: "Save a turret from redemption",
            imag: "http://www.playstationtrophies.org/images/trophies/610/24.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Bearly Legal",
            desc: "Kill and skin 18 grizzly bears.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/23.jpg"
        },{
            game: "Resistance 3",
            name: "Feeling Lucky, Punk",
            desc: "Detonate multiple Magnum rounds to kill 2+ enemies at once, 5 times",
            imag: "http://www.playstationtrophies.org/images/trophies/546/44.jpg"
        },{
            game: "Starhawk",
            name: "Deadeye (st)",
            desc: "With the LR-3 Railgun, kill an enemy from more than 2,500 feet away.",
            imag: "http://www.playstationtrophies.org/images/trophies/421/3B2.jpg"
        },{
            game: "Unreal Tournament III",
            name: "Fear the Reaper",
            desc: "Defeat Akasha and complete the campaign in Insane.",
            imag: "http://www.playstationtrophies.org/images/trophies/108/009.jpg"
        },{
            game: "XCOM: Enemy Unknown",
            name: "Shooting Stars",
            desc: "Shoot down 40 UFOs.",
            imag: "http://www.playstationtrophies.org/images/trophies/1350/415.jpg"
        }]
    },{
        listName: "Orthmann's Life is Study",
        banner: "http://i1364.photobucket.com/albums/r722/orthmann/ctl_banner_zpsqttkap9x.png",
        award: "http://i1364.photobucket.com/albums/r722/orthmann/ctl_award_64x64_zpsxd4rbtdk.jpg",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Art Connoisseur",
            desc: "Buy a Painting from Florence and Venice.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/45.jpg"
        },{
            game: "Bayonetta",
            name: "Truth In Its Purest Form",
            desc: "Collect all of Antonio's notes.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/47.jpg"
        },{
            game: "Broken Sword 5 - The Serpent's Curse",
            name: "The Truth to the Grave",
            desc: "Found the Tablet of Truth",
            imag: "http://www.playstationtrophies.org/images/trophies/3701/e0e.jpg"
        },{
            game: "Catherine",
            name: "Sake Sensei",
            desc: "Listen to all the sake sound bites.",
            imag: "http://www.playstationtrophies.org/images/trophies/380/34.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "Doctorate",
            desc: "Read all 29 unique XP books within a single playthrough.",
            imag: "http://www.playstationtrophies.org/images/trophies/450/14.jpg"
        },{
            game: "Final Fantasy Type-0",
            name: "Teacher's Pet",
            desc: "Sat in on one of Moglin's lectures.",
            imag: "http://www.playstationtrophies.org/images/trophies/2846/ad4.jpg"
        },{
            game: "Final Fantasy XIII",
            name: "Loremaster",
            desc: "Discerned the full attributes of 100 enemies.",
            imag: "http://www.playstationtrophies.org/images/trophies/307/35.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Nerd",
            desc: "Find all clues using ARI (Crime scene + Mad Jack + Fish tank) and find the Origami Killer",
            imag: "http://www.playstationtrophies.org/images/trophies/321/54.jpg"
        },{
            game: "Hitman: Absolution",
            name: "Information is Power",
            desc: "Collect all evidence",
            imag: "http://www.playstationtrophies.org/images/trophies/678/321.jpg"
        },{
            game: "J-Stars Victory Vs +",
            name: "Experience Makes a Person",
            desc: "Reach level 30 with 1 character in J-Adventure mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/3331/954.jpg"
        },{
            game: "Lightning Returns: Final Fantasy XIII",
            name: "Novice Craftsman",
            desc: "Proof of upgrading your first accessory. Did you find the experience thrilling?",
            imag: "http://www.playstationtrophies.org/images/trophies/1700/494.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Familiarologist",
            desc: "Awarded for taming 250 different species.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/978.jpg"
        },{
            game: "NIER",
            name: "Educated Warrior",
            desc: "Read the final novel segment.",
            imag: "http://www.playstationtrophies.org/images/trophies/379/17.jpg"
        },{
            game: "Nights of Azure",
            name: "Summon Expert",
            desc: "Summon familiar for 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/4005/650.jpg"
        },{
            game: "Okami HD",
            name: "Bakugami",
            desc: "Learn how to use Cherry Bomb.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/8C5.jpg"
        },{
            game: "One Piece: Pirate Warriors 3",
            name: "We... know everything in all of history...",
            desc: "Complete the entire Gallery.",
            imag: "http://www.playstationtrophies.org/images/trophies/3310/a5e.jpg"
        },{
            game: "One Piece Unlimited World Red",
            name: "The Archaeologist",
            desc: "Get 30 items using Robin's Read Tablet skill.",
            imag: "http://www.playstationtrophies.org/images/trophies/2606/ed8.jpg"
        },{
            game: "Rocket League",
            name: "Know the Drill",
            desc: "Complete a Practice Drill",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/b02.jpg"
        },{
            game: "Saint Seiya: Soldiers' Soul",
            name: "The Knowledge of a Saint",
            desc: "Experienced the Tutorial!",
            imag: "http://www.playstationtrophies.org/images/trophies/3555/ad1.jpg"
        },{
            game: "Saints Row IV",
            name: "The Whole Story",
            desc: "Find ALL Audio Logs.",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/EF6.jpg"
        },{
            game: "Senran Kagura Bon Appetit!",
            name: "Have a Rich Experience!",
            desc: "Reached a total of 5000000 (5 million) points.",
            imag: "http://www.playstationtrophies.org/images/trophies/2624/BB0.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Detective",
            desc: "Complete 50% of all missions, cases, favors, events, jobs and races.",
            imag: "http://www.playstationtrophies.org/images/trophies/2959/ed4.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Mastery",
            desc: "You've unlocked all of the upgrades for a New Kid ability.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/BAA.jpg"
        },{
            game: "The LEGO Movie - Videogame",
            name: "Always Read The Instructions!",
            desc: "Complete all Instruction Builds in Story Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2182/39B.jpg"
        },{
            game: "Thomas Was Alone",
            name: "Experienced Jumper",
            desc: "Jump 1600 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/297.jpg"
        },{
            game: "Tomb Raider",
            name: "Bookworm",
            desc: "Find 25% of all documents.",
            imag: "http://www.playstationtrophies.org/images/trophies/831/4F7.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "Novice Fortune Hunter",
            desc: "Find 10 treasures",
            imag: "http://www.playstationtrophies.org/images/trophies/3686/702.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Headshot Expert (2)",
            desc: "Defeat five enemies in a row with headshots",
            imag: "http://www.playstationtrophies.org/images/trophies/4012/5d3.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Adept Fortune Hunter",
            desc: "Find 60 treasures",
            imag: "http://www.playstationtrophies.org/images/trophies/373/05.jpg"
        },{
            game: "Virtue's Last Reward",
            name: "An Eidetic Experience",
            desc: "Found a file.",
            imag: "http://www.playstationtrophies.org/images/trophies/1773/FEE.jpg"
        }]
    },{
        listName: "Pain's Disturbingly Sweet Demise",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_pod.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_pod64.png",
        trophies: [{
            game: "Alpha Protocol",
            name: "Judge, Jury, and Executioner",
            desc: "Let your gun do the talking.",
            imag: "http://www.playstationtrophies.org/images/trophies/51/28.jpg"
        },{
            game: "Assassin's Creed IV Black Flag",
            name: "Silence, Fool!",
            desc: "Kill a guard ringing a bell.",
            imag: "http://www.playstationtrophies.org/images/trophies/2233/865.jpg"
        },{
            game: "DeathSpank",
            name: "Destroyer of Chickens",
            desc: "Kill 100 Chickens",
            imag: "http://www.playstationtrophies.org/images/trophies/428/01.jpg"
        },{
            game: "Dragon Age II",
            name: "Demon Slayer",
            desc: "Found and killed the ancient demon, Hybris.",
            imag: "http://www.playstationtrophies.org/images/trophies/654/10.jpg"
        },{
            game: "Dragon Age: Inquisition",
            name: "Dragons' Bane",
            desc: "Slay 10 high dragons in single-player mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/2254/515.jpg"
        },{
            game: "Dragon Age: Origins",
            name: "The Ultimate Sacrifice",
            desc: "The ultimate sacrifice was made in defense of Ferelden",
            imag: "http://www.playstationtrophies.org/images/trophies/270/15.jpg"
        },{
            game: "Dragon's Dogma",
            name: "The Messiah",
            desc: "Defeated the Ur-Dragon.",
            imag: "http://www.playstationtrophies.org/images/trophies/994/8FA.jpg"
        },{
            game: "Eat Lead: The Return of Matt Hazard",
            name: "Better Than One",
            desc: "Score two headshots with one bullet. 'Eat lead...both of you!'",
            imag: "http://www.playstationtrophies.org/images/trophies/93/010.jpg"
        },{
            game: "Far Cry 3",
            name: "Love the Boom",
            desc: "Kill 4 enemies simultaneously with one explosion (Single Player only).",
            imag: "http://www.playstationtrophies.org/images/trophies/922/3CD.jpg"
        },{
            game: "Final Fantasy X HD",
            name: "The Destination of Hatred",
            desc: "Defeat Seymour Omnis",
            imag: "http://www.playstationtrophies.org/images/trophies/1184/5d8.jpg"
        },{
            game: "Game Of Thrones",
            name: "Warlord",
            desc: "Reach the maximum level",
            imag: "http://www.playstationtrophies.org/images/trophies/1275/AAB.jpg"
        },{
            game: "God of War",
            name: "Getting My Ass Kicked",
            desc: "Die enough to get offered Easy Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/263/1.jpg"
        },{
            game: "HEAVY RAIN",
            name: "I'm a Killer...",
            desc: "The Shark - Kill the Drug Dealer",
            imag: "http://www.playstationtrophies.org/images/trophies/321/32.jpg"
        },{
            game: "I Am Alive",
            name: "Fifth quick kill",
            desc: "Perform 5 Machete quick kills while being bullied",
            imag: "http://www.playstationtrophies.org/images/trophies/366/74B.jpg"
        },{
            game: "Kingdoms of Amalur: Reckoning",
            name: "Out of Your League",
            desc: "Killed an enemy 4 levels higher than you.",
            imag: "http://www.playstationtrophies.org/images/trophies/669/634.jpg"
        },{
            game: "Mass Effect",
            name: "Geth Hunter",
            desc: "Register 250 synthetic enemy kills",
            imag: "http://www.playstationtrophies.org/images/trophies/1743/BD1.jpg"
        },{
            game: "Mass Effect 2",
            name: "Merciless",
            desc: "Make 20 enemies scream as they fall or are set on fire",
            imag: "http://www.playstationtrophies.org/images/trophies/703/37.jpg"
        },{
            game: "Mass Effect 3",
            name: "Eye of the Hurricane",
            desc: "Kill a brute while it's charging you.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/D79.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "Iron of Death",
            desc: "Issue a Death Threat, and then successfully kill the target.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/e0f.jpg"
        },{
            game: "Remember Me",
            name: "Rust in Peace",
            desc: "Destroy the Zorn that chased you in the prologue",
            imag: "http://www.playstationtrophies.org/images/trophies/1671/035.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Ass of Fire",
            desc: "You defeated 20 enemies using Cartman's Ass.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/F40.jpg"
        },{
            game: "Star Wars: The Force Unleashed",
            name: "Jawa Juicer",
            desc: "Crush 5 Jawas by using the grinder in the Garbage Processing Room",
            imag: "http://www.playstationtrophies.org/images/trophies/195/59.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
            name: "Poor Bob",
            desc: "Force Grip a Stormtrooper, impale him with a lightsaber, zap him with Force Lightning, then throw him into an object",
            imag: "http://www.playstationtrophies.org/images/trophies/397/44.jpg"
        },{
            game: "Strong Bad's Cool Game for Attractive People - Episode 5: 8-Bit is Enough",
            name: "Dragon-Man Slayer!",
            desc: "Defeat Trogdor.",
            imag: "http://www.playstationtrophies.org/images/trophies/868/05.jpg"
        },{
            game: "Terraria",
            name: "Appease the Volcano Gods",
            desc: "You sacrificed The Guide in boiling hot magma!",
            imag: "http://www.playstationtrophies.org/images/trophies/1720/63A.jpg"
        },{
            game: "The Order: 1886",
            name: "Up in Flames",
            desc: "Incinerate 15 enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/e12.jpg"
        },{
            game: "Thief",
            name: "Health Hazard",
            desc: "Kill or knockout 10 people using the environment",
            imag: "http://www.playstationtrophies.org/images/trophies/2236/48a.jpg"
        },{
            game: "Tomb Raider",
            name: "Down and Dirty (t)",
            desc: "Perform 15 finishers.",
            imag: "http://www.playstationtrophies.org/images/trophies/831/84A.jpg"
        },{
            game: "Wanted: Weapons of Fate",
            name: "Kill one, save a thousand Donuts",
            desc: "Kill Janice, ex-boss",
            imag: "http://www.playstationtrophies.org/images/trophies/89/033.jpg"
        },{
            game: "WATCH DOGS",
            name: "Black Hat Trick",
            desc: "Kill 3 enemies with a single IED",
            imag: "http://www.playstationtrophies.org/images/trophies/2250/09a.jpg"
        }]
    },{
        listName: "Phantom's \"Odds and Sods\" List",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_phantom.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_dp64.png",
        trophies: [{
            game: "Army of Two: The Devil's Cartel",
            name: "Army Of TWO",
            desc: "Perform 250 Flank, Surprise and/or Tag Team kills",
            imag: "http://www.playstationtrophies.org/images/trophies/1656/490.jpg"
        },{
            game: "Assassin's Creed II",
            name: "Vitruvian Man",
            desc: "Unlock all 20 pieces of Subject 16's video",
            imag: "http://www.playstationtrophies.org/images/trophies/260/21.jpg"
        },{
            game: "BioShock Infinite",
            name: "Dress for Success",
            desc: "Equipped a piece of Gear in all four slots",
            imag: "http://www.playstationtrophies.org/images/trophies/700/994.jpg"
        },{
            game: "Borderlands 2",
            name: "Phased and Confused",
            desc: "Phaselocked 100 enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/390.jpg"
        },{
            game: "Brink",
            name: "It's a trap!",
            desc: "Take down an enemy with a Satchel Charge",
            imag: "http://www.playstationtrophies.org/images/trophies/356/30.jpg"
        },{
            game: "Dead Nation",
            name: "Survivor (d)",
            desc: "Complete a mission without dying",
            imag: "http://www.playstationtrophies.org/images/trophies/592/19.jpg"
        },{
            game: "Dead Space 2",
            name: "Vacuum Cleaner",
            desc: "Decompress 20 Necromorphs without getting sucked out yourself",
            imag: "http://www.playstationtrophies.org/images/trophies/355/20.jpg"
        },{
            game: "Fallout 3",
            name: "Data Miner",
            desc: "Hacked 50 terminals",
            imag: "http://www.playstationtrophies.org/images/trophies/70/044.jpg"
        },{
            game: "Fuse",
            name: "Bro Code Violation",
            desc: "Perform a stealth takedown on the Raven soldier at the urinal",
            imag: "http://www.playstationtrophies.org/images/trophies/1066/D19.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Kifflom!",
            desc: "Complete your path to enlightenment... or not",
            imag: "http://www.playstationtrophies.org/images/trophies/687/05c.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Four Heroes",
            desc: "Complete the story with four characters alive",
            imag: "http://www.playstationtrophies.org/images/trophies/321/52.jpg"
        },{
            game: "Mass Effect 2",
            name: "The Cure",
            desc: "Gain the loyalty of the Professor",
            imag: "http://www.playstationtrophies.org/images/trophies/703/18.jpg"
        },{
            game: "Mass Effect 3",
            name: "Long Service Medal",
            desc: "Complete Mass Effect 3 twice, or once with a Mass Effect 2 import",
            imag: "http://www.playstationtrophies.org/images/trophies/845/C12.jpg"
        },{
            game: "Medal of Honor Frontline",
            name: "Trigger Happy",
            desc: "Fire 5,000 shots",
            imag: "http://www.playstationtrophies.org/images/trophies/772/29.jpg"
        },{
            game: "Oddworld: Stranger's Wrath HD",
            name: "Hidden What?!",
            desc: "Find the Black Market",
            imag: "http://www.playstationtrophies.org/images/trophies/731/54A.jpg"
        },{
            game: "Portal 2",
            name: "The Part Where He Kills You",
            desc: "This is that part",
            imag: "http://www.playstationtrophies.org/images/trophies/610/14.jpg"
        },{
            game: "Rage",
            name: "Decapathon",
            desc: "Get 10 Headshot kills with the Wingstick",
            imag: "http://www.playstationtrophies.org/images/trophies/354/11.jpg"
        },{
            game: "Ratchet & Clank 3: Up Your Arsenal",
            name: "Secret Agent Clank",
            desc: "Find the Clank Trophy",
            imag: "http://www.playstationtrophies.org/images/trophies/1455/AA0.jpg"
        },{
            game: "Red Dead Redemption",
            name: "No Dice",
            desc: "Complete a game of Liar's Dice without losing a single die",
            imag: "http://www.playstationtrophies.org/images/trophies/340/11.jpg"
        },{
            game: "Resident Evil 5",
            name: "Egg on Your Face",
            desc: "Defeat a Majini with a rotten egg",
            imag: "http://www.playstationtrophies.org/images/trophies/81/048.jpg"
        },{
            game: "Resistance 3",
            name: "Access Denied",
            desc: "Absorb 1,000 damage with Auger Shields",
            imag: "http://www.playstationtrophies.org/images/trophies/546/56.jpg"
        },{
            game: "Rocketbirds: Hardboiled Chicken",
            name: "Laser Assist",
            desc: "Kill an enemy by knocking him into a laser door",
            imag: "http://www.playstationtrophies.org/images/trophies/1192/26.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Karaoke Superstar",
            desc: "Achieving 90% and above for all songs at the Karaoke Bars in HK",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/58B.jpg"
        },{
            game: "Sniper Elite V2",
            name: "Potato Masher",
            desc: "Kill 100 enemies with explosives",
            imag: "http://www.playstationtrophies.org/images/trophies/988/50A.jpg"
        },{
            game: "Sound Shapes",
            name: "Death Mode: Touch the People",
            desc: "Complete the Death Mode level",
            imag: "http://www.playstationtrophies.org/images/trophies/1076/B5D.jpg"
        },{
            game: "The Saboteur",
            name: "Top o' the World",
            desc: "You climbed to the top of the Eiffel Tower",
            imag: "http://www.playstationtrophies.org/images/trophies/298/18.jpg"
        },{
            game: "The Walking Dead",
            name: "What Remains",
            desc: "Complete Episode 5: \"No Time Left\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/B8D.jpg"
        },{
            game: "WipEout HD",
            name: "Beat Zico",
            desc: "Equal or beat the lap time of 30.82 seconds on Anulpha Pass (Forward), Speed Lap, Venom using the Piranha",
            imag: "http://www.playstationtrophies.org/images/trophies/21/025.jpg"
        },{
            game: "X-Men Origins: Wolverine",
            name: "The Cake",
            desc: "You found the cake, yummy!",
            imag: "http://www.playstationtrophies.org/images/trophies/113/048.jpg"
        },{
            game: "X-Men: Destiny",
            name: "U Mad, Bro?",
            desc: "Defeat 30 U-Men in the Secret Lab",
            imag: "http://www.playstationtrophies.org/images/trophies/770/47.jpg"
        }]
    },{
        listName: "Proz's Introductory Guide to Some Things Kiwi",
        banner: "http://i.imgur.com/8xjCzvI.png",
        award: "http://i.imgur.com/e1rVyba.png",
        trophies: [{
            game: "Batman: Arkham City",
            name: "How's It Hanging?",
            desc: "Clean up the Dry Docks",
            imag: "http://www.playstationtrophies.org/images/trophies/398/64.jpg"
        },{
            game: "Battlefield 4",
            name: "Wolves in sheep's clothing",
            desc: "Complete the Shanghai mission in the Campaign",
            imag: "http://www.playstationtrophies.org/images/trophies/2235/454.jpg"
        },{
            game: "Call of Duty: Black Ops",
            name: "Down and Dirty (c)",
            desc: "Complete 'SOG' and 'The Defector' on Veteran difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/344/35.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Downed but Not Out",
            desc: "Kill 4 enemies in a row while downed in Special Ops.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/37.jpg"
        },{
            game: "Captain America: Super Soldier",
            name: "Send a Post Card",
            desc: "Completed 4th Chapter: Secret Journey",
            imag: "http://www.playstationtrophies.org/images/trophies/769/026.jpg"
        },{
            game: "Catherine",
            name: "Let My Sheep Go",
            desc: "Conquer Stage 3.",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/04.jpg"
        },{
            game: "God of War III",
            name: "Seeing things from a different perspective",
            desc: "Solve Hera's Gardens",
            imag: "http://www.playstationtrophies.org/images/trophies/319/002.jpg"
        },{
            game: "Gravity Rush",
            name: "Home Sweet Home",
            desc: "Completed episode 3",
            imag: "http://www.playstationtrophies.org/images/trophies/1392/06.jpg"
        },{
            game: "Hell Yeah! Wrath of the Dead",
            name: "Island master!",
            desc: "Open a gift sent from the Island \"When you're the Boss, you have 365 birthdays.\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1435/8A2.jpg"
        },{
            game: "LEGO Batman 2: DC Super Heroes (PS3)",
            name: "Down to Earth",
            desc: "Complete story level 10",
            imag: "http://www.playstationtrophies.org/images/trophies/1347/4EA.jpg"
        },{
            game: "LEGO Harry Potter: Years 1-4",
            name: "Chilled out",
            desc: "Freeze 20 characters using Glacius",
            imag: "http://www.playstationtrophies.org/images/trophies/331/26.jpg"
        },{
            game: "LEGO The Lord of the Rings",
            name: "The Lord of the Ring.",
            desc: "Complete the Bonus Level.",
            imag: "http://www.playstationtrophies.org/images/trophies/1535/772.jpg"
        },{
            game: "LEGO The Lord of the Rings (Vita)",
            name: "Hobbits really are amazing creatures.",
            desc: "Complete all the HUB mini games.",
            imag: "http://www.playstationtrophies.org/images/trophies/1784/131.jpg"
        },{
            game: "LittleBigPlanet 2",
            name: "Dancing On The Ceiling",
            desc: "Travel 17.5 metres on the walls and ceilings",
            imag: "http://www.playstationtrophies.org/images/trophies/533/65.jpg"
        },{
            game: "Mass Effect 3",
            name: "Legend",
            desc: "Mission accomplished.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/6CD.jpg"
        },{
            game: "Ratchet & Clank",
            name: "Hey, Over Here!",
            desc: "Lure an enemy into a forcefield on Orxon",
            imag: "http://www.playstationtrophies.org/images/trophies/1436/43E.jpg"
        },{
            game: "Ratchet & Clank: All 4 One",
            name: "Now That's a Big Fish",
            desc: "Defeat King Sepiad.",
            imag: "http://www.playstationtrophies.org/images/trophies/704/10.jpg"
        },{
            game: "Ratchet & Clank: Full Frontal Assault",
            name: "Ready for Armageddon",
            desc: "Upgrade all weapons to level 3. (Campaign)",
            imag: "http://www.playstationtrophies.org/images/trophies/1563/921.jpg"
        },{
            game: "Remember Me",
            name: "Lord of the ring",
            desc: "Beat 15 enemies by making them fall off a platform",
            imag: "http://www.playstationtrophies.org/images/trophies/1671/D2B.jpg"
        },{
            game: "Rocket League",
            name: "Far, Far Away...",
            desc: "Drive a total of 500 km",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/a34.jpg"
        },{
            game: "Rugby 15",
            name: "Serious Rugger",
            desc: "Win a match against an international team rated 90+, vs CPU (Hard)",
            imag: "http://www.playstationtrophies.org/images/trophies/3211/77b.jpg"
        },{
            game: "Rugby World Cup 2015",
            name: "Long Droppie",
            desc: " Score a drop goal from 40+ metres",
            imag: "http://www.playstationtrophies.org/images/trophies/3800/522.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Tourist",
            desc: "Win a bet on a cockfight.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/1AC.jpg"
        },{
            game: "Sly Cooper: Thieves in Time",
            name: "Cheers",
            desc: "Don't miss a single glass of sarsaparilla in Saloon Bug.",
            imag: "http://www.playstationtrophies.org/images/trophies/810/1C8.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Friends in Strange Places",
            desc: "You befriended both crab people and gnomes.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/9B2.jpg"
        },{
            game: "Sportsfriends",
            name: "Boxing-Day Test",
            desc: "Super Pole Riders - Play Kalgoorlie on Boxing Day (December 26)",
            imag: "http://www.playstationtrophies.org/images/trophies/2715/bb3.jpg"
        },{
            game: "The Walking Dead",
            name: "You Fight Like A Dairy Farmer",
            desc: "Complete chapter 7 of episode 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/18C.jpg"
        },{
            game: "Thomas Was Alone",
            name: "Defying Gravity",
            desc: "Find both trophy pickups in 'Invert'.",
            imag: "http://www.playstationtrophies.org/images/trophies/1947/7CB.jpg"
        },{
            game: "Uncharted: Golden Abyss",
            name: "The Conquistadors",
            desc: "Complete the Mystery.",
            imag: "http://www.playstationtrophies.org/images/trophies/1092/32.jpg"
        },{
            game: "Where the Wild Things Are",
            name: "Explore the Island",
            desc: "Complete Road to Nowhere",
            imag: "http://www.playstationtrophies.org/images/trophies/251/03.jpg"
        }]
    },{
        listName: "Reys' \"I'm Mr. Meeseeks\" List",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_reys.png",
        award: "http://i.imgur.com/F8z7PEU.png",
        trophies: [{
            game: "3D Dot Game Heroes",
            name: "Have a Nice Night?",
            desc: "Spent the night in Raejack with the princess.",
            imag: "http://www.playstationtrophies.org/images/trophies/365/22.jpg"
        },{
            game: "Assassin's Creed II",
            name: "Messer Sandman",
            desc: "Stun 4 guards at once by throwing sand in their face.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/24.jpg"
        },{
            game: "Borderlands",
            name: "Speedy McSpeederton",
            desc: "Raced around the Ludicrous Speedway in record time",
            imag: "http://www.playstationtrophies.org/images/trophies/39/13.jpg"
        },{
            game: "Burnout Paradise",
            name: "8 Players meet in the Wildcats' Baseball Stadium",
            desc: "Awarded for meeting up with 7 other players inside the Wildcats' Baseball Stadium in an online game",
            imag: "http://www.playstationtrophies.org/images/trophies/1/049.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Ghost",
            desc: "Plant the C4 in 'Cliffhanger' without alerting or injuring anyone in the blizzard.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/24.jpg"
        },{
            game: "Disgaea 3",
            name: "ABC's of Hitting",
            desc: "Get hit by ABC Gum.",
            imag: "http://www.playstationtrophies.org/images/trophies/178/1.jpg"
        },{
            game: "UP",
            name: "Beginner's Wings",
            desc: "Access the Multiplayer game menu.",
            imag: "http://www.playstationtrophies.org/images/trophies/140/43.jpg"
        },{
            game: "Eat Lead: The Return of Matt Hazard",
            name: "Disco is Dead",
            desc: "Defeat Sonny Tang. \"Sonny, YOUR ass is kicked!\"",
            imag: "http://www.playstationtrophies.org/images/trophies/93/031.jpg"
        },{
            game: "Feeding Frenzy 2: Shipwreck Showdown",
            name: "Barracuda Bully",
            desc: "Awarded for biting a Barracuda's tail four times",
            imag: "http://www.playstationtrophies.org/images/trophies/453/03.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "Fed The Fish",
            desc: "You completed the mission 'Uncle Vlad'.",
            imag: "http://www.playstationtrophies.org/images/trophies/33/020.jpg"
        },{
            game: "inFAMOUS: Festival of Blood",
            name: "Count Dra-Cole-a",
            desc: "Unlock all powers.",
            imag: "http://www.playstationtrophies.org/images/trophies/1181/04.jpg"
        },{
            game: "Jetpack Joyride",
            name: "For Science",
            desc: "Knock over 1000 Scientists",
            imag: "http://www.playstationtrophies.org/images/trophies/1819/5FA.jpg"
        },{
            game: "L.A. Noire",
            name: "Asphalt Jungle",
            desc: "Chase down and tackle a fleeing suspect on foot as an LAPD Detective.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/15.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Play",
            desc: "Complete all story levels without dying, with the exception of those levels that only end when you die",
            imag: "http://www.playstationtrophies.org/images/trophies/14/41.jpg"
        },{
            game: "Mafia II",
            name: "A Lesson in Manners",
            desc: "Show that you know how to treat a lady.",
            imag: "http://www.playstationtrophies.org/images/trophies/351/44.jpg"
        },{
            game: "Need for Speed: Most Wanted",
            name: "White Gold",
            desc: "Shut down Most Wanted car number 3: Bugatti Veyron Super Sport (Single Player)",
            imag: "http://www.playstationtrophies.org/images/trophies/1579/13A.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Cake, please!",
            desc: "Complete Arcade Mode with Fat Princess",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/9B4.jpg"
        },{
            game: "Prince of Persia The Forgotten Sands",
            name: "Not how it Happened",
            desc: "Use the Power of Time 20 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/360/02.jpg"
        },{
            game: "Quantum of Solace",
            name: "From Russia With Love",
            desc: "Complete Siena, Opera House, and Sink Hole.",
            imag: "http://www.playstationtrophies.org/images/trophies/29/025.jpg"
        },{
            game: "Red Dead Redemption",
            name: "The Gunslinger",
            desc: "Score a headshot on any enemy using Expert targeting mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/27.jpg"
        },{
            game: "Rock Band 2",
            name: "The Bladder of Steel Award",
            desc: "Completed the Endless Setlist 2 without pausing or failing",
            imag: "http://www.playstationtrophies.org/images/trophies/24/014.jpg"
        },{
            game: "Shatter",
            name: "Shardenfreude",
            desc: "Collect 95% of all fragments on any wave.",
            imag: "http://www.playstationtrophies.org/images/trophies/179/13.jpg"
        },{
            game: "SEGA MEGA DRIVE Ultimate Collection",
            name: "A Different Tail",
            desc: "Sonic 3: Collect 100 rings with Tails anywhere on Angel Island Zone",
            imag: "http://www.playstationtrophies.org/images/trophies/85/022.jpg"
        },{
            game: "Skate 2",
            name: "Juggling Chainsaws",
            desc: "Wipeout at high speed in career mode",
            imag: "http://www.playstationtrophies.org/images/trophies/79/032.jpg"
        },{
            game: "Sly Cooper and the Thievius Raccoonus",
            name: "Frog Legs",
            desc: "Defeat Sir Raleigh the Frog",
            imag: "http://www.playstationtrophies.org/images/trophies/612/22.jpg"
        },{
            game: "Skyrim",
            name: "With Friends Like These...",
            desc: "Join the Dark Brotherhood",
            imag: "http://www.playstationtrophies.org/images/trophies/826/19.jpg"
        },{
            game: "The Godfather II",
            name: "Bank Job",
            desc: "Heist your first bank.",
            imag: "http://www.playstationtrophies.org/images/trophies/50/022.jpg"
        },{
            game: "The Walking Dead",
            name: "Everything's Going to be Okay",
            desc: "Complete Episode 1: \"A New Day\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/3CE.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "First Treasure (1)",
            desc: "Find 1 treasure",
            imag: "http://www.playstationtrophies.org/images/trophies/8/1.jpg"
        },{
            game: "Warhawk",
            name: "Hat Trick",
            desc: "Get three flag captures in a single round of CTF.",
            imag: "http://www.playstationtrophies.org/images/trophies/9/6.jpg"
        },{
            game: "WWE SmackDown vs. RAW 2010",
            name: "Check Out the New Threads",
            desc: "Create ALTERNATE ATTIRE for a CREATED SUPERSTAR and new THREADS for a WWE SUPERSTAR.",
            imag: "http://www.playstationtrophies.org/images/trophies/235/16.jpg"
        }]
    },{
        listName: "Sav's: For the Love of Platinum",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_sav.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_sav64.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Show your Colors",
            desc: "Wear the Auditore cape in each city.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/38.jpg"
        },{
            game: "Assassin's Creed Syndicate",
            name: "Mentor",
            desc: "Reach 100% Sync in the Main Memories",
            imag: "http://www.playstationtrophies.org/images/trophies/3634/9cb.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Flawless Freeflow Fighter",
            desc: "Complete one combat challenge without taking damage",
            imag: "http://www.playstationtrophies.org/images/trophies/192/38.jpg"
        },{
            game: "Beyond: Two Souls",
            name: "Houdini",
            desc: "Got arrested three times and escaped each time.",
            imag: "http://www.playstationtrophies.org/images/trophies/1585/353.jpg"
        },{
            game: "Borderlands",
            name: "My Brother is an Italian Plumber",
            desc: "Killed an enemy plumber-style",
            imag: "http://www.playstationtrophies.org/images/trophies/39/06.jpg"
        },{
            game: "Dante's Inferno",
            name: "Poetry in Motion",
            desc: "Perform a 666 hit combo",
            imag: "http://www.playstationtrophies.org/images/trophies/322/28.jpg"
        },{
            game: "Dead Space",
            name: "Don't get cocky, kid",
            desc: "Survive the ADS Canon with over 50% Shield strength remaining",
            imag: "http://www.playstationtrophies.org/images/trophies/26/032.jpg"
        },{
            game: "ENSLAVED: Odyssey to the West",
            name: "Tech Curator",
            desc: "Collect all Tech Orbs",
            imag: "http://www.playstationtrophies.org/images/trophies/488/49.jpg"
        },{
            game: "Fallout 4",
            name: "Benevolent Leader",
            desc: "Reach Maximum Happiness in a Large Settlement",
            imag: "http://www.playstationtrophies.org/images/trophies/2430/ad6.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "Gobble Gobble",
            desc: "You got a turkey in 10-pin bowling.",
            imag: "http://www.playstationtrophies.org/images/trophies/33/008.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "Close Shave (g)",
            desc: "Complete all Under the Bridge and Knife Flight challenges.",
            imag: "http://www.playstationtrophies.org/images/trophies/687/883.jpg"
        },{
            game: "Grand Theft Auto 3",
            name: "Is That All You've Got?",
            desc: "Achieve 100% completion.",
            imag: "http://www.playstationtrophies.org/images/trophies/4198/eb7.jpg"
        },{
            game: "HEAVY RAIN",
            name: "All Endings",
            desc: "See all endings",
            imag: "http://www.playstationtrophies.org/images/trophies/321/57.jpg"
        },{
            game: "Hitman 2: Silent Assassin",
            name: "All Firearms collected",
            desc: "All Firearms collected and displayed in Hideout",
            imag: "http://www.playstationtrophies.org/images/trophies/1770/410.jpg"
        },{
            game: "Hitman GO: Definitive Edition",
            name: "Silent Assassin",
            desc: "Complete all objectives of all chapters without using a single hint",
            imag: "http://www.playstationtrophies.org/images/trophies/4385/435.jpg"
        },{
            game: "James Bond 007: Blood Stone",
            name: "No Claims Bonus",
            desc: "Drive to the bridge in the epilogue level without hitting any other vehicles",
            imag: "http://www.playstationtrophies.org/images/trophies/666/36.jpg"
        },{
            game: "Just Cause 2",
            name: "Trying Everything Once",
            desc: "Drive all 104 vehicles.",
            imag: "http://www.playstationtrophies.org/images/trophies/329/01.jpg"
        },{
            game: "L.A. Noire",
            name: "Roscoe And Friends",
            desc: "Kill at least one bad guy with every gun.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/29.jpg"
        },{
            game: "Mafia II",
            name: "One Careful Owner",
            desc: "Travel a total of 50 miles in one vehicle.",
            imag: "http://www.playstationtrophies.org/images/trophies/351/27.jpg"
        },{
            game: "Mass Effect 2",
            name: "No One Left Behind",
            desc: "Keep your team alive through the suicide mission",
            imag: "http://www.playstationtrophies.org/images/trophies/703/29.jpg"
        },{
            game: "Metal Gear Solid 2",
            name: "Johnny on the Spot",
            desc: "Hear Johnny's bowel noises in two locations",
            imag: "http://www.playstationtrophies.org/images/trophies/1053/16.jpg"
        },{
            game: "Mirror's Edge",
            name: "Test of Faith",
            desc: "Complete the game without shooting an enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/43/039.jpg"
        },{
            game: "Portal 2",
            name: "Schrodinger's Catch",
            desc: "Catch a blue-painted box before it touches the ground",
            imag: "http://www.playstationtrophies.org/images/trophies/610/25.jpg"
        },{
            game: "Prince of Persia",
            name: "Light Seeds Master",
            desc: "Collect 1001 Light Seeds.",
            imag: "http://www.playstationtrophies.org/images/trophies/59/036.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Dastardly",
            desc: "Place a hogtied woman on the train tracks, and witness her death by train.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/30.jpg"
        },{
            game: "Resident Evil 5",
            name: "Lead Aspirin",
            desc: "Defeat a Majini with a headshot while it's jumping.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/037.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Mr. Nice Guy",
            desc: "Complete all Favors",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/573.jpg"
        },{
            game: "Sniper Elite V2",
            name: "Get Off the ground",
            desc: "Kill everyone in the convoy from ground level, except for Kreidl",
            imag: "http://www.playstationtrophies.org/images/trophies/988/10E.jpg"
        },{
            game: "Skyrim",
            name: "Master Criminal",
            desc: "Bounty of 1000 gold in all nine holds",
            imag: "http://www.playstationtrophies.org/images/trophies/826/36.jpg"
        },{
            game: "The Godfather II",
            name: "Accept This As A Gift",
            desc: "Earn one of each favour.",
            imag: "http://www.playstationtrophies.org/images/trophies/50/040.jpg"
        },{
            game: "The Last of Us",
            name: "That's all I got",
            desc: "Survive all of Ellie's jokes",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/4F4.jpg"
        },{
            game: "The Saboteur",
            name: "Guerilla Warfare",
            desc: "You completed 425 ambient freeplay in the countryside",
            imag: "http://www.playstationtrophies.org/images/trophies/298/39.jpg"
        },{
            game: "Tomb Raider",
            name: "Chatterbox (t)",
            desc: "Complete all conversations with the Endurance crew.",
            imag: "http://www.playstationtrophies.org/images/trophies/831/83D.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Steel Fist Expert (u)",
            desc: "Defeat ten enemies in a row with a single punch, after softening them up with gunfire",
            imag: "http://www.playstationtrophies.org/images/trophies/214/41.jpg"
        },{
            game: "Volume",
            name: "Lore of the Things",
            desc: "Read 100% of the text in the core levels",
            imag: "http://www.playstationtrophies.org/images/trophies/2351/d44.jpg"
        }]
    },{
        listName: "Sellers' Sneaky Souls Collection",
        banner: "http://i.imgur.com/RScmi7U.png",
        award: "http://i.imgur.com/Y6ZOxb2.jpg",
        trophies: [
            {
                game: "Assassin's Creed Syndicate",
                name: "Phantom",
                desc: "Learn every Stealth Skill as Evie",
                imag: "http://www.playstationtrophies.org/images/trophies/3634/22d.jpg"
            },{
                game: "Assassin's Creed Chronicles: China",
                name: "The Invisible Woman",
                desc: "Shadow Gold past 30 patrols.",
                imag: "http://www.playstationtrophies.org/images/trophies/3524/478.jpg"
            },{
                game: "Bloodborne",
                name: "Shadow of Yharnam",
                desc: "Defeat the Shadow of Yharnam.",
                imag: "http://www.playstationtrophies.org/images/trophies/2840/3ce.jpg"
            },{
                game: "Darksiders II",
                name: "Soul Crushing",
                desc: "Defeat The Wailing Host",
                imag: "http://www.playstationtrophies.org/images/trophies/614/205.jpg"
            },{
                game: "Dark Souls",
                name: "Defeat the Four Kings",
                desc: "Defeat the Four Kings, inheritors of souls.",
                imag: "http://www.playstationtrophies.org/images/trophies/755/38.jpg"
            },{
                game: "Dark Souls II",
                name: "This is Dark Souls",
                desc: "Die for the first time",
                imag: "http://www.playstationtrophies.org/images/trophies/1838/5b9.jpg"
            },{
                game: "Dark Souls III",
                name: "Lords of Cinder: Abyss Watchers",
                desc: "Defeat the Abyss Watchers, Lords of Cinder.",
                imag: "http://www.playstationtrophies.org/images/trophies/3720/a9e.jpg"
            },{
                game: "Demon's Souls",
                name: "Dragon God's Trophy",
                desc: "Slayer of Demon \"Dragon God\"",
                imag: "http://www.playstationtrophies.org/images/trophies/150/11.jpg"
            },{
                game: "Deus Ex: Human Revolution",
                name: "Ghost (d)",
                desc: "You made it through an entire hostile area without so much as a squeak.",
                imag: "http://www.playstationtrophies.org/images/trophies/2341/887.jpg"
            },{
                game: "Deus Ex: Mankind Divided",
                name: "Foxiest of the Hounds",
                desc: "You triggered zero alarms during an entire playthrough.",
                imag: "http://www.playstationtrophies.org/images/trophies/2308/6ba.jpg"
            },{
                game: "Fallout 4",
                name: "Prankster's Return",
                desc: "Placed A Grenade Or Mine While Pickpocketing",
                imag: "http://www.playstationtrophies.org/images/trophies/2430/896.jpg"
            },{
                game: "Far Cry 3",
                name: "Unheard",
                desc: "Liberate an outpost without triggering an alarm.",
                imag: "http://www.playstationtrophies.org/images/trophies/922/3BB.jpg"
            },{
                game: "Far Cry 4",
                name: "Tread Lightly",
                desc: "Liberate any Outpost without triggering an alarm in any mode (Campaign only).",
                imag: "http://www.playstationtrophies.org/images/trophies/2777/4ac.jpg"
            },{
                game: "God of War III",
                name: "Souled Out",
                desc: "Summon every Soul with the Claws of Hades",
                imag: "http://www.playstationtrophies.org/images/trophies/319/001.jpg"
            },{
                game: "Kingdom Hearts Final Mix HD",
                name: "Honest Soul",
                desc: "Escape from Monstro",
                imag: "http://www.playstationtrophies.org/images/trophies/1939/9ED.jpg"
            },{
                game: "Metal Gear Solid 3",
                name: "A Good Man Is Hard to Find",
                desc: "Achieve a camouflage index of 100%",
                imag: "http://www.playstationtrophies.org/images/trophies/1054/29.jpg"
            },{
                game: "METAL GEAR SOLID V: THE PHANTOM PAIN",
                name: "Interrogation",
                desc: "Interrogate an enemy soldier.",
                imag: "http://www.playstationtrophies.org/images/trophies/1704/05b.jpg"
            },{
                game: "Metro 2033 Redux",
                name: "Invisible man",
                desc: "Complete FRONTLINE level without killing anyone.",
                imag: "http://www.playstationtrophies.org/images/trophies/2938/13.png"
            },{
                game: "Metro: Last Light",
                name: "Invisible Intruder",
                desc: "Complete the SEPARATION level without killing or raising alarm.",
                imag: "http://www.playstationtrophies.org/images/trophies/2939/13.png"
            },{
                game: "Oddworld: New 'n' Tasty",
                name: "Escape Fartist",
                desc: "Escape from RuptureFarms without Abe being spotted by any Slig",
                imag: "http://www.playstationtrophies.org/images/trophies/902/b92.jpg"
            },{
                game: "Resident Evil",
                name: "CQC FTW",
                desc: "Finish the game using only your knife (no lighter, Defensive Items, and stomping zombie heads).",
                imag: "http://www.playstationtrophies.org/images/trophies/2957/cbc.jpg"
            },{
                game: "Resident Evil 4",
                name: "A Terrifying Assassin",
                desc: "Turn the tables on Verdugo, the right hand of Salazar.",
                imag: "http://www.playstationtrophies.org/images/trophies/4788/8dd.jpg"
            },{
                game: "Resident Evil: Revelations 2",
                name: "From the Shadows",
                desc: "Defeat 20 enemies with stealth attacks in the main campaign.",
                imag: "http://www.playstationtrophies.org/images/trophies/3035/bd9.jpg"
            },{
                game: "SOULCALIBUR II HD ONLINE",
                name: "Soul-Consuming Sword",
                desc: "Acquired Complete Soul Edge in Weapon Master",
                imag: "http://www.playstationtrophies.org/images/trophies/2190/83D.jpg"
            },{
                game: "Skyrim",
                name: "Dragon Soul",
                desc: "Absorb a dragon soul",
                imag: "http://www.playstationtrophies.org/images/trophies/826/44.jpg"
            },{
                game: "The Last of Us",
                name: "Master of Unlocking",
                desc: "Unlock all shiv doors",
                imag: "http://www.playstationtrophies.org/images/trophies/1317/0B9.jpg"
            },{
                game: "Tomb Raider",
                name: "Opportunist",
                desc: "Kill 25 unaware enemies.",
                imag: "http://www.playstationtrophies.org/images/trophies/2439/57F.jpg"
            },{
                game: "Uncharted 2: Among Thieves",
                name: "Master Ninja",
                desc: "Defeat 50 enemies with stealth attacks",
                imag: "http://www.playstationtrophies.org/images/trophies/214/40.jpg"
            },{
                game: "Uncharted 4: A Thief's End",
                name: "Shh Sleep Now",
                desc: "Stealth take-down 30 enemies",
                imag: "http://www.playstationtrophies.org/images/trophies/2388/6d2.jpg"
            },{
                game: "Volume",
                name: "Ghost from the...",
                desc: "Fire 40 figments in core levels",
                imag: "http://www.playstationtrophies.org/images/trophies/2351/4d8.jpg"
            }
        ]
    },{
        listName: "Shadow's \"Box of Variety\"",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_shadow.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_shadow64.png",
        trophies: [{
            game: "3D Dot Game Heroes",
            name: "Flawless Hero!",
            desc: "Cleared the game without dying.",
            imag: "http://www.playstationtrophies.org/images/trophies/573/E93.jpg"
        },{
            game: "Alpha Protocol",
            name: "Antisocial",
            desc: "Get 3 people to hate you (who must all hate you at the same time).",
            imag: "http://www.playstationtrophies.org/images/trophies/51/38.jpg"
        },{
            game: "Borderlands",
            name: "12 Days of Pandora",
            desc: "Mastered the technology of Pandora.",
            imag: "http://www.playstationtrophies.org/images/trophies/39/09.jpg"
        },{
            game: "Burnout Paradise",
            name: "Smash 60 Burnout Billboards",
            desc: "Awarded when you smash through your 60th pristine Burnout Billboard",
            imag: "http://www.playstationtrophies.org/images/trophies/1/007.jpg"
        },{
            game: "Catherine",
            name: "Text Junkie",
            desc: "Reply to at least 20 text messages by the end of the final day.",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/27.jpg"
        },{
            game: "Dark Souls",
            name: "Rite of Kindling",
            desc: "Acquire the Rite of Kindling.",
            imag: "http://www.playstationtrophies.org/images/trophies/755/32.jpg"
        },{
            game: "Dead Space 2",
            name: "Looking good",
            desc: "Purchase the Advanced Suit.",
            imag: "http://www.playstationtrophies.org/images/trophies/355/27.jpg"
        },{
            game: "Deus Ex: Human Revolution",
            name: "Balls",
            desc: "Seems you like playing with balls, eh?",
            imag: "http://www.playstationtrophies.org/images/trophies/450/50.jpg"
        },{
            game: "Dynasty Warriors 7",
            name: "OK, you can pursue Lu Bu",
            desc: "Defeated Lu Bu for the first time.",
            imag: "http://www.playstationtrophies.org/images/trophies/792/50.jpg"
        },{
            game: "Fallout 3",
            name: "The Bigger They Are...",
            desc: "Kill all the Super Mutant Behemoths",
            imag: "http://www.playstationtrophies.org/images/trophies/70/048.jpg"
        },{
            game: "Fallout 4",
            name: "The First Step",
            desc: "Join the Minutemen",
            imag: "http://www.playstationtrophies.org/images/trophies/2430/6b2.jpg"
        },{
            game: "FIFA 12",
            name: "Procrastinator",
            desc: "Sign a player on Deadline Day in the transfer window in Career Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/972/38.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "One Man Army (g)",
            desc: "You survived a 6 star wanted level for a full 5 minutes.",
            imag: "http://www.playstationtrophies.org/images/trophies/33/015.jpg"
        },{
            game: "Guacamelee!",
            name: "Boom-Shack-Calaca",
            desc: "Defeat Calaca",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/972.jpg"
        },{
            game: "Jet Set Radio",
            name: "The gangs all here",
            desc: "Unlock all characters",
            imag: "http://www.playstationtrophies.org/images/trophies/1411/062.jpg"
        },{
            game: "Kingdoms of Amalur: Reckoning",
            name: "Would You Like Fries with that?",
            desc: "Landed 100 complete attack chains.",
            imag: "http://www.playstationtrophies.org/images/trophies/669/DAA.jpg"
        },{
            game: "Metro: Last Light",
            name: "Tortoise",
            desc: "Make 10 Spiders flip belly-up.",
            imag: "http://www.playstationtrophies.org/images/trophies/1046/C9D.jpg"
        },{
            game: "NIER",
            name: "The Sheep Whisperer",
            desc: "You killed 100 sheep",
            imag: "http://www.playstationtrophies.org/images/trophies/379/30.jpg"
        },{
            game: "Pinball Arcade",
            name: "Black Hole High 5",
            desc: "Achieve a top 5 local high score on Black Hole™",
            imag: "http://www.playstationtrophies.org/images/trophies/1496/EDC.jpg"
        },{
            game: "Plants vs Zombies: Garden Warfare 2",
            name: "It's My Island",
            desc: "Reach the boss wave using the Flag of Power in the Backyard Battleground.",
            imag: "http://www.playstationtrophies.org/images/trophies/3721/b8a.jpg"
        },{
            game: "Rayman Origins",
            name: "Dr. Lividstone, I presume?",
            desc: "You found ALL hidden cages.",
            imag: "http://www.playstationtrophies.org/images/trophies/651/10.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Fightin' Around the World",
            desc: "Knock someone out in melee in every saloon in the game in Single Player.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/16.jpg"
        },{
            game: "Shadows of the Damned",
            name: "That's So Hot!",
            desc: "Defeat 20 enemies with the HOTBONER",
            imag: "http://www.playstationtrophies.org/images/trophies/748/38.jpg"
        },{
            game: "Sleeping Dogs",
            name: "A Slap in the Face",
            desc: "Kill someone with a fish.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/0EB.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "A Line, Crossed",
            desc: "Choose vengeance.",
            imag: "http://www.playstationtrophies.org/images/trophies/613/D99.jpg"
        },{
            game: "Star Ocean: The Last Hope International",
            name: "Rookie Battler",
            desc: "Obtain 15% of all battle trophies.",
            imag: "http://www.playstationtrophies.org/images/trophies/328/02.jpg"
        },{
            game: "The Walking Dead",
            name: "Too Much Salt Will Kill You",
            desc: "Complete chapter 5 of episode 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/2C4.jpg"
        },{
            game: "The Witcher 3: Wild Hunt",
            name: "Lilac and Gooseberries",
            desc: "Find Yennefer of Vengerberg.",
            imag: "http://www.playstationtrophies.org/images/trophies/1904/9e5.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Master Ninja",
            desc: "Defeat 50 enemies with stealth attacks.",
            imag: "http://www.playstationtrophies.org/images/trophies/214/40.jpg"
        },{
            game: "Until Dawn",
            name: "This is THE End",
            desc: "Nobody survived until dawn",
            imag: "http://www.playstationtrophies.org/images/trophies/1672/512.jpg"
        },{
            game: "Virtue's Last Reward",
            name: "Fire and Ice",
            desc: "Saw the end. Or maybe the beginning?",
            imag: "http://www.playstationtrophies.org/images/trophies/1773/701.jpg"
        },{
            game: "WipEout HD",
            name: "Thanks for the Memory",
            desc: "Win a Campaign, Racebox or Online race using each HUD style variation.",
            imag: "http://www.playstationtrophies.org/images/trophies/21/016.jpg"
        },{
            game: "XCOM: Enemy Unknown",
            name: "As A Scalpel",
            desc: "Earn the \"Excellent\" rating in every performance category on a terror mission.",
            imag: "http://www.playstationtrophies.org/images/trophies/1350/817.jpg"
        },{
            game: "Yakuza 4",
            name: "Indomitable",
            desc: "Clear Normal Mode without reverting to Easy Mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/586/11.jpg"
        },{
            game: "Yakuza 5",
            name: "Veteran Driver",
            desc: "Completed 10 taxi missions",
            imag: "http://www.playstationtrophies.org/images/trophies/1835/B7F.jpg"
        }]
    },{
        listName: "Slamma's Super Sexy and Sensually Seductive Selection",
        banner: "http://i.imgur.com/ahw8CJQ.jpg",
        award: "http://i.imgur.com/XsHZSXe.jpg",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Red Light Addict",
            desc: "Spend 5000 florins on Courtesans.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/49.jpg"
        },{
            game: "Back to the Future: The Game",
            name: "Seven Minutes in Heaven",
            desc: "Got caught making out with Jennifer. :pps3:",
            imag: "http://www.playstationtrophies.org/images/trophies/840/04.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Family Jewels",
            desc: "Retrieve your stolen goods ",
            imag: "http://www.playstationtrophies.org/images/trophies/398/55.jpg"
        },{
            game: "Bayonetta",
            name: "You Want To Touch Me?",
            desc: "Engage Witch Time successfully 10 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/24.jpg"
        },{
            game: "BioShock",
            name: "Brass Balls",
            desc: "Complete the game on Hard difficulty without using a Vita-Chamber",
            imag: "http://www.playstationtrophies.org/images/trophies/23/51.jpg"
        },{
            game: "Brütal Legend",
            name: "Thick as a Baby's Arm",
            desc: "Completed 'Lair of the Metal Queen'",
            imag: "http://www.playstationtrophies.org/images/trophies/196/03.jpg"
        },{
            game: "Call of Duty Classic",
            name: "Pea Shooter",
            desc: "Complete a mission using only a pistol and no melee attacks.",
            imag: "http://www.playstationtrophies.org/images/trophies/277/36.jpg"
        },{
            game: "Call of Duty: Modern Warfare 3",
            name: "Ménage à Trois",
            desc: "Destroy 3 tanks with a single 105mm shot in 'Iron Lady.' ",
            imag: "http://www.playstationtrophies.org/images/trophies/422/36.jpg"
        },{
            game: "Dragon Age: Origins",
            name: "Easy Lover",
            desc: "Experienced the thrill of romance with Zevran",
            imag: "http://www.playstationtrophies.org/images/trophies/270/38.jpg"
        },{
            game: "Duke Nukem Forever",
            name: "Beating the One-Eyed Worm",
            desc: "Defeat the Leech",
            imag: "http://www.playstationtrophies.org/images/trophies/730/46.jpg"
        },{
            game: "Fat Princess",
            name: "Got wood?",
            desc: "Deliver 15 resources of wood or metal to the team's stockpile in online games",
            imag: "http://www.playstationtrophies.org/images/trophies/182/02.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "Just the Tip",
            desc: "Kill a Dragon with the Bow",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/AFD.jpg"
        },{
            game: "God of War II",
            name: "Blowin' Your Wad",
            desc: "Max out all Weapons and Magic",
            imag: "http://www.playstationtrophies.org/images/trophies/264/2.jpg"
        },{
            game: "God of War III",
            name: "Are You Horny to Win?",
            desc: "Collect all of the Minotaur Horns",
            imag: "http://www.playstationtrophies.org/images/trophies/319/002.jpg"
        },{
            game: "Grand Theft Auto IV",
            name: "Warm Coffee",
            desc: "You were invited into your girlfriend's house.",
            imag: "http://www.playstationtrophies.org/images/trophies/33/023.jpg"
        },{
            game: "Guacamelee!",
            name: "Cock of the Walk",
            desc: "Defeat an enemy as a chicken",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/848.jpg"
        },{
            game: "Hatoful Boyfriend",
            name: "A Pudding Odyssey",
            desc: "Get Okosan full ending (ED no.07)",
            imag: "http://www.playstationtrophies.org/images/trophies/3230/663.jpg"
        },{
            game: "Hotline Miami",
            name: "Always On Top",
            desc: "Perform every ground kill in the game",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/F87.jpg"
        },{
            game: "Jurassic Park: The Cavalry",
            name: "You Must Be This Tall to Ride",
            desc: "Find the Mr. DNA sign. ",
            imag: "http://www.playstationtrophies.org/images/trophies/1278/8DD.jpg"
        },{
            game: "Prince of Persia",
            name: "Be gentle with her",
            desc: "Elika saves you fewer than 100 times in the whole game.",
            imag: "http://www.playstationtrophies.org/images/trophies/59/016.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Bearly Legal",
            desc: "Kill and skin 18 grizzly bears.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/23.jpg"
        },{
            game: "Sam & Max: Beyond Time and Space - Episode 1: Ice Station Santa",
            name: "My Package!",
            desc: "Obtain the Horseman of Famine from Bosco. ",
            imag: "http://www.playstationtrophies.org/images/trophies/1226/04.jpg"
        },{
            game: "Sam & Max: The Devil's Playhouse - Episode 5: The City That Dares Not Sleep",
            name: "The Happy Ending",
            desc: "Discovered a last-minute way to save Max",
            imag: "http://www.playstationtrophies.org/images/trophies/717/05.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Gotta Break Em In",
            desc: "Complete 'The Ho Boat'. ",
            imag: "http://www.playstationtrophies.org/images/trophies/746/07.jpg"
        },{
            game: "Sly Cooper: Thieves in Time",
            name: "Hubba Hubba",
            desc: "Don't miss a beat in the Carmelita dance game.",
            imag: "http://www.playstationtrophies.org/images/trophies/810/E3F.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Two Girls, One Stick",
            desc: "You defeated Princess Kenny in your girl makeover disguise.",
            imag: "http://www.playstationtrophies.org/images/trophies/4715/8b6.jpg"
        },{
            game: "STAR WARS Battlefront",
            name: "Judge me by my size, do you?",
            desc: "Reach Rank 25",
            imag: "http://www.playstationtrophies.org/images/trophies/2097/d29.jpg"
        },{
            game: "The Saboteur",
            name: "Pint and a Shag",
            desc: "You got lucky with Skylar.",
            imag: "http://www.playstationtrophies.org/images/trophies/298/26.jpg"
        },{
            game: "Tomb Raider",
            name: "Down and Dirty (t)",
            desc: "Perform 15 finishers.",
            imag: "http://www.playstationtrophies.org/images/trophies/831/84A.jpg"
        },{
            game: "Transistor",
            name: "Reveal()",
            desc: "Inspect all completed Function Files.",
            imag: "http://www.playstationtrophies.org/images/trophies/2113/cdb.jpg"
        }]
    },{
        listName: "Sylar's Super List",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_sylar.png",
        award: "http://i.imgur.com/wwthqeC.png",
        trophies: [{
            game: "Assassin's Creed III Liberation",
            name: "Machete",
            desc: "Kill 5 guards in 15 seconds using only the Sugarcane Machete (without using the Chain Kill).",
            imag: "http://www.playstationtrophies.org/images/trophies/2277/e63.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Poisoned Ivy",
            desc: "Defeat the giant Titan Ivy plant",
            imag: "http://www.playstationtrophies.org/images/trophies/192/15.jpg"
        },{
            game: "Batman: Arkham City",
            name: "I'm Batman",
            desc: "Become the Bat",
            imag: "http://www.playstationtrophies.org/images/trophies/398/02.jpg"
        },{
            game: "Batman: Arkham Origins",
            name: "Silent Knight",
            desc: "Complete a predator encounter using only silent takedowns",
            imag: "http://www.playstationtrophies.org/images/trophies/2009/9A0.jpg"
        },{
            game: "Batman: Arkham Origins Blackgate",
            name: "LEAGUE OF SHADOWS",
            desc: "Get a 100 hit combo",
            imag: "http://www.playstationtrophies.org/images/trophies/2008/AA8.jpg"
        },{
            game: "Borderlands 2",
            name: "Dragon Slayer",
            desc: "Completed the mission \"Best Minion Ever\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/7E2.jpg"
        },{
            game: "Borderlands: The Pre-Sequel",
            name: "No, I'm Athena!",
            desc: "Killed 100 enemies with the Aspis.",
            imag: "http://www.playstationtrophies.org/images/trophies/2667/cd5.jpg"
        },{
            game: "Captain America: Super Soldier",
            name: "Star Spangled Superhero",
            desc: "25000 Intel Points collected",
            imag: "http://www.playstationtrophies.org/images/trophies/769/ACB.jpg"
        },{
            game: "Darksiders",
            name: "Don't Make Me Angry",
            desc: "Collect the Chaos Form Ability",
            imag: "http://www.playstationtrophies.org/images/trophies/276/30.jpg"
        },{
            game: "Game Of Thrones",
            name: "Hear me roar",
            desc: "Finish chapter 4",
            imag: "http://www.playstationtrophies.org/images/trophies/1565/8F8.jpg"
        },{
            game: "God of War: Ascension",
            name: "Blind Justice",
            desc: "Use the Eyes of Truth successfully",
            imag: "http://www.playstationtrophies.org/images/trophies/1345/2A2.jpg"
        },{
            game: "Green Lantern: Rise of the Manhunters",
            name: "Emerald Knight",
            desc: "Clear all missions on Emerald Knight difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/679/14.jpg"
        },{
            game: "inFAMOUS 2",
            name: "With Great Power Comes Greater Power",
            desc: "Unlock and purchase all powers.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/04.jpg"
        },{
            game: "Iron Man 2",
            name: "Two Man Army",
            desc: "Defeat the Russian separatists as both Iron Man and War Machine.",
            imag: "http://www.playstationtrophies.org/images/trophies/404/47.jpg"
        },{
            game: "LEGO Batman 2: DC Super Heroes (PS3)",
            name: "Dynamic Duo",
            desc: "Play a level in co-op",
            imag: "http://www.playstationtrophies.org/images/trophies/1347/521.jpg"
        },{
            game: "LEGO Batman 2: DC Super Heroes (Vita)",
            name: "Justice League, Assemble!",
            desc: "Complete The Final Battle.",
            imag: "http://www.playstationtrophies.org/images/trophies/1511/907.jpg"
        },{
            game: "LEGO Jurassic World",
            name: "One Big Pile of Bricks",
            desc: "Collect All Red Bricks.",
            imag: "http://www.playstationtrophies.org/images/trophies/3376/937.jpg"
        },{
            game: "LEGO Marvel Super Heroes",
            name: "Sinister Six",
            desc: "Collect Doc Ock, Sandman, Mysterio, Kraven the Hunter, Electro and Vulture (Single Player)",
            imag: "http://www.playstationtrophies.org/images/trophies/1875/78D.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Intergalactic Heroes",
            desc: "Complete Arcade Mode with Ratchet",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/D8C.jpg"
        },{
            game: "Ratchet & Clank",
            name: "These are not the droids you're looking for...",
            desc: "Obtain the Persuader",
            imag: "http://www.playstationtrophies.org/images/trophies/1436/222.jpg"
        },{
            game: "Saints Row IV",
            name: "Where's My Cape?",
            desc: "Purchase all Super Power upgrades",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/5E0.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Karaoke Superstar",
            desc: "Achieving 90% and above for all songs at the Karaoke Bars in HK.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/58B.jpg"
        },{
            game: "Spider-Man: Edge of Time",
            name: "Super-Suited Swinger",
            desc: "Obtain all Alternate Suits",
            imag: "http://www.playstationtrophies.org/images/trophies/978/34.jpg"
        },{
            game: "STAR WARS Battlefront",
            name: "Stay on target",
            desc: "Kill 10 enemies in a match of Fighter Squadron.",
            imag: "http://www.playstationtrophies.org/images/trophies/2097/01d.jpg"
        },{
            game: "Star Wars: Bounty Hunter",
            name: "Target Acquired",
            desc: "Mark and claim your first bounty.",
            imag: "http://www.playstationtrophies.org/images/trophies/4125/aa0.jpg"
        },{
            game: "Star Wars: Jedi Starfighter",
            name: "Wingman",
            desc: "Complete a mission using cooperative play.",
            imag: "http://www.playstationtrophies.org/images/trophies/4126/acb.jpg"
        },{
            game: "Star Wars: Racer Revenge",
            name: "Galactic Greatness",
            desc: "Take first place in the Hutt Championships.",
            imag: "http://www.playstationtrophies.org/images/trophies/4128/534.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
            name: "Padawan",
            desc: "Complete the game on Easy difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/397/09.jpg"
        },{
            game: "Tales From The Borderlands",
            name: "Welcome to Pandora, Kiddos",
            desc: "Completed Chapter 1 of Episode 1",
            imag: "http://www.playstationtrophies.org/images/trophies/3247/5a3.jpg"
        },{
            game: "The Amazing Spider-man",
            name: "Peter Parker",
            desc: "Complete the game on human difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/1222/219.jpg"
        },{
            game: "Skyrim",
            name: "Hero of the People",
            desc: "Complete 50 Misc Objectives",
            imag: "http://www.playstationtrophies.org/images/trophies/826/26.jpg"
        },{
            game: "The Saboteur",
            name: "Pint and a Shag",
            desc: "You got lucky with Skylar.",
            imag: "http://www.playstationtrophies.org/images/trophies/298/26.jpg"
        },{
            game: "Thor: God of Thunder",
            name: "Valorous",
            desc: "Acquired an upgrade.",
            imag: "http://www.playstationtrophies.org/images/trophies/670/07.jpg"
        },{
            game: "Uncharted: Golden Abyss",
            name: "The Collector",
            desc: "Collect first treasure or mystery.",
            imag: "http://www.playstationtrophies.org/images/trophies/1092/55.jpg"
        },{
            game: "X-Men Origins: Wolverine",
            name: "Mutant Lover",
            desc: "Raised one Mutagen to level 3",
            imag: "http://www.playstationtrophies.org/images/trophies/113/020.jpg"
        }]
    },{
        listName: "Tech's Turrets Syndrome",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_tech.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_tech64.png",
        trophies: [{
            game: "Alex Kidd in Miracle World",
            name: "Good Vibrations",
            desc: "Freeze in fear from breaking a Skull Block.",
            imag: "http://www.playstationtrophies.org/images/trophies/1549/16B.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Rope-A-Dope-A-Dope",
            desc: "String up one henchman and drop him to surprise a second (any play mode).",
            imag: "http://www.playstationtrophies.org/images/trophies/192/24.jpg"
        },{
            game: "BioShock",
            name: "Seriously Good at This",
            desc: "The player has completed the game on the Hard difficulty setting",
            imag: "http://www.playstationtrophies.org/images/trophies/23/43.jpg"
        },{
            game: "Captain America: Super Soldier",
            name: "Pow, Right in the Kisser!",
            desc: "Performed 50 Crippling Strikes",
            imag: "http://www.playstationtrophies.org/images/trophies/769/23D.jpg"
        },{
            game: "Catherine",
            name: "The Golden Child",
            desc: "Earn Gold Prizes on all Hard difficulty stages.",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/47.jpg"
        },{
            game: "Dead Space 2",
            name: "Peek a Boo!",
            desc: "Kill a Stalker with the Seeker Rifle while in Zoom Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/355/42.jpg"
        },{
            game: "Demon's Souls",
            name: "Master Slasher's Trophy",
            desc: "Obtained Best Weapon by Bladestone",
            imag: "http://www.playstationtrophies.org/images/trophies/150/18.jpg"
        },{
            game: "Dragon Fantasy: Book I",
            name: "Well Educated",
            desc: "Read 30 Different Books in Ogden's Story.",
            imag: "http://www.playstationtrophies.org/images/trophies/2014/B8D.jpg"
        },{
            game: "Duke Nukem Forever",
            name: "Full Body Tourettes",
            desc: "Get knocked down 10 times",
            imag: "http://www.playstationtrophies.org/images/trophies/730/17.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "Love the Bomb",
            desc: "Cause 10,000 damage with Explosives.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/14.jpg"
        },{
            game: "Final Fantasy XIII-2",
            name: "Choco-boco-holic",
            desc: "Spent a fortune at shops.",
            imag: "http://www.playstationtrophies.org/images/trophies/890/6DE.jpg"
        },{
            game: "God of War III",
            name: "Vengeance Complete",
            desc: "Beat the game",
            imag: "http://www.playstationtrophies.org/images/trophies/319/003.jpg"
        },{
            game: "Gravity Rush",
            name: "Frequent Flyer",
            desc: "Landed 10 gravity kicks without landing or taking damage.",
            imag: "http://www.playstationtrophies.org/images/trophies/1392/28.jpg"
        },{
            game: "Hatsune Miku: Project DIVA F",
            name: "Skilled Player",
            desc: "You earned the title \"Skilled Player\"!",
            imag: "http://www.playstationtrophies.org/images/trophies/2251/398.jpg"
        },{
            game: "Iron Man 2",
            name: "Anger Management",
            desc: "Destroy most of the structures in Shatalov's base.",
            imag: "http://www.playstationtrophies.org/images/trophies/404/15.jpg"
        },{
            game: "Mass Effect 3",
            name: "Long Service Medal",
            desc: "Complete Mass Effect 3 twice, or once with a Mass Effect 2 import.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/C12.jpg"
        },{
            game: "NASCAR Unleashed",
            name: "Rocketman",
            desc: "Slingshot into 25 ramp jumps",
            imag: "http://www.playstationtrophies.org/images/trophies/1256/19.jpg"
        },{
            game: "NCIS",
            name: "You know I'm awesome",
            desc: "Collect first piece of evidence",
            imag: "http://www.playstationtrophies.org/images/trophies/1253/27.jpg"
        },{
            game: "Portal 2",
            name: "Professor Portal",
            desc: "After completing co-op, complete Calibration Course online with a friend who hasn't played before",
            imag: "http://www.playstationtrophies.org/images/trophies/610/43.jpg"
        },{
            game: "Ratchet & Clank: A Crack in Time",
            name: "Rude Awakening",
            desc: "Complete Great Clock, Sector One.",
            imag: "http://www.playstationtrophies.org/images/trophies/241/03.jpg"
        },{
            game: "Resident Evil 5",
            name: "Stop, Drop, & Roll",
            desc: "Defeat 3 Majini at once by setting oil canisters on fire.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/043.jpg"
        },{
            game: "Sam & Max: The Devil's Playhouse - Episode 3: They Stole Max's Brain",
            name: "Tweenage Angst",
            desc: "Have Sammunmak banish every possible object in Act 3",
            imag: "http://www.playstationtrophies.org/images/trophies/633/08.jpg"
        },{
            game: "Saw II: Flesh & Blood",
            name: "Now THAT'S using your head!",
            desc: "Escaped 'The Bullish Man'",
            imag: "http://www.playstationtrophies.org/images/trophies/525/08.jpg"
        },{
            game: "SEGA MEGA DRIVE Ultimate Collection",
            name: "Get to the Chopper",
            desc: "Super Thunder Blade: Score over 1,500,000 points in the first level",
            imag: "http://www.playstationtrophies.org/images/trophies/85/025.jpg"
        },{
            game: "Tekken Tag Tournament HD",
            name: "OOHRAAAH",
            desc: "Clear Time Attack in under 06'00\"00.",
            imag: "http://www.playstationtrophies.org/images/trophies/1085/5DE.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "All Fall Down",
            desc: "Survived the attack.",
            imag: "http://www.playstationtrophies.org/images/trophies/3095/72e.jpg"
        },{
            game: "Transformers: Dark of the Moon",
            name: "Homewrecker",
            desc: "Wipe out all secret base ground defenders within 60 seconds in Chapter V.",
            imag: "http://www.playstationtrophies.org/images/trophies/916/27.jpg"
        },{
            game: "Unreal Tournament III",
            name: "Have a Nice Day",
            desc: "Get the \"Rocket Scientist\" award in 10 matches and \"Flak Master\" award in 10 matches.",
            imag: "http://www.playstationtrophies.org/images/trophies/108/024.jpg"
        },{
            game: "Wolfenstein: The New Order",
            name: "Power to the Laser",
            desc: "Find the Laserkraftwerk",
            imag: "http://www.playstationtrophies.org/images/trophies/2552/434.jpg"
        },{
            game: "X-Men Origins: Wolverine",
            name: "WoW!",
            desc: "You feel a cold as you examine the sword and skeleton. A rustle of wind in the trees faintly echoes the name Arthas",
            imag: "http://www.playstationtrophies.org/images/trophies/113/035.jpg"
        }]
    },{
        listName: "Terminator's \"Journey to Salvation\"",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_terminator.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_terminator64.png",
        trophies: [{
            game: "BioShock",
            name: "Completed Welcome",
            desc: "The player has successfully completed the Welcome To Rapture Level",
            imag: "http://www.playstationtrophies.org/images/trophies/23/1.jpg"
        },{
            game: "Duke Nukem Forever",
            name: "Duke Angry, Duke Smash!",
            desc: "Kill 15 aliens with melee attacks while on steroids",
            imag: "http://www.playstationtrophies.org/images/trophies/730/14.jpg"
        },{
            game: "Port Royale 3: Pirates and Merchants",
            name: "Power Drinker",
            desc: "Visit all 60 taverns",
            imag: "http://www.playstationtrophies.org/images/trophies/1703/B0D.jpg"
        },{
            game: "Red Dead Redemption",
            name: "He Cleans Up Well!",
            desc: "Obtain the Elegant Suit.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/24.jpg"
        },{
            game: "Red Faction: Armageddon",
            name: "Cheater!",
            desc: "Buy a Cheat.",
            imag: "http://www.playstationtrophies.org/images/trophies/583/30.jpg"
        },{
            game: "Killer is Dead",
            name: "Suck Like a Leech",
            desc: "Killed an enemy using the \"Burst Rush.\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1492/982.jpg"
        },{
            game: "Dead Space 2",
            name: "Lightspeed de Milo",
            desc: "Dismember the Lightspeed Boy Statue",
            imag: "http://www.playstationtrophies.org/images/trophies/355/32.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "Murder Nature",
            desc: "Kill all the Animal Types",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/8B7.jpg"
        },{
            game: "Back to the Future: The Game",
            name: "One Bad Apple",
            desc: "Collect every Demerit in the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/1245/32.jpg"
        },{
            game: "Aliens: Colonial Marines",
            name: "Mostly Come at Night...",
            desc: "Find Newt's doll",
            imag: "http://www.playstationtrophies.org/images/trophies/736/FD6.jpg"
        },{
            game: "SEGA MEGA DRIVE Ultimate Collection",
            name: "Complete Chaos",
            desc: "Sonic The Hedgehog: Obtain a Chaos Emerald",
            imag: "http://www.playstationtrophies.org/images/trophies/173/22.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Fugitive",
            desc: "Manage to escape Blake in the subway station",
            imag: "http://www.playstationtrophies.org/images/trophies/321/27.jpg"
        },{
            game: "Skyrim",
            name: "Wanted",
            desc: "Escape from jail",
            imag: "http://www.playstationtrophies.org/images/trophies/826/33.jpg"
        },{
            game: "Monkey Island 2 Special Edition: LeChuck's Revenge",
            name: "Call 911",
            desc: "Call the LucasArts helpdesk when walking through the jungle on Dinky Island",
            imag: "http://www.playstationtrophies.org/images/trophies/523/12.jpg"
        },{
            game: "Plants vs. Zombies",
            name: "Close Shave (p)",
            desc: "Survive the zombie onslaught after all lawnmowers have been used",
            imag: "http://www.playstationtrophies.org/images/trophies/901/10.jpg"
        },{
            game: "Fallout 3",
            name: "The Wasteland Survival Guide",
            desc: "Completed 'The Wasteland Survival Guide'",
            imag: "http://www.playstationtrophies.org/images/trophies/70/016.jpg"
        },{
            game: "inFAMOUS",
            name: "Clean Up Your Act",
            desc: "Defeat Sasha",
            imag: "http://www.playstationtrophies.org/images/trophies/122/2.jpg"
        },{
            game: "Borderlands 2",
            name: "Always Improving",
            desc: "Reached level 25",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/9ED.jpg"
        },{
            game: "Resident Evil 5",
            name: "Who Do You Trust?",
            desc: "Build up a certain level of trust with your partner.",
            imag: "http://www.playstationtrophies.org/images/trophies/81/050.jpg"
        },{
            game: "Mass Effect 2",
            name: "Paramour (2)",
            desc: "Successfully pursue a relationship with a teammate",
            imag: "http://www.playstationtrophies.org/images/trophies/703/31.jpg"
        },{
            game: "Minecraft",
            name: "Leader Of The Pack",
            desc: "Befriend five wolves.",
            imag: "http://www.playstationtrophies.org/images/trophies/2376/2EE.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "Perfect Body",
            desc: "Completely level up Juliet.",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/1C7.jpg"
        },{
            game: "BioShock Infinite",
            name: "Mind Over Matter",
            desc: "Killed 20 enemies using Possessed machines.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/BD3.jpg"
        },{
            game: "Earth Defense Force: Insect Armageddon",
            name: "Who Ravages the Ravagers?",
            desc: "Kill 25000 Enemies. Master killer",
            imag: "http://www.playstationtrophies.org/images/trophies/754/25.jpg"
        },{
            game: "BioShock 2",
            name: "Big Brass Balls",
            desc: "Finished the game without using Vita-Chambers.",
            imag: "http://www.playstationtrophies.org/images/trophies/309/36.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Eye of the Storm",
            desc: "Completed Episode 3: \"In Harm's Way\"",
            imag: "http://www.playstationtrophies.org/images/trophies/2352/24.jpg"
        },{
            game: "The Secret of Monkey Island: Special Edition",
            name: "Guybrush Kicks Butt",
            desc: "Complete Last Part: Guybrush Kicks Butt.",
            imag: "http://www.playstationtrophies.org/images/trophies/439/04.jpg"
        },{
            game: "Terminator Salvation",
            name: "For the Resistance",
            desc: "Complete Chapter 9 - For the Resistance on any difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/112/009.jpg"
        },{
            game: "Dishonored",
            name: "Poetic Justice",
            desc: "You neutralized all key targets using indirect means",
            imag: "http://www.playstationtrophies.org/images/trophies/1123/EAD.jpg"
        },{
            game: "The Walking Dead",
            name: "Everything's Going to be Okay",
            desc: "Complete Episode 1: \"A New Day\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/3CE.jpg"
        },{
            game: "Catherine",
            name: "Dreams Come True",
            desc: "View all of the endings.",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/19.jpg"
        },{
            game: "The Escapists",
            name: "Quick Learner",
            desc: "Complete the tutorial",
            imag: "http://www.playstationtrophies.org/images/trophies/3565/345.jpg"
        },{
            game: "Onechanbara Z2: Chaos",
            name: "Repent!",
            desc: "Make use of all goddess statues in story mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/3915/c15.jpg"
        },{
            game: "This War of Mine: The Little Ones",
            name: "Note: Better days",
            desc: "Kids... they sometimes seem to be far away from this war. It's heartwarming.",
            imag: "http://www.playstationtrophies.org/images/trophies/3900/614.jpg"
        },{
            game: "Wolfenstein: The Old Blood",
            name: "Hero",
            desc: "Complete game on any difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/3447/34b.jpg"
        },{
            game: "Fallout 4",
            name: "Prepared for the Future",
            desc: "Decide the Fate of the Commonwealth",
            imag: "http://www.playstationtrophies.org/images/trophies/2430/3ea.jpg"
        }]
    },{
        listName: "The Gamer's Favourites",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_gamer.png",
        award: "http://i.imgur.com/zjxT3Dl.png",
        trophies: [{
            game: "Batman: Arkham City",
            name: "Gotham Base Jumper",
            desc: "Jump off the tallest building in Arkham City and glide for 1 minute without touching the ground.",
            imag: "http://www.playstationtrophies.org/images/trophies/398/44.jpg"
        },{
            game: "BioShock",
            name: "I Chose the Impossible",
            desc: "Complete the game on Survivor difficulty without using a Vita-chamber",
            imag: "http://www.playstationtrophies.org/images/trophies/23/53.jpg"
        },{
            game: "BioShock Infinite",
            name: "Saw the Elephant",
            desc: "Completed the game on Normal difficulty or above",
            imag: "http://www.playstationtrophies.org/images/trophies/700/97D.jpg"
        },{
            game: "Borderlands",
            name: "Reckless Abandon",
            desc: "Killed 15 enemies with the Berserker's action skill",
            imag: "http://www.playstationtrophies.org/images/trophies/39/50.jpg"
        },{
            game: "Borderlands 2",
            name: "Feels Like The First Time",
            desc: "Opened the chest at the bus stop in Fyrestone",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/F11.jpg"
        },{
            game: "Costume Quest",
            name: "Mask-O'-Raider",
            desc: "Complete all Quests in the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/699/10.jpg"
        },{
            game: "Fallout 3",
            name: "Tranquility Lane",
            desc: "Completed 'Tranquility Lane'",
            imag: "http://www.playstationtrophies.org/images/trophies/70/007.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "Ain't That a Kick in the Head",
            desc: "Completed Ain't That a Kick in the Head.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/32.jpg"
        },{
            game: "Grand Theft Auto V",
            name: "The Government Gimps",
            desc: "You recovered sensitive information from a highly defended federal building.",
            imag: "http://www.playstationtrophies.org/images/trophies/687/01f.jpg"
        },{
            game: "Hitman: Blood Money",
            name: "5 Normal Silent Assassins",
            desc: "5 Silent Assassin ratings awarded on the Normal difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/1772/010.jpg"
        },{
            game: "Kingdom Hearts Final Mix HD",
            name: "End of the World",
            desc: "Seal the keyhole in Hollow Bastion",
            imag: "http://www.playstationtrophies.org/images/trophies/1939/058.jpg"
        },{
            game: "L.A. Noire",
            name: "Auto Fanatic",
            desc: "Drive every vehicle in the city.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/40.jpg"
        },{
            game: "Mafia II",
            name: "Hard to Kill",
            desc: "The police want you dead. Survive for 10 minutes!",
            imag: "http://www.playstationtrophies.org/images/trophies/351/38.jpg"
        },{
            game: "Mass Effect",
            name: "Honorarium of Corporate Service",
            desc: "Complete Noveria",
            imag: "http://www.playstationtrophies.org/images/trophies/1743/3CA.jpg"
        },{
            game: "Mass Effect 2",
            name: "Power Gamer",
            desc: "Reach Level 30 with one character",
            imag: "http://www.playstationtrophies.org/images/trophies/703/45.jpg"
        },{
            game: "Mass Effect 3",
            name: "Paramour (3)",
            desc: "Establish or rekindle a romantic relationship.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/039.jpg"
        },{
            game: "Medal of Honor Frontline",
            name: "ET Goin' Home",
            desc: "Find the UFO in 'On Track'",
            imag: "http://www.playstationtrophies.org/images/trophies/772/46.jpg"
        },{
            game: "Metal Gear Solid 2",
            name: "Johnny on the Spot",
            desc: "Hear Johnny's bowel noises in two locations",
            imag: "http://www.playstationtrophies.org/images/trophies/1053/16.jpg"
        },{
            game: "Metal Gear Solid 3",
            name: "You Snooze, You Lose (m)",
            desc: "Sneak up on The End and hold him up",
            imag: "http://www.playstationtrophies.org/images/trophies/1054/42.jpg"
        },{
            game: "METAL GEAR SOLID 4",
            name: "Old Sun",
            desc: "Cleared Act 5 (Outer Haven).",
            imag: "http://www.playstationtrophies.org/images/trophies/515/B9F.jpg"
        },{
            game: "Oddworld: New 'n' Tasty",
            name: "Odd Messiah",
            desc: "Rescue every Mudokon while finishing New 'n' Tasty in Hard mode",
            imag: "http://www.playstationtrophies.org/images/trophies/902/629.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Pure Gold",
            desc: "Achieve 30 Gold Stat Awards.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/892.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "Inside Joke",
            desc: "While inside Mr. Slave, you summoned Mr. Slave.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/A96.jpg"
        },{
            game: "The Cave",
            name: "Hazardous Work Environment",
            desc: "Slipped, where wet.",
            imag: "http://www.playstationtrophies.org/images/trophies/1554/676.jpg"
        },{
            game: "Skyrim",
            name: "One with the Shadows",
            desc: "Returned the Thieves Guild to its former glory",
            imag: "http://www.playstationtrophies.org/images/trophies/826/18.jpg"
        },{
            game: "The Saboteur",
            name: "Saint Honoré",
            desc: "You spent 75,000 contraband.",
            imag: "http://www.playstationtrophies.org/images/trophies/298/15.jpg"
        },{
            game: "Toy Story 3",
            name: "Give Me My Gold Back",
            desc: "Defeat Mayor Hamm in the Woody's Roundup boss battle",
            imag: "http://www.playstationtrophies.org/images/trophies/468/25.jpg"
        },{
            game: "WATCH DOGS",
            name: "Disk Space Full",
            desc: "Unlock every song with the SongSneak app",
            imag: "http://www.playstationtrophies.org/images/trophies/1588/eaa.jpg"
        },{
            game: "WWE 2K14",
            name: "Lord of Darkness",
            desc: "Defend the Streak - Defeat 50 Superstars in a single match.",
            imag: "http://www.playstationtrophies.org/images/trophies/1929/490.jpg"
        },{
            game: "WWE 2K15",
            name: "The Deadman defeated",
            desc: "WWE Universe - Defeat Undertaker at WrestleMania using a custom Superstar.",
            imag: "http://www.playstationtrophies.org/images/trophies/2786/ca2.jpg"
        },{
            game: "Assassin's Creed Syndicate",
            name: "WHAT IS WRONG WITH YOU",
            desc: "Flip five vehicles by shooting their horses.",
            imag: "http://www.playstationtrophies.org/images/trophies/3634/351.jpg"
        },{
            game: "Fallout 4",
            name: "Unlikely Valentine",
            desc: "Complete \"Unlikely Valentine\"",
            imag: "http://www.playstationtrophies.org/images/trophies/2430/949.jpg"
        },{
            game: "METAL GEAR SOLID V: THE PHANTOM PAIN",
            name: "Speechless",
            desc: "Make Quiet available for deployment.",
            imag: "http://www.playstationtrophies.org/images/trophies/1704/fa9.jpg"
        },{
            game: "The Witcher 3: Wild Hunt",
            name: "Friends With Benefits",
            desc: "Complete the subplot involving Keira Metz.",
            imag: "http://www.playstationtrophies.org/images/trophies/1904/3b2.jpg"
        },{
            game: "Zombie Army Trilogy",
            name: "You want me to salute that pile of..?",
            desc: "Kill an Occult General",
            imag: "http://www.playstationtrophies.org/images/trophies/3340/083.jpg"
        }]
    },{
        listName: "TheManUtdFan's Saints, Sinners and More",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_tmuf.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_tmuf64.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Hallowed be thy name",
            desc: "Discover the Assassin's Tomb inside the Basilica di San Marco.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/32.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Party Pooper",
            desc: "KO all the henchmen celebrating your arrival at the party",
            imag: "http://www.playstationtrophies.org/images/trophies/192/20.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Mastermind",
            desc: "Rescue the second hostage from Riddler",
            imag: "http://www.playstationtrophies.org/images/trophies/398/31.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Pit Boss (c)",
            desc: "Run The Pit in 'S.S.D.D.' and finish with a final time under 30 seconds.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/23.jpg "
        },{
            game: "Catherine",
            name: "Love is Patient, Love is Kind",
            desc: "Resolve Daniel's dilemma.",
            imag: "http://www.playstationtrophies.org/images/trophies/1011/23.jpg"
        },{
            game: "Danganronpa: Trigger Happy Havoc",
            name: "Mystic Donut",
            desc: "Filled in every page of Aoi's Report Card",
            imag: "http://www.playstationtrophies.org/images/trophies/2542/810.jpg"
        },{
            game: "Danganronpa 2: Goodbye Despair",
            name: "Co-Op Partner",
            desc: "Filled in every page of Chiaki's Report Card",
            imag: "http://www.playstationtrophies.org/images/trophies/3041/2a5.jpg"
        },{
            game: "Deadpool",
            name: "Let's try one more time...",
            desc: "Slap Wolverine a bunch of times",
            imag: "http://www.playstationtrophies.org/images/trophies/1641/7C9.jpg "
        },{
            game: "Diablo III: Reaper of Souls",
            name: "Breaking Not So Bad",
            desc: "Use a merchant to repair an item.",
            imag: "http://www.playstationtrophies.org/images/trophies/2985/39a.jpg "
        },{
            game: "Far Cry 3",
            name: "Say Hi to the Internet",
            desc: "Find the lost Hollywood star.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/00F.jpg "
        },{
            game: "God of War III",
            name: "Bloody Hell",
            desc: "Cover Kratos in 500 buckets of blood by killing the enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/319/001.jpg "
        },{
            game: "Hitman: Absolution",
            name: "Chamber of Secrets",
            desc: "Locate room 899",
            imag: "http://www.playstationtrophies.org/images/trophies/678/2FB.jpg "
        },{
            game: "Hotline Miami",
            name: "Bat-man",
            desc: "Clear Chapter 2 using Nigel the Bat",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/6F9.jpg"
        },{
            game: "Mass Effect",
            name: "Sniper Expert",
            desc: "Register 150 Sniper Rifle Kills",
            imag: "http://www.playstationtrophies.org/images/trophies/1743/EBE.jpg "
        },{
            game: "Mass Effect 3",
            name: "Hard Target",
            desc: "Call down an orbital strike.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/D0A.jpg "
        },{
            game: "Payday: The Heist",
            name: "Gold digger",
            desc: "Beat SLAUGHTERHOUSE within 15 minutes, taking all the gold. To complete this challenge, you will have to have played the heist from the start.",
            imag: "http://www.playstationtrophies.org/images/trophies/1135/2223.jpg "
        },{
            game: "Payday 2",
            name: "Man of Iron",
            desc: "Equip the Improved Combined Tactical Vest.",
            imag: "http://www.playstationtrophies.org/images/trophies/1955/BEF.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Hero of Gallowmere",
            desc: "Complete Arcade Mode with Sir Daniel",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/F5E.jpg "
        },{
            game: "Portal 2",
            name: "High Five",
            desc: "Celebrate your cooperative calibration success",
            imag: "http://www.playstationtrophies.org/images/trophies/610/31.jpg "
        },{
            game: "Ratchet & Clank 2: Going Commando",
            name: "You can Break a Snow Dan",
            desc: "Blow up the snowman on Siberius",
            imag: "http://www.playstationtrophies.org/images/trophies/1454/FB8.jpg"
        },{
            game: "Rayman Legends",
            name: "Just kick it!",
            desc: "Win one Kung Foot game",
            imag: "http://www.playstationtrophies.org/images/trophies/1526/FF8.jpg "
        },{
            game: "RESOGUN",
            name: "(5+5)x",
            desc: "Get a multiplier of 10x",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/25.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Haters Gonna Hate",
            desc: "Kill 1000 Gang Members.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/43.jpg "
        },{
            game: "Saints Row IV",
            name: "Back in the Day",
            desc: "Spend 2 hours outside of missions with past Saints Row characters as your homies",
            imag: "http://www.playstationtrophies.org/images/trophies/3031/8c5.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Karaoke Superstar",
            desc: "Achieving 90% and above for all songs at the Karaoke Bars in HK.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/58B.jpg "
        },{
            game: "The Last of Us",
            name: "Skillz",
            desc: "Win the water gun fight",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/af8.jpg"
        },{
            game: "Tomb Raider",
            name: "Tastes Like Chicken!",
            desc: "Kill and loot 10 small animals (rabbits, chickens, rats).",
            imag: "http://www.playstationtrophies.org/images/trophies/831/CE8.jpg "
        },{
            game: "The Walking Dead",
            name: "What Remains",
            desc: "Complete Episode 5: \"No Time Left\"",
            imag: "http://www.playstationtrophies.org/images/trophies/1398/B8D.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "All the Dead Lie Down",
            desc: "Completed Episode 5: \"No Going Back\"",
            imag: "http://www.playstationtrophies.org/images/trophies/2352/40.jpg"
        },{
            game: "Virtue's Last Reward",
            name: "Tears in the Rain",
            desc: "Saw Luna's ending.",
            imag: "http://www.playstationtrophies.org/images/trophies/1796/E64.jpg"
        }]
    },{
        listName: "Trik's Troll Toll",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_trik.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_trik64.png",
        trophies: [{
            game: "Assassin's Creed IV Black Flag",
            name: "Devil Of The Caribbean",
            desc: "Defeat all 4 legendary ships.",
            imag: "http://www.playstationtrophies.org/images/trophies/2233/09a.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Exit Stage Right",
            desc: "All the world is a stage",
            imag: "http://www.playstationtrophies.org/images/trophies/398/15.jpg"
        },{
            game: "Borderlands 2",
            name: "So Much Blood!",
            desc: "Gunzerked continuously for 90 seconds",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/63F.jpg"
        },{
            game: "Call of Duty: Advanced Warfare",
            name: "Flip Flop",
            desc: "\"Flip\" a map twice.",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/37e.jpg"
        },{
            game: "Dishonored",
            name: "Just Dark Enough",
            desc: "You completed the game in low chaos",
            imag: "http://www.playstationtrophies.org/images/trophies/1123/13C.jpg"
        },{
            game: "Dragon Age: Inquisition",
            name: "Stargazer",
            desc: "Unlock 15 astrariums in a single playthrough.",
            imag: "http://www.playstationtrophies.org/images/trophies/2254/340.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "Wild Card",
            desc: "Completed Wild Card.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/38.jpg"
        },{
            game: "Far Cry 3",
            name: "Heartless Pyro",
            desc: "Kill 50 enemies with the flamethrower (Single Player only).",
            imag: "http://www.playstationtrophies.org/images/trophies/922/34E.jpg"
        },{
            game: "Game of Thrones",
            name: "Love and Hostility",
            desc: "Completed Chapter 6 of Episode 2",
            imag: "http://www.playstationtrophies.org/images/trophies/2441/ff1.jpg"
        },{
            game: "God of War",
            name: "Sword Man",
            desc: "Acquire Blade of Artemis",
            imag: "http://www.playstationtrophies.org/images/trophies/263/1.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "Coloring Inside the Lines",
            desc: "Complete all the Stencil Art",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/df3.jpg"
        },{
            game: "Injustice: Gods Among Us",
            name: "Rise to the Top",
            desc: "Complete Classic Battle with any character",
            imag: "http://www.playstationtrophies.org/images/trophies/2392/3A6.jpg"
        },{
            game: "L.A. Noire",
            name: "No Rest For The Wicked",
            desc: "Complete all cases on the Vice desk.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/05.jpg"
        },{
            game: "Mass Effect 3",
            name: "Patriot",
            desc: "Make the final assault.",
            imag: "http://www.playstationtrophies.org/images/trophies/845/6F3.jpg"
        },{
            game: "Middle-Earth: Shadow of Mordor",
            name: "Ratbag the Great and Powerful",
            desc: "Get Ratbag promoted to Warchief.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/29b.jpg"
        },{
            game: "Puss in Boots",
            name: "All I need are the boots, baby!",
            desc: "Complete the game",
            imag: "http://www.playstationtrophies.org/images/trophies/1243/14.jpg"
        },{
            game: "Remember Me",
            name: "The wheat and the chaff",
            desc: "Beat Madame without hitting any of her clones",
            imag: "http://www.playstationtrophies.org/images/trophies/1671/1C6.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Stuntman",
            desc: "Successfully perform an action hijack.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/067.jpg"
        },{
            game: "Sniper Elite III",
            name: "Charlie's Challenge",
            desc: "Get a testicle-shot from over 100m away",
            imag: "http://www.playstationtrophies.org/images/trophies/2302/f13.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "For the Hoarder",
            desc: "You completed the game without selling any items.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/6FE.jpg"
        },{
            game: "Spec Ops: The Line",
            name: "We Were Soldiers",
            desc: "Complete game on \"Combat Op\" difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/613/6D4.jpg"
        },{
            game: "Skyrim",
            name: "Citizen",
            desc: "Buy a house",
            imag: "http://www.playstationtrophies.org/images/trophies/826/32.jpg"
        },{
            game: "The Last of Us",
            name: "That's all I got",
            desc: "Survive all of Ellie's jokes",
            imag: "http://www.playstationtrophies.org/images/trophies/1317/4F4.jpg"
        },{
            game: "The Sims 3: Pets",
            name: "K9 Cop",
            desc: "Complete each of the k9 cop scenario Challenges.",
            imag: "http://www.playstationtrophies.org/images/trophies/1063/21.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Beyond the Trees",
            desc: "Completed Episode 4: \"Amid the Ruins\"",
            imag: "http://www.playstationtrophies.org/images/trophies/3095/fab.jpg"
        },{
            game: "The Wolf Among Us",
            name: "No Respect for the Dead",
            desc: "Completed Episode 2: \"Smoke and Mirrors\"",
            imag: "http://www.playstationtrophies.org/images/trophies/3099/c27.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Marco Solo",
            desc: "Play in the swimming pool on the Cruise Ship",
            imag: "http://www.playstationtrophies.org/images/trophies/373/48.jpg"
        },{
            game: "WATCH DOGS",
            name: "They Call Him The Vigilante",
            desc: "Complete every Investigation",
            imag: "http://www.playstationtrophies.org/images/trophies/2250/5cc.jpg"
        },{
            game: "XCOM: Enemy Unknown",
            name: "Hunter/Killer",
            desc: "In a single game, shoot down one of each alien craft.",
            imag: "http://www.playstationtrophies.org/images/trophies/1350/4D9.jpg"
        },{
            game: "Zen Pinball 2",
            name: "Pimped Out Butters is Pimpin'",
            desc: "Activate Butters' Outfit mode and collect a new outfit on the South Park: Butters' very own pinball game.",
            imag: "http://www.playstationtrophies.org/images/trophies/2434/91.jpg"
        }]
    },{
        listName: "Tuff's Muff Licker List",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_tuffmuff.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_tuff64.png",
        trophies: [{
            game: "Battlefield: Bad Company",
            name: "Manic Lumberjack",
            desc: "Knock down a small forest",
            imag: "http://www.playstationtrophies.org/images/trophies/55/022.jpg"
        },{
            game: "Battlefield: Bad Company 2",
            name: "It's bad for my karma man!",
            desc: "Campaign: finish Heart of Darkness",
            imag: "http://www.playstationtrophies.org/images/trophies/326/04.jpg"
        },{
            game: "Battlefield 3",
            name: "You can be my wingman anytime",
            desc: "Completed Going Hunting in a perfect run",
            imag: "http://www.playstationtrophies.org/images/trophies/883/13.jpg"
        },{
            game: "Battlefield 4",
            name: "Shawshank",
            desc: "Get 5 kills with Shank in the Kunlun Mountains mission in the Campaign",
            imag: "http://www.playstationtrophies.org/images/trophies/2235/4E4.jpg"
        },{
            game: "Battlefield: Hardline",
            name: "You Tazed Him, Bro!",
            desc: "Stun 5 criminals with the T62 CEW in Single Player",
            imag: "http://www.playstationtrophies.org/images/trophies/2806/e59.jpg"
        },{
            game: "Bejeweled 3",
            name: "Relics Revealed",
            desc: "Unlock all 5 relics in Quest mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/1110/010.jpg"
        },{
            game: "Call of Duty Classic",
            name: "Old Glory",
            desc: "Complete the American Missions",
            imag: "http://www.playstationtrophies.org/images/trophies/277/25.jpg"
        },{
            game: "Call of Duty: Modern Warfare 2",
            name: "Star 69",
            desc: "Earn 69 stars in Special Ops.",
            imag: "http://www.playstationtrophies.org/images/trophies/240/36.jpg"
        },{
            game: "Call of Duty: Modern Warfare 3",
            name: "Unstoppable (c)",
            desc: "Reach Wave 15 in each mission of Special Ops Survival mode.",
            imag: "http://www.playstationtrophies.org/images/trophies/422/47.jpg"
        },{
            game: "Dante's Inferno",
            name: "Poetry in Motion",
            desc: "Perform a 666 hit combo",
            imag: "http://www.playstationtrophies.org/images/trophies/322/28.jpg"
        },{
            game: "Dead to Rights: Retribution",
            name: "Dog tag",
            desc: "Perform a tag team kill with Shadow",
            imag: "http://www.playstationtrophies.org/images/trophies/376/30.jpg"
        },{
            game: "Earth Defense Force: Insect Armageddon",
            name: "Welcome to the EDF",
            desc: "Kill 1000 Ants; 1000? There must be a jillion of those things! Get busy!",
            imag: "http://www.playstationtrophies.org/images/trophies/754/03.jpg"
        },{
            game: "Fallout 3",
            name: "Vault-Tec C.E.O.",
            desc: "Collected 20 Vault-Tec Bobbleheads",
            imag: "http://www.playstationtrophies.org/images/trophies/70/050.jpg"
        },{
            game: "Fallout: New Vegas",
            name: "No Gods, No Masters",
            desc: "Completed No Gods, No Masters.",
            imag: "http://www.playstationtrophies.org/images/trophies/343/42.jpg"
        },{
            game: "Far Cry 3",
            name: "Poker Bully",
            desc: "Win $1500 playing poker.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/E55.jpg"
        },{
            game: "Far Cry 3: Blood Dragon",
            name: "Derp",
            desc: "Jump Down from 50 Meters",
            imag: "http://www.playstationtrophies.org/images/trophies/2000/C46.jpg"
        },{
            game: "Hard Corps: Uprising",
            name: "All Clear",
            desc: "[RISING MODE] Clear all missions",
            imag: "http://www.playstationtrophies.org/images/trophies/676/03.jpg"
        },{
            game: "Hunter's Trophy 2: Australia",
            name: "Bad master",
            desc: "Having killed a dog",
            imag: "http://www.playstationtrophies.org/images/trophies/2272/CDE.jpg"
        },{
            game: "Killzone 3",
            name: "Completist",
            desc: "Destroyed every destructible weapon on the MAWLR while on foot and on the Intruder",
            imag: "http://www.playstationtrophies.org/images/trophies/430/25.jpg"
        },{
            game: "Madden NFL 12",
            name: "Arian Foster Award",
            desc: "Rush for 231+ yards in a game with one player (No OTP or co-op)",
            imag: "http://www.playstationtrophies.org/images/trophies/969/07.jpg"
        },{
            game: "Metro 2033 Redux",
            name: "Toast!",
            desc: "Drink at every occasion.",
            imag: "http://www.playstationtrophies.org/images/trophies/2938/17.png"
        },{
            game: "My Aquarium",
            name: "Breeding Novice",
            desc: "Bred successfully at least 5 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/740/06.jpg"
        },{
            game: "Plants vs. Zombies",
            name: "Alive and Planting",
            desc: "Survive 40 waves of pure zombie ferocity",
            imag: "http://www.playstationtrophies.org/images/trophies/901/06.jpg"
        },{
            game: "Portal 2",
            name: "Asking for Trouble",
            desc: "Taunt GLaDOS in front of a camera in each of the five co-op courses",
            imag: "http://www.playstationtrophies.org/images/trophies/610/49.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Buckin' Awesome",
            desc: "Break the Kentucky Saddler, the American Standardbred, and the Hungarian Half-bred.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/19.jpg"
        },{
            game: "Resistance 3",
            name: "Slaybells",
            desc: "Make Santa and his reindeer fly",
            imag: "http://www.playstationtrophies.org/images/trophies/546/10.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Gender Equality",
            desc: "Play for at least 2 hours as a male character AND 2 hours as a female character.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/37.jpg"
        },{
            game: "Sound Shapes",
            name: "Death Mode: Galaxanoids",
            desc: "Complete the Death Mode level.",
            imag: "http://www.playstationtrophies.org/images/trophies/1076/5F0.jpg"
        },{
            game: "Starhawk",
            name: "Only the Beginning...",
            desc: "Complete the campaign on Mercenary difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/421/62D.jpg"
        },{
            game: "Super Hang-On",
            name: "The Kiss of Fate",
            desc: "Cross the checkpoint with 1 second left.",
            imag: "http://www.playstationtrophies.org/images/trophies/1543/241.jpg"
        },{
            game: "Skyrim",
            name: "Words of Power",
            desc: "Learn all three words of a shout",
            imag: "http://www.playstationtrophies.org/images/trophies/826/46.jpg"
        },{
            game: "Voltron: Defender of the Universe",
            name: "Blazing Victory",
            desc: "Kill a Robeast without Voltron losing any health.",
            imag: "http://www.playstationtrophies.org/images/trophies/920/A45.jpg"
        },{
            game: "Fallout 4",
            name: "Lovable",
            desc: "Reach Maximum Relationship Level with a Companion",
            imag: "http://www.playstationtrophies.org/images/trophies/2430/f55.jpg"
        },{
            game: "LEGO Jurassic World",
            name: "Remember To Wash Your Hands",
            desc: "Complete a Dropping Rummage",
            imag: "http://www.playstationtrophies.org/images/trophies/3375/864.jpg"
        },{
            game: "Color Guardians",
            name: "This is SPARTA!",
            desc: "Fall off a cliff 100 times.",
            imag: "http://www.playstationtrophies.org/images/trophies/3438/de2.jpg"
        },{
            game: "Far Cry Primal",
            name: "Spiritual Advisor",
            desc: "Tensay joins the Wenja village.",
            imag: "http://www.playstationtrophies.org/images/trophies/4016/724.jpg"
        },{
            game: "Rocket League",
            name: "Helen's Pride",
            desc: "Score 6 Goals in a single game",
            imag: "http://www.playstationtrophies.org/images/trophies/3583/b9f.jpg"
        }]
    },{
        listName: "VazzVegas's Gambling and Looting Extravaganza",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_vazz.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_vazz64.png",
        trophies: [{
            game: "Back to the Future: The Game",
            name: "One Bad Apple",
            desc: "Collect every Demerit in the game.",
            imag: "http://www.playstationtrophies.org/images/trophies/840/08.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Crack The E Nigma",
            desc: "Solve every riddle on the island",
            imag: "http://www.playstationtrophies.org/images/trophies/192/39.jpg"
        },{
            game: "Borderlands 2",
            name: "Sugar Daddy",
            desc: "Tipped Moxxi $10,000",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/77D.jpg"
        },{
            game: "Diablo III: Reaper of Souls",
            name: "Up All Night To Get Lucky",
            desc: "Equip all Inventory slots with Legendary items that have a minimum required level of 70 or higher.",
            imag: "http://www.playstationtrophies.org/images/trophies/2985/a4b.jpg"
        },{
            game: "Fallout 3",
            name: "The Nuka-Cola Challenge",
            desc: "Completed 'The Nuka-Cola Challenge'",
            imag: "http://www.playstationtrophies.org/images/trophies/70/018.jpg"
        },{
            game: "Family Guy: Back To The Multiverse",
            name: "Grease Can't Save You Now",
            desc: "Win a Capture the \"Greased-Up Deaf Guy\" match",
            imag: "http://www.playstationtrophies.org/images/trophies/1532/137.jpg"
        },{
            game: "Flower",
            name: "Discovery",
            desc: "Find and bloom a secret flower.",
            imag: "http://www.playstationtrophies.org/images/trophies/2380/b3a.jpg"
        },{
            game: "Gravity Rush",
            name: "Gem Aficionado",
            desc: "Collected a total of 40,000 precious gems.",
            imag: "http://www.playstationtrophies.org/images/trophies/1392/39.jpg"
        },{
            game: "HEAVY RAIN",
            name: "FBI Investigator",
            desc: "Crime Scene - Find all clues related to the Origami Killer in the scene",
            imag: "http://www.playstationtrophies.org/images/trophies/321/07.jpg"
        },{
            game: "Jetpack Joyride",
            name: "High Roller",
            desc: "Lose the final spin 100 times total",
            imag: "http://www.playstationtrophies.org/images/trophies/1819/2F4.jpg"
        },{
            game: "Just Cause 2",
            name: "Globetrotter",
            desc: "Discover 100 locations.",
            imag: "http://www.playstationtrophies.org/images/trophies/329/01.jpg"
        },{
            game: "L.A. Noire",
            name: "Public Menace",
            desc: "Rack up $47,000 in penalties during a single story case.",
            imag: "http://www.playstationtrophies.org/images/trophies/358/35.jpg"
        },{
            game: "LEGO Marvel Super Heroes",
            name: "Billionaire Philanthropist",
            desc: "Collect 1,000,000,000 studs (Single Player)",
            imag: "http://www.playstationtrophies.org/images/trophies/2242/FBA.jpg"
        },{
            game: "Marvel: Ultimate Alliance 2",
            name: "Above and Beyond",
            desc: "Collect 200 Team Boosts.",
            imag: "http://www.playstationtrophies.org/images/trophies/216/38.jpg"
        },{
            game: "Mass Effect 2",
            name: "Explorer (m)",
            desc: "Visit 100% of the planets in an unexplored cluster",
            imag: "http://www.playstationtrophies.org/images/trophies/703/44.jpg"
        },{
            game: "MLB 14 The Show",
            name: "Paul \"America's First Baseman\" Goldschmidt",
            desc: "In any game mode with Paul Goldschmidt, collect 4 hits, drive in 4 RBI, and score 4 runs in a single game (excludes Community Challenge mode). Must be done in a full, uninterrupted, 9 inning game against a CPU team. Changing teams during the game or using the Quick Counts feature will invalidate this trophy.",
            imag: "http://www.playstationtrophies.org/images/trophies/2365/57b.jpg"
        },{
            game: "Need for Speed: Most Wanted",
            name: "Love Them and Leave Them",
            desc: "Drive every Car",
            imag: "http://www.playstationtrophies.org/images/trophies/1579/0B9.jpg"
        },{
            game: "Persona 4 Golden",
            name: "Lucky Me!",
            desc: "Win a prize from the vending machine",
            imag: "http://www.playstationtrophies.org/images/trophies/1926/7DE.jpg"
        },{
            game: "Poker Night 2",
            name: "Trophy Wife",
            desc: "Win Claptrap's bounty item.",
            imag: "http://www.playstationtrophies.org/images/trophies/2001/FFA.jpg"
        },{
            game: "Red Faction: Guerrilla",
            name: "Disaster Area",
            desc: "Destroy 1 billion credits worth of EDF property.",
            imag: "http://www.playstationtrophies.org/images/trophies/142/21.jpg"
        },{
            game: "Saints Row: The Third",
            name: "Tank You Very Much",
            desc: "Complete all instances of Tank Mayhem.",
            imag: "http://www.playstationtrophies.org/images/trophies/746/28.jpg"
        },{
            game: "SEGA MEGA DRIVE Ultimate Collection",
            name: "Lots of Zeros",
            desc: "Sonic Spinball: Get 10,000,000 points in the first level",
            imag: "http://www.playstationtrophies.org/images/trophies/173/25.jpg"
        },{
            game: "Sleeping Dogs",
            name: "Infowlable",
            desc: "Win 50,000 on a single cockfight.",
            imag: "http://www.playstationtrophies.org/images/trophies/1378/0E8.jpg"
        },{
            game: "Sly 2: Band of Thieves",
            name: "Loot!",
            desc: "Collect 1,500 coins",
            imag: "http://www.playstationtrophies.org/images/trophies/796/33.jpg"
        },{
            game: "South Park: The Stick of Truth",
            name: "More Popular Than John Lennon",
            desc: "Everyone in South Park is your friend.",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/34F.jpg"
        },{
            game: "Spider-Man: Shattered Dimensions",
            name: "Fanatic",
            desc: "Collect 500 Spider Emblems",
            imag: "http://www.playstationtrophies.org/images/trophies/506/63.jpg"
        },{
            game: "The Godfather II",
            name: "Organized Crime",
            desc: "Control all crime rings.",
            imag: "http://www.playstationtrophies.org/images/trophies/50/007.jpg"
        },{
            game: "Uncharted: Drake's Fortune",
            name: "Relic Finder (1)",
            desc: "Find the strange relic",
            imag: "http://www.playstationtrophies.org/images/trophies/8/1.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Expert Fortune Hunter",
            desc: "Find 80 treasures",
            imag: "http://www.playstationtrophies.org/images/trophies/214/10.jpg"
        },{
            game: "Uncharted: Golden Abyss",
            name: "Treasure: Turquoise Glyphs",
            desc: "Complete the treasure set.",
            imag: "http://www.playstationtrophies.org/images/trophies/1092/42.jpg"
        },{
            game: "WWE SmackDown vs. RAW 2010",
            name: "Nothing More to Collect",
            desc: "Unlock all the playable characters and bonus items.",
            imag: "http://www.playstationtrophies.org/images/trophies/235/12.jpg"
        }]
    },{
        listName: "Velvet's You Are What You Eat List",
        banner: "http://i.imgur.com/lDahFij.png",
        award: "http://i.imgur.com/sHbrV15.jpg",
        trophies: [{
            game: "Act It Out! A Game of Charades",
            name: "Truffle Shuffle",
            desc: "Used the 'shuffle' option more than 50 times during a single game",
            imag: "http://www.playstationtrophies.org/images/trophies/4286/cea.jpg"
        },{
            game: "Albedo: Eyes From Outer Space",
            name: "FANCY A COLA?",
            desc: "To cola! The cause of... and solution to... all of life's problems!",
            imag: "http://www.playstationtrophies.org/images/trophies/4297/ac6.jpg"
        },{
            game: "Alice: Madness Returns",
            name: "Nothing Like the Smell of Bacon",
            desc: "Pepper All Snouts in a Chapter",
            imag: "http://www.playstationtrophies.org/images/trophies/671/25.jpg"
        },{
            game: "Back to the Future - Episode 4: Double Visions Trophies",
            name: "Let Them Eat, Um, Cake",
            desc: "Offered Algae Cakes to Everyone",
            imag: "http://www.playstationtrophies.org/images/trophies/841/06.jpg"
        },{
            game: "Broken Age",
            name: "Picky Eater",
            desc: "Examine all breakfast options",
            imag: "http://www.playstationtrophies.org/images/trophies/3501/5d6.jpg"
        },{
            game: "Brothers: A Tale of Two Sons",
            name: "Turtle Soup",
            desc: "You helped the turtles to the sea.",
            imag: "http://www.playstationtrophies.org/images/trophies/1745/1EA.jpg"
        },{
            game: "Bully",
            name: "Soda 'Licious",
            desc: "Buy 100 sodas.",
            imag: "http://www.playstationtrophies.org/images/trophies/4480/4f8.jpg"
        },{
            game: "Color Guardians",
            name: "Lollilollilollilollipop",
            desc: "Collect 100 big color orbs.",
            imag: "http://www.playstationtrophies.org/images/trophies/3438/bf6.jpg"
        },{
            game: "Danganronpa: Trigger Happy Havoc",
            name: "Mystic Donut",
            desc: "Filled in every page of Aoi's Report Card",
            imag: "http://www.playstationtrophies.org/images/trophies/2542/810.jpg"
        },{
            game: "Day of the Tentacle Remastered",
            name: "Chef",
            desc: "Cook the hamster in Maniac Mansion (Don't try this at home, kids!)",
            imag: "http://www.playstationtrophies.org/images/trophies/4077/a11.jpg"
        },{
            game: "God of War",
            name: "Get Me a Beer Kid",
            desc: "Free yourself from the depths of Hades",
            imag: "http://www.playstationtrophies.org/images/trophies/263/1.jpg"
        },{
            game: "Guacamelee!",
            name: "Delicious",
            desc: "Complete the World's Greatest Enchilada quest",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/DDE.jpg"
        },{
            game: "Hatoful Boyfriend",
            name: "A Pudding Odyssey",
            desc: "Get Okosan full ending (ED no.07)",
            imag: "http://www.playstationtrophies.org/images/trophies/3230/663.jpg"
        },{
            game: "inFamous",
            name: "Good Eats",
            desc: "Good guys feed the needy.",
            imag: "http://www.playstationtrophies.org/images/trophies/122/1.jpg"
        },{
            game: "Jak and Daxter: The Precursor Legacy HD",
            name: "Eggs Over Hard",
            desc: "Push the Flut Flut Egg Off the Cliff",
            imag: "http://www.playstationtrophies.org/images/trophies/1217/366.jpg"
        },{
            game: "Kung Fu Rabbit",
            name: "THE BIG FAT CARROT",
            desc: "Pick up a gold carrot. These carrots are worth more than ordinary carrots, and reappear at the end of a level. Play levels over to collect the carrots.",
            imag: "http://www.playstationtrophies.org/images/trophies/2163/429.jpg"
        },{
            game: "LEGO Jurassic World",
            name: "...And an apple turnover!",
            desc: "Complete Chapter 4",
            imag: "http://www.playstationtrophies.org/images/trophies/3377/025.jpg"
        },{
            game: "LEGO The Hobbit",
            name: "The People Need Food",
            desc: "Use all the fishing spots in the game as Bard",
            imag: "http://www.playstationtrophies.org/images/trophies/2664/738.jpg"
        },{
            game: "Lone Survivor",
            name: "Candyman",
            desc: "Eat five fruit drops, no more than once a day",
            imag: "http://www.playstationtrophies.org/images/trophies/1967/8ED.jpg"
        },{
            game: "Minecraft",
            name: "Bake Bread",
            desc: "Turn wheat into bread.",
            imag: "http://www.playstationtrophies.org/images/trophies/3104/c48.jpg"
        },{
            game: "PlayStation All-Stars Battle Royale",
            name: "Cake, please!",
            desc: "Complete Arcade Mode with Fat Princess",
            imag: "http://www.playstationtrophies.org/images/trophies/1308/9B4.jpg"
        },{
            game: "Road Not Taken",
            name: "Savory Stew",
            desc: "Ate Raccoon Stew",
            imag: "http://www.playstationtrophies.org/images/trophies/2447/00e.jpg"
        },{
            game: "Saints Row IV",
            name: "Ooo A Piece of Candy!",
            desc: "Find 100 Data Clusters.",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/BBB.jpg"
        },{
            game: "Sam & Max: Beyond Time and Space - Episode 1: Ice Station Santa",
            name: "A Sinful Dessert",
            desc: "Get the Christmas Spirits to take care of that pesky demon.",
            imag: "http://www.playstationtrophies.org/images/trophies/1226/10.jpg"
        },{
            game: "Snoopy's Grand Adventure",
            name: "Jelly Beans",
            desc: "Complete Chapter 4",
            imag: "http://www.playstationtrophies.org/images/trophies/3788/888.jpg"
        },{
            game: "The Quiet Collection",
            name: "Candy, please!",
            desc: "Solve all of the puzzles in \"Candy, Please!\"",
            imag: "http://www.playstationtrophies.org/images/trophies/3883/765.jpg"
        },{
            game: "The Walking Dead: Season 2",
            name: "Fresh Fish",
            desc: "Arrived at your new home.",
            imag: "http://www.playstationtrophies.org/images/trophies/2352/17.jpg"
        },{
            game: "Tower of Guns",
            name: "Eating Your Cake Too",
            desc: "Finish a 10th run",
            imag: "http://www.playstationtrophies.org/images/trophies/3543/316.jpg"
        },{
            game: "Ultratron",
            name: "Healthy Diet",
            desc: "Consumed 10 consecutive fruits",
            imag: "http://www.playstationtrophies.org/images/trophies/3622/3b3.jpg"
        },{
            game: "Whispering Willows",
            name: "Wine Not",
            desc: "Open the Wine Cellar Passage",
            imag: "http://www.playstationtrophies.org/images/trophies/3764/c5b.jpg"
        }]
    },{
        listName: "Vy's Glow in the Dark Role Playing Mix",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_vy.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_vyrastas64.png",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Undertaker",
            desc: "Discover the Assassin's Tomb inside the catacombs under Santa Maria Novella",
            imag: "http://www.playstationtrophies.org/images/trophies/260/09.jpg"
        },{
            game: "Assassin's Creed Brotherhood",
            name: "Plumber",
            desc: "Discover the Shrine in the Cloaca Maxima",
            imag: "http://www.playstationtrophies.org/images/trophies/362/19.jpg"
        },{
            game: "Back to the Future: The Game",
            name: "Moonwalker",
            desc: "Busted a move, 80's style",
            imag: "http://www.playstationtrophies.org/images/trophies/1245/60.jpg"
        },{
            game: "Castlevania: Lords of Shadow",
            name: "Brawler",
            desc: "Buy 15 combos",
            imag: "http://www.playstationtrophies.org/images/trophies/420/37.jpg"
        },{
            game: "Darksiders",
            name: "Reaper",
            desc: "Collect the Scythe",
            imag: "http://www.playstationtrophies.org/images/trophies/276/22.jpg"
        },{
            game: "Dead Nation",
            name: "Looter",
            desc: "Collect All The Loot In Any Mission",
            imag: "http://www.playstationtrophies.org/images/trophies/592/34.jpg"
        },{
            game: "Dead Space",
            name: "Slugger",
            desc: "Kill the Slug Boss with more than 50% Shield strength remaining",
            imag: "http://www.playstationtrophies.org/images/trophies/26/039.jpg"
        },{
            game: "Dragon Age: Origins",
            name: "Dragonslayer",
            desc: "Defeated the dragon guarding the Urn of Sacred Ashes",
            imag: "http://www.playstationtrophies.org/images/trophies/270/25.jpg"
        },{
            game: "Fallout 3",
            name: "Protector",
            desc: "Reached Level 8 with Good Karma",
            imag: "http://www.playstationtrophies.org/images/trophies/70/033.jpg"
        },{
            game: "Final Fantasy XIII",
            name: "Loremaster",
            desc: "Discerned the full attributes of 100 enemies",
            imag: "http://www.playstationtrophies.org/images/trophies/307/35.jpg"
        },{
            game: "God of War II",
            name: "Swinger",
            desc: "Cross the collapsing Grapple Bridge",
            imag: "http://www.playstationtrophies.org/images/trophies/264/1.jpg"
        },{
            game: "God of War: Chains of Olympus",
            name: "Cosplayer",
            desc: "Play the game with an unlocked costume",
            imag: "http://www.playstationtrophies.org/images/trophies/1068/34.jpg"
        },{
            game: "HEAVY RAIN",
            name: "Butcher (h)",
            desc: "The lizard, cut your finger using saw or scissors",
            imag: "http://www.playstationtrophies.org/images/trophies/321/26.jpg"
        },{
            game: "Hydrophobia Prophecy",
            name: "Survivor (h)",
            desc: "Completed the game",
            imag: "http://www.playstationtrophies.org/images/trophies/1006/01.jpg"
        },{
            game: "inFAMOUS 2",
            name: "Mountaineer",
            desc: "Climb to the top of the 3 tallest buildings in New Marais",
            imag: "http://www.playstationtrophies.org/images/trophies/571/27.jpg"
        },{
            game: "Lara Croft and the Guardian of Light",
            name: "Breadwinner",
            desc: "Earn the top score objective in any level",
            imag: "http://www.playstationtrophies.org/images/trophies/433/07.jpg"
        },{
            game: "LittleBigPlanet",
            name: "Homemaker",
            desc: "Place 10 stickers or decorations in your pod",
            imag: "http://www.playstationtrophies.org/images/trophies/14/10.jpg"
        },{
            game: "Machinarium",
            name: "Escaper",
            desc: "Escape Machinarium",
            imag: "http://www.playstationtrophies.org/images/trophies/1709/6AA.jpg"
        },{
            game: "Pac-Man Championship Edition DX",
            name: "Sparkster",
            desc: "Emit sparks for 1 second!",
            imag: "http://www.playstationtrophies.org/images/trophies/817/01.jpg"
        },{
            game: "Plants vs. Zombies",
            name: "Explodonator",
            desc: "Blast 10 zombies at once with a Cherry Bomb!",
            imag: "http://www.playstationtrophies.org/images/trophies/901/09.jpg"
        },{
            game: "Prince of Persia",
            name: "Improviser",
            desc: "Use the environment against an enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/59/017.jpg"
        },{
            game: "Ratchet & Clank: All 4 One",
            name: "Pyromancer",
            desc: "Barbecue four enemies at the same time using the Pyro Blaster",
            imag: "http://www.playstationtrophies.org/images/trophies/704/19.jpg"
        },{
            game: "Rayman Origins",
            name: "Explorer (r)",
            desc: "You found 25 hidden cages",
            imag: "http://www.playstationtrophies.org/images/trophies/651/09.jpg"
        },{
            game: "Shift 2: Unleashed",
            name: "Amateur",
            desc: "Reached Driver Level 5",
            imag: "http://www.playstationtrophies.org/images/trophies/696/02.jpg"
        },{
            game: "Sly Cooper: Thieves in Time",
            name: "Gunslinger (s)",
            desc: "Reunite with Sly's long lost Cooper relative in Episode 2",
            imag: "http://www.playstationtrophies.org/images/trophies/810/354.jpg"
        },{
            game: "Star Wars: The Force Unleashed",
            name: "Destroyer",
            desc: "Complete Level - Raxus Prime, act 2",
            imag: "http://www.playstationtrophies.org/images/trophies/195/10.jpg"
        },{
            game: "The Unfinished Swan",
            name: "Dreamer",
            desc: "Finish the King's Dream chapter",
            imag: "http://www.playstationtrophies.org/images/trophies/1530/E9E.jpg"
        },{
            game: "Titan Attacks!",
            name: "MULTIPLIER",
            desc: "Got the x9 multiplier",
            imag: "http://www.playstationtrophies.org/images/trophies/2713/b4a.jpg"
        },{
            game: "Tomb Raider: Underworld",
            name: "Roadkiller",
            desc: "Kill an enemy by running over it with the motorcycle",
            imag: "http://www.playstationtrophies.org/images/trophies/143/21.jpg"
        },{
            game: "Trine 2",
            name: "Icebreaker",
            desc: "Shatter three frozen enemies within one second",
            imag: "http://www.playstationtrophies.org/images/trophies/601/005.jpg"
        },{
            game: "Velocity Ultra",
            name: "Slacker",
            desc: "Beat the minesweeper minigame",
            imag: "http://www.playstationtrophies.org/images/trophies/2055/55E.jpg"
        },{
            game: "ABZU",
            name: "Breach",
            desc: "Leap from the water.",
            imag: "http://www.playstationtrophies.org/images/trophies/2843/59d.jpg"
        },{
            game: "King's Quest",
            name: "Napping on the Job",
            desc: "Took a Brief Nap.",
            imag: "http://www.playstationtrophies.org/images/trophies/3762/3a2.jpg"
        },{
            game: "Life Is Strange",
            name: "Macro Eyes",
            desc: "Take optional photo #1 in Episode 1: Chrysalis",
            imag: "http://www.playstationtrophies.org/images/trophies/3366/c78.jpg"
        },{
            game: "Mirror's Edge Catalyst",
            name: "Law-abiding citizen",
            desc: "A good Cascadian follows the rules",
            imag: "http://www.playstationtrophies.org/images/trophies/2098/c21.jpg"
        },{
            game: "The Order: 1886",
            name: "Collateral Damage",
            desc: "Kill 3 enemies with a single explosion",
            imag: "http://www.playstationtrophies.org/images/trophies/2104/ac0.jpg"
        }]
    },{
        listName: "Woody's Canaries",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_woody.png",
        award: "http://www.playstationtrophies.org/images/news/canaries64.png",
        trophies: [{
            game: "2010 FIFA World Cup",
            name: "Lightning Quick Strike",
            desc: "Score in under 90 seconds to beat the standing record for fastest goal in a World Cup finals match.",
            imag: "http://www.playstationtrophies.org/images/trophies/381/42.jpg"
        },{
            game: "Batman: Arkham Asylum",
            name: "Solitary Confinement",
            desc: "Capture and lock up Harley Quinn",
            imag: "http://www.playstationtrophies.org/images/trophies/192/11.jpg"
        },{
            game: "Batman: Arkham City",
            name: "Contract Terminated",
            desc: "Stop the contract operative",
            imag: "http://www.playstationtrophies.org/images/trophies/398/17.jpg"
        },{
            game: "Batman: Arkham Origins",
            name: "One eye open",
            desc: "Defeat Deathstroke",
            imag: "http://www.playstationtrophies.org/images/trophies/2009/004.jpg"
        },{
            game: "Bayonetta",
            name: "A Mother's Love",
            desc: "Defend Cereza during the out of body experience, ensuring she takes no damage.",
            imag: "http://www.playstationtrophies.org/images/trophies/52/19.jpg"
        },{
            game: "BioShock",
            name: "Little Sister Savior",
            desc: "The player has completed the game without harvesting any Little Sisters",
            imag: "http://www.playstationtrophies.org/images/trophies/23/49.jpg"
        },{
            game: "BioShock 2",
            name: "Master Protector",
            desc: "Got through a Gather with no damage and no one getting to the Little Sister.",
            imag: "http://www.playstationtrophies.org/images/trophies/309/33.jpg"
        },{
            game: "Borderlands 2",
            name: "Cool Story, Bro",
            desc: "Defeated Jack",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/3D0.jpg"
        },{
            game: "Captain America: Super Soldier",
            name: "And They All Fall Down",
            desc: "4 Enemies KO'd with a single Focused Shield Throw",
            imag: "http://www.playstationtrophies.org/images/trophies/769/D85.jpg"
        },{
            game: "Contrast",
            name: "To The Heroes Among Us",
            desc: "Unlocked when the player finds the hidden Extra Life 2012 Logo.",
            imag: "http://www.playstationtrophies.org/images/trophies/2114/00.jpg"
        },{
            game: "Far Cry 3",
            name: "Worst Date Ever",
            desc: "Rescue Liza from the burning building.",
            imag: "http://www.playstationtrophies.org/images/trophies/922/04C.jpg"
        },{
            game: "FIFA 10",
            name: "Grind it Out",
            desc: "Win a match with 10 men Online or when playing on Professional difficulty or higher",
            imag: "http://www.playstationtrophies.org/images/trophies/224/07.jpg"
        },{
            game: "FIFA 11",
            name: "Once in a Lifetime",
            desc: "Score as the Goalkeeper in any match",
            imag: "http://www.playstationtrophies.org/images/trophies/589/27.jpg"
        },{
            game: "FIFA 12",
            name: "Riding Bikes",
            desc: "Score with a bicycle kick",
            imag: "http://www.playstationtrophies.org/images/trophies/972/04.jpg"
        },{
            game: "FIFA 13",
            name: "Trolling for Goals",
            desc: "Score on a free kick after running over the ball",
            imag: "http://www.playstationtrophies.org/images/trophies/1429/C30.jpg"
        },{
            game: "FIFA 14",
            name: "Perfection",
            desc: "Score a Perfect Hat Trick (left foot, right foot, header)",
            imag: "http://www.playstationtrophies.org/images/trophies/1854/42B.jpg"
        },{
            game: "FIFA Street",
            name: "Rush Keepers!",
            desc: "Score a goal while controlling your Goal Keeper",
            imag: "http://www.playstationtrophies.org/images/trophies/1152/9B9.jpg"
        },{
            game: "Green Lantern: Rise of the Manhunters",
            name: "Emerald Warrior",
            desc: "Complete the game on Poozer of Enforcer difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/679/13.jpg"
        },{
            game: "inFAMOUS",
            name: "Goody Two Shoes",
            desc: "Reach full positive Karma.",
            imag: "http://www.playstationtrophies.org/images/trophies/122/2.jpg"
        },{
            game: "inFAMOUS 2",
            name: "Incorruptible",
            desc: "Earn full positive Karma.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/12.jpg"
        },{
            game: "inFAMOUS Second Son",
            name: "True Hero",
            desc: "Achieve Level 5 Good Karma",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/a42.jpg"
        },{
            game: "Injustice: Gods Among Us",
            name: "True Marksman",
            desc: "Win a match with Green Arrow using only arrows",
            imag: "http://www.playstationtrophies.org/images/trophies/1572/88F.jpg"
        },{
            game: "Iron Man 2",
            name: "The Bigger They Are",
            desc: "Defeat ULTIMO.",
            imag: "http://www.playstationtrophies.org/images/trophies/404/09.jpg"
        },{
            game: "Lightning Returns: Final Fantasy XIII",
            name: "The Chocobo's Savior",
            desc: "Proof of nursing the holy chocobo back to full health among the rich pastures of the Wildlands.",
            imag: "http://www.playstationtrophies.org/images/trophies/1700/374.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "San Romero Knights Savior",
            desc: "Rescued All Classmates.",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/4D7.jpg"
        },{
            game: "MARVEL VS. CAPCOM 3",
            name: "Avengers Assemble!",
            desc: "Make a team composed of the Big 3 and win a match. (Arcade/online only)",
            imag: "http://www.playstationtrophies.org/images/trophies/538/28.jpg"
        },{
            game: "RESOGUN",
            name: "Denied!",
            desc: "Save a human from Abductor's beam",
            imag: "http://www.playstationtrophies.org/images/trophies/2229/17.jpg"
        },{
            game: "Sonic Generations",
            name: "Action Hero",
            desc: "Perform all of Sonic's moves in Act 2.",
            imag: "http://www.playstationtrophies.org/images/trophies/999/29.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
            name: "A Measure of Mercy",
            desc: "Complete the game and choose the Light Side ending",
            imag: "http://www.playstationtrophies.org/images/trophies/397/11.jpg"
        },{
            game: "X-Men Origins: Wolverine",
            name: "The Dead Pool",
            desc: "Defeated Weapon 11 (Deadpool)",
            imag: "http://www.playstationtrophies.org/images/trophies/113/006.jpg"
        }]
    },{
        listName: "Xander45's Links to the Past",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_xander.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_xander64.png",
        trophies: [{
            game: "Asura's Wrath",
            name: "It Takes Two",
            desc: "Defeat Deus with Yasha in Episode 17.",
            imag: "http://www.playstationtrophies.org/images/trophies/751/1B7.jpg"
        },{
            game: "BioShock",
            name: "I Chose the Impossible",
            desc: "Complete the game on Survivor difficulty without using a Vita-chamber",
            imag: "http://www.playstationtrophies.org/images/trophies/23/53.jpg"
        },{
            game: "Borderlands 2",
            name: "Up High, Down Low",
            desc: "Gave Claptrap a high five",
            imag: "http://www.playstationtrophies.org/images/trophies/1145/39E.jpg"
        },{
            game: "Call of Duty: Modern Warfare 3",
            name: "This Is My Boomstick",
            desc: "Kill 30 enemies with the XM25 in 'Black Tuesday.'",
            imag: "http://www.playstationtrophies.org/images/trophies/422/30.jpg"
        },{
            game: "Catherine",
            name: "Play It Again, Vince...",
            desc: "Use the jukebox to change the music.",
            imag: "http://www.playstationtrophies.org/images/trophies/380/26.jpg"
        },{
            game: "Dead Rising 2",
            name: "Look at All That Juice",
            desc: "Create and consume all mixed drinks in the game",
            imag: "http://www.playstationtrophies.org/images/trophies/325/25.jpg"
        },{
            game: "Dragon Ball Z: Ultimate Tenkaichi",
            name: "All 7 Are Here!",
            desc: "Do a Chase Battle in Story Mode for the first time",
            imag: "http://www.playstationtrophies.org/images/trophies/1017/15.jpg"
        },{
            game: "Dragon Quest Heroes",
            name: "Avid Adventurer",
            desc: "Awarded for completing a large number of quests.",
            imag: "http://www.playstationtrophies.org/images/trophies/3038/1c3.jpg"
        },{
            game: "El Shaddai: Ascension of the Metatron",
            name: "Indomitable Soul",
            desc: "Execute 50 recovers.",
            imag: "http://www.playstationtrophies.org/images/trophies/596/45.jpg"
        },{
            game: "Fallout 3",
            name: "Pinnacle of Survival",
            desc: "Reached Level 14 with Neutral Karma",
            imag: "http://www.playstationtrophies.org/images/trophies/70/035.jpg"
        },{
            game: "Final Fantasy X HD",
            name: "Show Off!",
            desc: "Win a blitzball tournament",
            imag: "http://www.playstationtrophies.org/images/trophies/1184/a50.jpg"
        },{
            game: "God of War",
            name: "You Got the Touch!",
            desc: "Climbed the Spiked Column in Hades without taking damage",
            imag: "http://www.playstationtrophies.org/images/trophies/263/3.jpg"
        },{
            game: "Hotline Miami",
            name: "These Are My Guns",
            desc: "Complete chapter five barehanded",
            imag: "http://www.playstationtrophies.org/images/trophies/1923/0CB.jpg"
        },{
            game: "Just Cause 2",
            name: "I Believe I Can Fly",
            desc: "Base jump 1000 meters.",
            imag: "http://www.playstationtrophies.org/images/trophies/329/01.jpg"
        },{
            game: "Just Cause 3",
            name: "MOD Specialist",
            desc: "Unlock every Gear MOD in a single category.",
            imag: "http://www.playstationtrophies.org/images/trophies/3190/4da.jpg"
        },{
            game: "Katamari Forever",
            name: "Rolling Expert",
            desc: "Rolled up 7,650 objects before completing a Request.",
            imag: "http://www.playstationtrophies.org/images/trophies/222/28.jpg"
        },{
            game: "Kingdom Hearts Final Mix HD",
            name: "Coliseum Champion",
            desc: "Win the Hades Cup",
            imag: "http://www.playstationtrophies.org/images/trophies/1939/920.jpg"
        },{
            game: "Metal Gear Solid 3",
            name: "Like a Boss",
            desc: "Finish the game on any difficulty",
            imag: "http://www.playstationtrophies.org/images/trophies/1054/45.jpg"
        },{
            game: "Ni no Kuni: Wrath of the White Witch",
            name: "Treasure Hunter",
            desc: "Awarded for finding all hidden treasure chests.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/B5C.jpg"
        },{
            game: "Okami HD",
            name: "No Furball on the Menu",
            desc: "Make your way to shore without being swallowed by the Water Dragon.",
            imag: "http://www.playstationtrophies.org/images/trophies/1603/114.jpg"
        },{
            game: "Ratchet & Clank: Into the Nexus",
            name: "In Case of Zombies...",
            desc: "Purchase all weapons.",
            imag: "http://www.playstationtrophies.org/images/trophies/2172/122.jpg"
        },{
            game: "Rayman Legends",
            name: "Splinter Ray",
            desc: "Go through \"Mansion of the Deep\" without crossing any light from a Dark Sentry or touching any laser",
            imag: "http://www.playstationtrophies.org/images/trophies/1526/8E8.jpg"
        },{
            game: "Red Dead Redemption",
            name: "People are Still Strange",
            desc: "Complete 15 tasks for Strangers.",
            imag: "http://www.playstationtrophies.org/images/trophies/340/18.jpg"
        },{
            game: "Saints Row IV",
            name: "You Chose... Poorly",
            desc: "Surrender when given the chance.",
            imag: "http://www.playstationtrophies.org/images/trophies/1971/B86.jpg"
        },{
            game: "Shovel Knight",
            name: "On a Diet",
            desc: "Finish a level without eating any food.",
            imag: "http://www.playstationtrophies.org/images/trophies/3440/9ab.jpg"
        },{
            game: "Sonic Generations",
            name: "Mission Accomplished!",
            desc: "Clear all the Challenge Acts.",
            imag: "http://www.playstationtrophies.org/images/trophies/999/50.jpg"
        },{
            game: "Tekken Tag Tournament HD",
            name: "One Man Army (t)",
            desc: "Win 10 rounds without tagging.",
            imag: "http://www.playstationtrophies.org/images/trophies/1085/729.jpg"
        },{
            game: "Skyrim",
            name: "Hail Sithis!",
            desc: "Complete 'Hail Sithis!'",
            imag: "http://www.playstationtrophies.org/images/trophies/826/21.jpg"
        },{
            game: "The LEGO Movie - Videogame",
            name: "SPACESHIP SPACESHIP!",
            desc: "Complete all Master Builds in Server Room as Benny.",
            imag: "http://www.playstationtrophies.org/images/trophies/2182/E32.jpg"
        },{
            game: "Titan Souls",
            name: "Laser Eye Surgery",
            desc: "Kill the eye cube while pulling back the arrow",
            imag: "http://www.playstationtrophies.org/images/trophies/2905/21a.jpg"
        },{
            game: "ToeJam & Earl in Panic on Funkotron",
            name: "Inner Child",
            desc: "[TJ&E2] Clear \"Lil' Kid Mode\".",
            imag: "http://www.playstationtrophies.org/images/trophies/1792/D7C.jpg"
        },{
            game: "Tokyo Jungle",
            name: "King of the Jungle",
            desc: "Survive 100 years in SURVIVAL.",
            imag: "http://www.playstationtrophies.org/images/trophies/1518/4D5.jpg"
        },{
            game: "Tower of Guns",
            name: "Trophy Farming 101",
            desc: "Kill over 350 Enemies in a Single Level",
            imag: "http://www.playstationtrophies.org/images/trophies/3305/af8.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "First Treasure (2)",
            desc: "Find one treasure",
            imag: "http://www.playstationtrophies.org/images/trophies/214/02.jpg"
        },{
            game: "Where the Wild Things Are",
            name: "Friend of Alexander",
            desc: "Collect 25 Turtles",
            imag: "http://www.playstationtrophies.org/images/trophies/251/16.jpg"
        }]
    }/*,{
        listName: "LISTNAME",
        banner: "BANNER",
        award: "AWARD",
        trophies: [{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        }]
    }*/];
});
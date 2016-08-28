var app = angular.module("ctlApp", []);
app.controller("myCtrl", function($scope) {
    /* Click Trophy Checkbox */
    $scope.saveTrophy = function() {
        if(this.formElem.checkbox){
            localStorage.setItem("t-" + this.trophyV.name, true);

            var trophyCount = document.getElementById("trophy_count").innerHTML;
            trophyCount = parseInt(trophyCount) + 1;
            document.getElementById("trophy_count").innerHTML = trophyCount.toString();
        } else {
            localStorage.removeItem("t-" + this.trophyV.name);

            var trophyCount = document.getElementById("trophy_count").innerHTML;
            trophyCount = parseInt(trophyCount) - 1;
            document.getElementById("trophy_count").innerHTML = trophyCount.toString();
        }
    };

    /* Click Game Checkbox */
    $scope.saveGame = function() {
        if(this.formElem.game_checkbox){
            localStorage.setItem("g-" + this.trophyV.game, true);
        } else {
            localStorage.removeItem("g-" + this.trophyV.game);
        }
    };

    /* Select a List - Get Local Storage */
    $scope.getListLS = function() {
        var trophyCount = 0;
        setTimeout(function(){
            /* Iterate over Trophies */
            angular.forEach(document.querySelectorAll(".trophy"), function(e){
                /* If the user has previously checked the Trophy */
                if(localStorage.getItem(e.id) =="true"){
                    /* Find the Checkbox and Check it */
                    document.getElementById(e.id.replace("t-","c-")).checked = true;

                    /* Increase the Trophy Count and update the HTML */
                    trophyCount++;
                    document.getElementById("trophy_count").innerHTML = trophyCount.toString();
                }
            });
            /* Iterate over Games */
            angular.forEach(document.querySelectorAll(".trophy .game"), function(e){
                /* If the user has previously checked the Trophy */
                if(localStorage.getItem(e.id) =="true"){
                    /* Find the Checkbox and Check it */
                    document.getElementById(e.id.replace("g-","c-")).checked = true;
                }
            });
        },100);
    };

    /* Custom Trophy Lists Array */
    $scope.lists = [{
        listName: "Aeirou's Virtual Murder Club",
        banner: "http://i.imgur.com/eZJLWU1.png",
        award: "http://i.imgur.com/BiR5YVs.jpg",
        trophies: [{
            game: "Assassin's Creed II",
            name: "Doctor",
            desc: "Perform an Air Assassination on a Poisoned NPC.",
            imag: "http://www.playstationtrophies.org/images/trophies/260/25.jpg"
        },{
            game: "Battlefield Hardline",
            name: "BYOB",
            desc: "Use the BBQ to take out the chef in Ep. 7: Glass Houses",
            imag: "http://www.playstationtrophies.org/images/trophies/2806/e18.jpg"
        },{
            game: "Bioshock",
            name: "Toaster in the Tub",
            desc: "The player has shocked an enemy in the water",
            imag: "http://www.playstationtrophies.org/images/trophies/23/48.jpg"
        },{
            game: "Bioshock Infinite",
            name: "Hazard Pay",
            desc: "Killed 10 enemies by utilizing environmental hazards.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/950.jpg"
        },{
            game: "Call of Duty Advanced Warfare",
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
            name: "Never Saw it Coming",
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
            game: "Infamous 2",
            name: "Watch That First Step",
            desc: "Defeat an enemy by destroying the object they stand on.",
            imag: "http://www.playstationtrophies.org/images/trophies/571/29.jpg"
        },{
            game: "inFAMOUS: Second Son",
            name: "Excessive Force",
            desc: "Use a Karmic Streak attack to defeat exactly one enemy",
            imag: "http://www.playstationtrophies.org/images/trophies/1936/54c.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "JULIET51",
            desc: "51 successful dropkicks.",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/195.jpg"
        },{
            game: "Middle Earth Shadow of Mordor",
            name: "Black Celebration",
            desc: "Poison a Captain at his own Feast.",
            imag: "http://www.playstationtrophies.org/images/trophies/2378/af1.jpg"
        },{
            game: "Portal 2",
            name: "Empty Gesture",
            desc: "Drop your co-op partner in goo while they are gesturing by removing the bridge under them",
            imag: "http://www.playstationtrophies.org/images/trophies/610/40.jpg"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        },{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
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
            game: "Binding of Isaac: Rebirth",
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
            game: "Infamous: First Light",
            name: "Expert",
            desc: "Complete 75% of all challenges",
            imag: "http://www.playstationtrophies.org/images/trophies/2878/4b9.jpg"
        },{
            game: "Jetpack Joyride",
            name: "For Science!",
            desc: "Knock over 1000 Scientists",
            imag: "http://www.playstationtrophies.org/images/trophies/1872/472.jpg"
        },{
            game: "Jetpack Joyride Deluxe",
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
            name: "Double Eleven",
            desc: "Play the game at either 11:11 am or 11:11 pm",
            imag: "http://www.playstationtrophies.org/images/trophies/2596/749.jpg"
        },{
            game: "Playstation All-Stars Battle Royale",
            name: "Let's Make a Scene",
            desc: "Complete Arcade mode with Sackboy",
            imag: "http://www.playstationtrophies.org/images/trophies/1587/44F.jpg"
        },{
            game: "Race the Sun",
            name: "Nighthawk",
            desc: "Reach level 15",
            imag: "http://www.playstationtrophies.org/images/trophies/2611/5c5.jpg"
        },{
            game: "Resogun",
            name: "Cool Trophy!",
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
            game: "Sonic and All Stars Racing Transformed",
            name: "Swirling Ranger",
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
            game: "TITAN ATTACKS!",
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
            game: "Atelier Escha & Logy: The Alchemists of Dusk Sky",
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
            name: "Giraffes? Giraffes! In Outer Space",
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
            name: "Chatterbox",
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
            game: "NieR",
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
            name: "Gunslinger",
            desc: "Assassinate General Amsel with a pistol shot. (Solo only)",
            imag: "http://www.playstationtrophies.org/images/trophies/41/025.jpg"
        },{
            game: "Fallout 3",
            name: "Oasis",
            desc: "Completed 'Oasis'",
            imag: "http://www.playstationtrophies.org/images/trophies/70/022.jpg"
        },{
            game: "God of War III",
            name: "I didn't do it...But I wish I did!",
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
            game: "Heavy Rain",
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
            name: "Untouchable",
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
            name: "Paramour",
            desc: "Complete any romance subplot",
            imag: "http://www.playstationtrophies.org/images/trophies/1743/8F3.jpg"
        },{
            game: "Mortal Kombat",
            name: "Finish What You Start!",
            desc: "Perform a Fatality with all playable fighters",
            imag: "http://www.playstationtrophies.org/images/trophies/593/10.jpg"
        },{
            game: "Oddworld: Munch's Oddysee HD",
            name: "You Snooze, You Lose",
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
            game: "Plants Vs Zombies (Vita)",
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
            desc: "Force José Parrot to squawk out 8 unique quips.",
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
            name: "Endured with the best",
            desc: "Complete an Endurance Championship with the Ravenwest team.",
            imag: "http://www.playstationtrophies.org/images/trophies/2701/e48.jpg"
        },{
            game: "Hatsune Miku: Project Diva f",
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
            game: "Ni No Kuni: Wrath of the White Witch",
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
            game: "The Elder Scrolls V: Skyrim",
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
            game: "Assassin's Creed IV: Black Flag",
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
            game: "Demons' Souls",
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
            name: "Never Saw it Coming",
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
            game: "Lara Croft and The Guardian of Light",
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
            game: "Ni No Kuni: Wrath of the White Witch",
            name: "Humanitarian of the Year",
            desc: "Awarded for running 60 different errands.",
            imag: "http://www.playstationtrophies.org/images/trophies/1399/0EC.jpg"
        },{
            game: "Portal 2",
            name: "Gesticul-8",
            desc: "Perform all 8 gestures of your own volition in co-op",
            imag: "http://www.playstationtrophies.org/images/trophies/610/38.jpg"
        },{
            game: "Ratchet & Clank",
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
            game: "The Elder Scrolls V: Skyrim",
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
            name: "Gwent Master",
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
            name: "Bolt From the Bluer",
            desc: "In the Main Campaign, killed 5 enemies with a headshot while riding a Sky-Line.",
            imag: "http://www.playstationtrophies.org/images/trophies/700/0CF.jpg"
        },{
            game: "Borderlands",
            name: "Pandora-dog Millionaire",
            desc: "Earned $1,000,000",
            imag: "http://www.playstationtrophies.org/images/trophies/39/31.jpg"
        },{
            game: "Call of Duty: Advanced Warfare",
            name: "Never Saw it Coming",
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
            game: "Heavy Rain",
            name: "The Chef",
            desc: "Eureka - Prepare a good omelette on time",
            imag: "http://www.playstationtrophies.org/images/trophies/321/37.jpg"
        },{
            game: "inFAMOUS First Light",
            name: "That's So Fetch!",
            desc: "Complete all Neon Graffiti",
            imag: "http://www.playstationtrophies.org/images/trophies/2878/9f5.jpg"
        },{
            game: "Magus",
            name: "I Feel...Drained...",
            desc: "Absorb the color from a power stone.",
            imag: "http://www.playstationtrophies.org/images/trophies/2578/644.jpg"
        },{
            game: "Middle-earth: Shadow of Mordor",
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
            game: "Super Hang-on",
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
        listName: "chrisheadshot's Aim Hacks Club",
        banner: "http://i.imgur.com/nAYG4Nn.png",
        award: "http://i.imgur.com/HYsVMI3.png",
        trophies: [{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
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
            game: "Grand Theft Auto 5",
            name: "Close Shave",
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
            desc: "Finish the game on Normal Mode ",
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
            game: "DmC: Devil May Cry",
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
            game: "Metal Gear Solid 3: Snake Eater HD",
            name: "PEACE WALKER",
            desc: "Finish game without killing anyone",
            imag: "http://www.playstationtrophies.org/images/trophies/1054/46.jpg"
        },{
            game: "Metal Gear Solid 4: Guns of the Patriots",
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
            game: "Persona 4: Golden",
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
            game: "The Elder Scrolls V: Skyrim",
            name: "Hail Sithis!",
            desc: "Complete 'Hail Sithis!'",
            imag: "http://www.playstationtrophies.org/images/trophies/826/21.jpg"
        },{
            game: "Uncharted 2: Among Thieves",
            name: "Charted!",
            desc: "Easy - Finish the game in Easy Mode",
            imag: "http://www.playstationtrophies.org/images/trophies/214/43.jpg"
        },{
            game: "Zero Escape: Virtue's Last Reward",
            name: "A Consumate Collection",
            desc: "Found ALL the files!",
            imag: "http://www.playstationtrophies.org/images/trophies/1796/3EE.jpg"
        }]
    },{
        listName: "Doctor Bink's Trophy Laboratory",
        banner: "http://i.imgur.com/U8OHKla.png",
        award: "http://i.imgur.com/en7lL9S.jpg",
        trophies: [{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        }]
    },{
        listName: "Fletch's \"Valar Morghulis\"",
        banner: "http://www.playstationtrophies.org/images/news/cl_banner_fletch.png",
        award: "http://www.playstationtrophies.org/forum/images/awards/cl_fletchar64.png",
        trophies: [{
            game: "Assassin's Creed III",
            name: "Jager Bomb",
            desc: "After becoming fully notorious, kill 10 Jagers before losing your notoriety. ",
            imag: "http://www.playstationtrophies.org/images/trophies/1400/A2A.jpg"
        },{
            game: "Assassin's Creed IV: Black Flag",
            name: "Roped In",
            desc: "Perform 5 air assassinations from a swinging rope.",
            imag: "http://www.playstationtrophies.org/images/trophies/1949/F36.jpg"
        },{
            game: "Assassin's Creed Revelations",
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
            name: "My Brother Is An Italian Plumber",
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
            game: "Guacamelee",
            name: "Flawless",
            desc: "Defeat an arena without taking any damage",
            imag: "http://www.playstationtrophies.org/images/trophies/1568/409.jpg"
        },{
            game: "Hitman Absolution",
            name: "Whoops",
            desc: "Achieve your first accidental kill",
            imag: "http://www.playstationtrophies.org/images/trophies/678/B77.jpg"
        },{
            game: "InFamous 2",
            name: "I'm As Shocked As You Are",
            desc: "Defeat an enemy or civilian by stepping in water",
            imag: "http://www.playstationtrophies.org/images/trophies/571/44.jpg"
        },{
            game: "L.A. Noire",
            name: "Roscoe and Friends",
            desc: "Kill at least one bad guy with every gun. ",
            imag: "http://www.playstationtrophies.org/images/trophies/358/29.jpg"
        },{
            game: "LittleBigPlanet 2",
            name: "Mortal Coil Shuffler Extraordinaire",
            desc: "Accumulate 20 deaths in one story level.",
            imag: "http://www.playstationtrophies.org/images/trophies/533/17.jpg"
        },{
            game: "Lollipop Chainsaw",
            name: "Zed's Dead Baby, Zed's Dead",
            desc: "Defeated Zed",
            imag: "http://www.playstationtrophies.org/images/trophies/1134/012.jpg"
        },{
            game: "Mafia 2",
            name: "Out For Justice",
            desc: "Learn what it means to be a Scaletta",
            imag: "http://www.playstationtrophies.org/images/trophies/351/48.jpg"
        },{
            game: "Portal 2",
            name: "Pit Boss",
            desc: "Show that pit who's boss",
            imag: "http://www.playstationtrophies.org/images/trophies/610/18.jpg"
        },{
            game: "Prototype 2",
            name: "Two For The Price Of One",
            desc: "Simultaneously kill 2 Brawlers using a single Devastator ",
            imag: "http://www.playstationtrophies.org/images/trophies/848/FD9.jpg"
        },{
            game: "Red Dead Redemption",
            name: "Dastardly",
            desc: "Place a hogtied woman on the train tracks, and witness her death by train",
            imag: "http://www.playstationtrophies.org/images/trophies/340/30.jpg"
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
            name: "Stick Saviour",
            desc: "You defeated Princess Kenny and recovered the stick of truth",
            imag: "http://www.playstationtrophies.org/images/trophies/1314/11C.jpg"
        },{
            game: "Star Wars: The Force Unleashed II",
            name: "Poor Bob",
            desc: "Force Grip a Stormtrooper, impale him with a lightsaber, zap him with Force Lightning, then throw him into an object.",
            imag: "http://www.playstationtrophies.org/images/trophies/397/44.jpg"
        },{
            game: "The Last Of Us",
            name: "Survivor +",
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
            name: "Survivor",
            desc: "Defeat 75 enemies in a row without dying",
            imag: "http://www.playstationtrophies.org/images/trophies/214/14.jpg"
        },{
            game: "Uncharted 3: Drake's Deception",
            name: "Expert Ninja",
            desc: "Defeat 5 enemies in a row using Stealth attacks",
            imag: "http://www.playstationtrophies.org/images/trophies/373/42.jpg"
        }]
    },{
        listName: "LISTNAME",
        banner: "BANNER",
        award: "AWARD",
        trophies: [{
            game: "GAME",
            name: "NAME",
            desc: "DESC",
            imag: "IMG"
        }]
    }];
});
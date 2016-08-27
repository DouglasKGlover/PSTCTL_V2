var app = angular.module("ctlApp", []);
app.controller("myCtrl", function($scope) {
    /* Custom Trophy Lists Array */
    $scope.lists = [{
        listName: "Noid's Gotta Beat These Games List",
        banner: "http://i.imgur.com/tztFrfm.png",
        trophies: [{
            id: 1,
            game: "Another World",
            name: "The End",
            desc: "To another world...",
            imag: "http://www.playstationtrophies.org/images/trophies/2819/f98.jpg"
        },    {
            id: 2,
            game: "Astebreed",
            name: "TO ALTER REALITY",
            desc: "Cleared the game on the Easy Difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/3485/565.jpg"
        },    {
            id: 3,
            game: "Bloodborne",
            name: "Yharnam Sunrise",
            desc: "You lived through the hunt, and saw another day.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/4cb.jpg"
        },    {
            id: 4,
            game: "Call of Duty: Advanced Warfare",
            name: "A New Era",
            desc: "Complete the campaign on any difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/8b5.jpg"
        },    {
            id: 5,
            game: "Call of Duty: Ghosts",
            name: "The Ghost Killer",
            desc: "Confront Rorke (Complete \"The Ghost Killer\" on any difficulty.)",
            imag: "http://www.playstationtrophies.org/images/trophies/2237/150.jpg"
        }]
    },{
        listName: "Another List",
        banner: "http://i.imgur.com/tztFrfm.png",
        trophies: [{
            id: 6,
            game: "Another World",
            name: "The End",
            desc: "To another world...",
            imag: "http://www.playstationtrophies.org/images/trophies/2819/f98.jpg"
        },    {
            id: 7,
            game: "Astebreed",
            name: "TO ALTER REALITY",
            desc: "Cleared the game on the Easy Difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/3485/565.jpg"
        },    {
            id: 8,
            game: "Bloodborne",
            name: "Yharnam Sunrise",
            desc: "You lived through the hunt, and saw another day.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/4cb.jpg"
        },    {
            id: 9,
            game: "Call of Duty: Advanced Warfare",
            name: "A New Era",
            desc: "Complete the campaign on any difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/8b5.jpg"
        },    {
            id: 10,
            game: "Call of Duty: Ghosts",
            name: "The Ghost Killer",
            desc: "Confront Rorke (Complete \"The Ghost Killer\" on any difficulty.)",
            imag: "http://www.playstationtrophies.org/images/trophies/2237/150.jpg"
        }]
    }];

    /* Click Trophy Checkbox */
    $scope.saveTrophy = function() {
        console.log(this.trophyV.id + " " + this.formElem.checkbox);
        localStorage.setItem("t-" + this.trophyV.id, this.formElem.checkbox);
    };

    /* Select a List - Get Local Storage */
    $scope.getListLS = function() {
        setTimeout(function(){
            /* Iterate over Trophies */
            angular.forEach(document.querySelectorAll(".trophy"), function(e){
                /* If the user has previously checked the Trophy */
                if(localStorage.getItem(e.id) == "true"){
                    /* Find the Checkbox and Check it */
                    document.getElementById(e.id.replace("t-","c-")).checked = true;
                }
            });
        },100);
    };
});
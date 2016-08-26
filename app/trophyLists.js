var app = angular.module("ctlApp", []);
app.controller("myCtrl", function($scope) {
    $scope.lists = [{
        listName: "Noid's Gotta Beat These Games List",
        banner: "http://i.imgur.com/tztFrfm.png",
        trophies: [{
            game: "Another World",
            name: "The End",
            desc: "To another world...",
            imag: "http://www.playstationtrophies.org/images/trophies/2819/f98.jpg"
        },    {
            game: "Astebreed",
            name: "TO ALTER REALITY",
            desc: "Cleared the game on the Easy Difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/3485/565.jpg"
        },    {
            game: "Bloodborne",
            name: "Yharnam Sunrise",
            desc: "You lived through the hunt, and saw another day.",
            imag: "http://www.playstationtrophies.org/images/trophies/2840/4cb.jpg"
        },    {
            game: "Call of Duty: Advanced Warfare	",
            name: "A New Era",
            desc: "Complete the campaign on any difficulty.",
            imag: "http://www.playstationtrophies.org/images/trophies/2734/8b5.jpg"
        },    {
            game: "Call of Duty: Ghosts",
            name: "The Ghost Killer",
            desc: "Confront Rorke (Complete \"The Ghost Killer\" on any difficulty.)",
            imag: "http://www.playstationtrophies.org/images/trophies/2237/150.jpg"
        }]
    },{
        listName: "Gage sucks trololol",
        banner: "http://i.imgur.com/tztFrfm.png",
        trophies: [{
            name: "Test Trophy 1",
            desc: "This is a test GAGE",
            imag: "http://i.imgur.com/eQO4sS4.jpg"
        },    {
            name: "Test Trophy 2",
            desc: "Also a test",
            imag: "http://i.imgur.com/h4798yL.jpg"
        },    {
            name: "Test Trophy 3",
            desc: "One more for good measure",
            imag: "http://i.imgur.com/eQO4sS4.jpg"
        }]
    }];
});
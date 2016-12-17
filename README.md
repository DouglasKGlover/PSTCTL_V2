# PSTLists.com

This project aims to make tracking progress on Custom Trophy Lists on PlayStationTrophies.org simple and easy.

## What it does

Users first choose a list from the dropdown menu which they wish to track progress on. They can then check off which trophies they've earned as well as the games they own. This information is immediately (onclick) stored in HTML5 localStorage, and is shared across lists. So if you check "Game A" on "List X", "Game A" will also be checked off for you on "List Y" (all lists containing that game).

Users who have saved their progress may click on the "BBCode" button to receive the BBCode require to sign up their progress on the site.

## What's the tech?

### Jquery

I previously was using Angular for this project, but decided to rebuild it with JQuery. I was learning Angular through this project, and while I feel that I have indeed learned much, part of that learning is that I was doing it horribly. I'll continue to use Angular in other projects, but since this is used by a large number of people, I will be using JQuery since I can (at this time) make more updates faster with the code I already know through previous experience.

### Lists

The lists themselves are contained in a scope array in lists.js. Each list currently has a name, banner, and award image. Each trophy in the list contains the game name, trophy name, trophy description, and trophy image/icon.

### Sass

The site uses Sass for it's styles.

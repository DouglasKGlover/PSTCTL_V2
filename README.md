# PSTLists.com

This project aims to make tracking progress on Custom Trophy Lists on PlayStationTrophies.org simple and easy.

## What it does

Users first choose a list from the dropdown menu which they wish to track progress on. They can then check off which trophies they've earned as well as the games they own. This information is immediately (onclick) stored in HTML5 localStorage, and is shared across lists. So if you check "Game A" on "List X", "Game A" will also be checked off for you on "List Y" (all lists containing that game).

Users who have saved their progress may click on the "BBBCode" button to receive the BBCode require to sign up their progress on the site.

## What's the tech?

This is my first foray into Angular on something that is used by actual users. As such, it is not perfect and comes with no guarantees. That said, to the best of my knowledge it functions as described above. It is an ever-changing code base and is delivered "as-is"; alpha and beta phases were used to get user feedback before the launch.

### Angular

As mentioned above, this is my first time making a production-ready site using Angular. As such, I make no claim to its perfection, and am happy to take suggestions if anyone should stumble upon this git repo and wants to take a look. You can even pull the code, edit it, and send me the update if you wish. I will take a look at the change(s) made and approve if they fit the overall goal of the product.

### Lists

The lists themselves are contained in a scope array in trophyLists.js. Each list currently has a name, banner, and award image. Each trophy in the list contains the game name, trophy name, trophy description, and trophy image/icon.

### Sass

The site uses Sass for it's styles.
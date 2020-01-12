# True Colors Link Service
A service which offers a simple link between ROBLOX services and Discord so all data and user information is united and easy to access. A product of the True Colors Development Team.

-atom#0001

## Setup
Setting up this project for production is fairly straight-forward, if you know about the system in place. There are "automatic" moderation systems in place, which are toggleable. However, if you are unsure about any random numbers in the config file, it may be best to leave it alone.

 Requirements:
- Discord Bot Token
- Rules and startup dedicated channels.
- A dedicated VPS (Virtual Private Server) for the Game Interface.
- A game.

The hardest part of all of this is the VPS. Make sure you port forward the port "5000". Any operating system could be used, Linux was the only testing candidate though.

## How It Works
### Discord Interface
We use a discord bot to serve data to the admin upon request. Since Discord is our main method of communication, this is concidered a central line. Previously using Trello, manual logging Discord channels, and having a group game, everything is easily accessable via Discord commands, including logs created from the game.

### Game Interface
The game interface is a bit more complex than the others. The game interacts with a web API with the included server. An in-game script holds both a ViewKey (for GET requests) and a PostKey (for POST requests.) Data is served to the gameserver to the admin client from the webserver. While the interface isn't as polished due to the existing game UI, the main features are satisfactory with logging and adding evidence and such.

### Export Service
Automated scripts can only do so much, as it doesn't account for human error. While there are scripts included in the source code to help export previous logs from Trello and Discord, some logs will need to be manually entered. At the time of writing this, there are 2600 logs on Discord. Plans to save logs which aren't able to be automatically saved to the database to a file are in the works.

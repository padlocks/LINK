# True Colors Link Service
A service which offers a simple link between ROBLOX services and Discord so all data and user information is united and easy to access. A product of the True Colors Development Team.

The initial goal of the LINK project was to create a more robust moderation system for TCA. The concepts and plans have changed since the initial unreleased project proposal from January 2018.
>  LINK is the automation and simple interface of various tasks of the True Colors Administration. As the acronym describes, it links everything together into a single and easy to use interface through Discord bot commands and a website dedicated to the True Colors staff team. The network would branch into both the Discord and our ROBLOX game (Skylands) in order to unify our logging system into one place. The use of a bot connected to LINK would verify users and send potentially suspicious information to the staff team to investigate while also connecting Discord accounts to ROBLOX accounts making it easy for the administration to connect users and their actions from both Discord and the group games.
 The website would include an improved appeal system which not only logs all appeals into a single place, but also helps keep the staff team focused on investigating the user using a Discord bot to message notifications, in #administration-chat and / or DMs, and website notifications. The entire goal of this project is to help create a more focused and structured administrative system.
-- *TCA LINK Project Proposal, September 1, 2018, Pascal Young*

After such a long wait, a lot of disscussion, unimaginable amounts of time and energy, the project is afloat and will be released Q1 of 2020 in the main True Colors group games. It may have taken 2 years, but for the product's success, this time has given us plenty of quality assurance tests and logistical problem solving time.

- atom#0001

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

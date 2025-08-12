Setup steps:
1) Copy .env.example to .env and fill in DISCORD_TOKEN, CLIENT_ID, GUILD_ID
2) In this folder, run: npm install
3) Start the bot: npm run start

Invite your bot to the server with the bot OAuth2 URL including the bot and applications.commands scopes, and permissions to read/send messages, connect to voice, speak, manage messages, ban/kick.

Prefix commands: !ping, !play <url>, !skip, !stop, !ban @user [reason], !kick @user [reason], !mute @user <minutes> [reason], !unmute @user
Slash commands: /ping, /play, /skip, /stop, /ban, /kick, /mute, /unmute, /queue
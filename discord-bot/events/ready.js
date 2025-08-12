const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Music & Moderation');

    // Register slash commands
    const commands = [];
    for (const command of client.commands.values()) {
      commands.push({
        name: command.name,
        description: command.description,
        options: command.options || []
      });
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
      if (process.env.NODE_ENV === 'production') {
        await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          { body: commands }
        );
        console.log('Successfully registered global application commands.');
      } else {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: commands }
        );
        console.log('Successfully registered guild application commands.');
      }
    } catch (error) {
      console.error('Failed to register application commands:', error.message || error);
    }
  }
};
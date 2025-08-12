const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'stop',
  description: 'Stop music and leave voice channel',
  cooldown: 1,
  async slashExecute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });

    const connection = getVoiceConnection(interaction.guildId);
    if (!connection) return interaction.reply({ content: 'Not connected to voice.', ephemeral: true });
    if (connection.joinConfig?.channelId !== voiceChannel.id) {
      return interaction.reply({ content: 'You must be in the same voice channel as the bot to use this command.', ephemeral: true });
    }

    connection.destroy();
    
    // Clear the queue and player
    const playModule = require('./play');
    const players = playModule.players;
    const queues = playModule.queues;
    
    if (players) players.delete(interaction.guildId);
    if (queues) queues.delete(interaction.guildId);
    
    await interaction.reply('Stopped music and left the voice channel!');
  },
  execute(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to be in a voice channel');

    const connection = getVoiceConnection(message.guildId);
    if (!connection) return message.reply('Not connected to voice');
    if (connection.joinConfig?.channelId !== voiceChannel.id) {
      return message.reply('You must be in the same voice channel as the bot to use this command.');
    }

    connection.destroy();
    
    // Clear the queue and player
    const playModule = require('./play');
    const players = playModule.players;
    const queues = playModule.queues;
    
    if (players) players.delete(message.guildId);
    if (queues) queues.delete(message.guildId);
    
    message.reply('Stopped music and left the voice channel!');
  }
};
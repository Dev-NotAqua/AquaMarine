const { AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'skip',
  description: 'Skip the current song',
  cooldown: 1,
  async slashExecute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });

    const connection = getVoiceConnection(interaction.guildId);
    if (!connection || connection.joinConfig?.channelId !== voiceChannel.id) {
      return interaction.reply({ content: 'You must be in the same voice channel as the bot to use this command.', ephemeral: true });
    }

    const player = require('./play').players?.get(interaction.guildId);
    if (!player) return interaction.reply({ content: 'No music is playing.', ephemeral: true });

    player.stop();
    await interaction.reply('Skipped the current song!');
  },
  execute(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to be in a voice channel');

    const { getVoiceConnection } = require('@discordjs/voice');
    const connection = getVoiceConnection(message.guildId);
    if (!connection || connection.joinConfig?.channelId !== voiceChannel.id) {
      return message.reply('You must be in the same voice channel as the bot to use this command.');
    }

    const players = require('./play').players;
    const player = players?.get(message.guildId);
    if (!player) return message.reply('No music is playing');

    player.stop();
    message.reply('Skipped the current song!');
  }
};
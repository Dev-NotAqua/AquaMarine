module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  cooldown: 1,
  async slashExecute(interaction) {
    await interaction.reply({ content: 'Pong!', ephemeral: true });
  },
  execute(message) {
    message.reply('Pong!');
  }
};
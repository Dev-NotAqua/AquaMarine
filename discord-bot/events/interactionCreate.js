const SecurityUtils = require('../utils/security');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    // Basic per-user rate limiting for slash commands
    const rateLimit = SecurityUtils.checkRateLimit(
      interaction.user.id,
      `slash:${interaction.commandName}`,
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10)
    );

    if (!rateLimit.allowed) {
      return interaction.reply({
        content: `Too many requests. Try again in ${rateLimit.retryAfter} second(s).`,
        ephemeral: true
      }).catch(() => {});
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.slashExecute(interaction, client);
    } catch (error) {
      console.error(error);
      const msg = 'There was an error executing this command.';
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: msg, ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
      }
    }
  }
};
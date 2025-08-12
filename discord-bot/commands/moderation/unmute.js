const SecurityUtils = require('../../utils/security');
const auditLogger = require('../../utils/audit');

module.exports = {
  name: 'unmute',
  description: 'Remove timeout from a user',
  options: [
    { name: 'user', type: 6, description: 'User to untimeout', required: true }
  ],
  permissions: ['ModerateMembers'],
  cooldown: 2,
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: 'You lack Moderate Members permission.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found in this guild.', ephemeral: true });

    if (!SecurityUtils.hasPermission(interaction.member, 'ModerateMembers', member)) {
      return interaction.reply({ content: 'You cannot untimeout this user due to role hierarchy or permissions.', ephemeral: true });
    }

    await member.timeout(null).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'UNMUTE',
      moderator: interaction.user,
      target: user,
      guildId: interaction.guildId,
      guildName: interaction.guild?.name,
      reason: 'Timeout removed'
    });

    await interaction.reply(`Removed timeout for ${user.tag}.`);
  },
  async execute(message, args) {
    if (!message.member.permissions.has('ModerateMembers')) return message.reply('You lack Moderate Members permission.');
    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention a user to untimeout.');

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return message.reply('User not found in this guild.');

    if (!SecurityUtils.hasPermission(message.member, 'ModerateMembers', member)) {
      return message.reply('You cannot untimeout this user due to role hierarchy or permissions.');
    }

    await member.timeout(null).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'UNMUTE',
      moderator: message.author,
      target: user,
      guildId: message.guildId,
      guildName: message.guild?.name,
      reason: 'Timeout removed'
    });

    message.channel.send(`Removed timeout for ${user.tag}.`);
  }
};
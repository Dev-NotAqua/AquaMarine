const SecurityUtils = require('../../utils/security');
const auditLogger = require('../../utils/audit');

module.exports = {
  name: 'kick',
  description: 'Kick a user',
  options: [
    { name: 'user', type: 6, description: 'User to kick', required: true },
    { name: 'reason', type: 3, description: 'Reason', required: false }
  ],
  permissions: ['KickMembers'],
  cooldown: 2,
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) {
      return interaction.reply({ content: 'You lack Kick Members permission.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    if (user.id === interaction.user.id) return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
    const reasonRaw = interaction.options.getString('reason');
    const reason = SecurityUtils.sanitizeReason(reasonRaw);
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found in this guild.', ephemeral: true });

    if (!SecurityUtils.hasPermission(interaction.member, 'KickMembers', member) || !member.kickable) {
      return interaction.reply({ content: 'I cannot kick this user due to role hierarchy or permissions.', ephemeral: true });
    }

    await member.kick(reason).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'KICK',
      moderator: interaction.user,
      target: user,
      guildId: interaction.guildId,
      guildName: interaction.guild?.name,
      reason
    });

    await interaction.reply(`Kicked ${user.tag} | Reason: ${reason}`);
  },
  async execute(message, args) {
    if (!message.member.permissions.has('KickMembers')) return message.reply('You lack Kick Members permission.');
    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention a user to kick.');
    if (user.id === message.author.id) return message.reply('You cannot kick yourself.');

    const reason = SecurityUtils.sanitizeReason(args.slice(1).join(' '));

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return message.reply('User not found in this guild.');

    if (!SecurityUtils.hasPermission(message.member, 'KickMembers', member) || !member.kickable) {
      return message.reply('I cannot kick this user due to role hierarchy or permissions.');
    }

    await member.kick(reason).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'KICK',
      moderator: message.author,
      target: user,
      guildId: message.guildId,
      guildName: message.guild?.name,
      reason
    });

    message.channel.send(`Kicked ${user.tag} | Reason: ${reason}`);
  }
};
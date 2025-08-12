const SecurityUtils = require('../../utils/security');
const auditLogger = require('../../utils/audit');

module.exports = {
  name: 'ban',
  description: 'Ban a user',
  options: [
    { name: 'user', type: 6, description: 'User to ban', required: true },
    { name: 'reason', type: 3, description: 'Reason', required: false }
  ],
  permissions: ['BanMembers'],
  cooldown: 2,
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has('BanMembers')) {
      return interaction.reply({ content: 'You lack Ban Members permission.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    if (user.id === interaction.user.id) return interaction.reply({ content: 'You cannot ban yourself.', ephemeral: true });
    const reasonRaw = interaction.options.getString('reason');
    const reason = SecurityUtils.sanitizeReason(reasonRaw);
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found in this guild.', ephemeral: true });
    
    // Enhanced permission & hierarchy check
    if (!SecurityUtils.hasPermission(interaction.member, 'BanMembers', member) || !member.bannable) {
      return interaction.reply({ content: 'I cannot ban this user due to role hierarchy or permissions.', ephemeral: true });
    }

    await member.ban({ reason }).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'BAN',
      moderator: interaction.user,
      target: user,
      guildId: interaction.guildId,
      guildName: interaction.guild?.name,
      reason
    });

    await interaction.reply(`Banned ${user.tag} | Reason: ${reason}`);
  },
  async execute(message, args) {
    if (!message.member.permissions.has('BanMembers')) return message.reply('You lack Ban Members permission.');
    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention a user to ban.');
    if (user.id === message.author.id) return message.reply('You cannot ban yourself.');

    const reason = SecurityUtils.sanitizeReason(args.slice(1).join(' '));

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return message.reply('User not found in this guild.');

    if (!SecurityUtils.hasPermission(message.member, 'BanMembers', member) || !member.bannable) {
      return message.reply('I cannot ban this user due to role hierarchy or permissions.');
    }

    await member.ban({ reason }).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'BAN',
      moderator: message.author,
      target: user,
      guildId: message.guildId,
      guildName: message.guild?.name,
      reason
    });

    message.channel.send(`Banned ${user.tag} | Reason: ${reason}`);
  }
};
const SecurityUtils = require('../../utils/security');
const auditLogger = require('../../utils/audit');

module.exports = {
  name: 'mute',
  description: 'Timeout a user for a duration in minutes',
  options: [
    { name: 'user', type: 6, description: 'User to timeout', required: true },
    { name: 'minutes', type: 4, description: 'Minutes to timeout', required: true },
    { name: 'reason', type: 3, description: 'Reason', required: false }
  ],
  permissions: ['ModerateMembers'],
  cooldown: 2,
  async slashExecute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: 'You lack Moderate Members permission.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    if (user.id === interaction.user.id) return interaction.reply({ content: 'You cannot timeout yourself.', ephemeral: true });
    const minutes = interaction.options.getInteger('minutes');
    if (isNaN(minutes) || minutes <= 0 || minutes > 43200) { // up to 30 days
      return interaction.reply({ content: 'Invalid duration. Use a value between 1 and 43200 minutes.', ephemeral: true });
    }
    const reason = SecurityUtils.sanitizeReason(interaction.options.getString('reason'));
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found in this guild.', ephemeral: true });

    if (!SecurityUtils.hasPermission(interaction.member, 'ModerateMembers', member)) {
      return interaction.reply({ content: 'You cannot timeout this user due to role hierarchy or permissions.', ephemeral: true });
    }

    const ms = minutes * 60 * 1000;
    await member.timeout(ms, reason).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'MUTE',
      moderator: interaction.user,
      target: user,
      guildId: interaction.guildId,
      guildName: interaction.guild?.name,
      reason,
      duration: `${minutes}m`
    });

    await interaction.reply(`Timed out ${user.tag} for ${minutes} minute(s). Reason: ${reason}`);
  },
  async execute(message, args) {
    if (!message.member.permissions.has('ModerateMembers')) return message.reply('You lack Moderate Members permission.');
    const user = message.mentions.users.first();
    if (!user) return message.reply('Usage: !mute @user <minutes> [reason]');
    if (user.id === message.author.id) return message.reply('You cannot timeout yourself.');

    const minutes = parseInt(args[1], 10);
    if (isNaN(minutes) || minutes <= 0 || minutes > 43200) return message.reply('Invalid duration. Use a value between 1 and 43200 minutes.');

    const reason = SecurityUtils.sanitizeReason(args.slice(2).join(' '));

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return message.reply('User not found in this guild.');

    if (!SecurityUtils.hasPermission(message.member, 'ModerateMembers', member)) {
      return message.reply('You cannot timeout this user due to role hierarchy or permissions.');
    }

    const ms = minutes * 60 * 1000;
    await member.timeout(ms, reason).catch(() => null);

    // Audit log
    auditLogger.logModerationAction({
      type: 'MUTE',
      moderator: message.author,
      target: user,
      guildId: message.guildId,
      guildName: message.guild?.name,
      reason,
      duration: `${minutes}m`
    });

    message.channel.send(`Timed out ${user.tag} for ${minutes} minute(s). Reason: ${reason}`);
  }
};
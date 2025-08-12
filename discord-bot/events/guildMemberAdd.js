const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    const welcomeChannel = member.guild.channels.cache.find(channel => 
      channel.name === 'welcome' || channel.name === 'general'
    );

    if (welcomeChannel) {
      const welcomeEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Welcome!')
        .setDescription(`Welcome to ${member.guild.name}, ${member}!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      welcomeChannel.send({ embeds: [welcomeEmbed] });
    }

    // Auto-assign member role if it exists
    const memberRole = member.guild.roles.cache.find(role => role.name === 'Member');
    if (memberRole) {
      member.roles.add(memberRole).catch(console.error);
    }
  }
};
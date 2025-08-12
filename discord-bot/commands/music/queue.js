const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { queues, players } = require('./play');

module.exports = {
  name: 'queue',
  description: 'Show the current music queue with controls',
  cooldown: 1,
  
  async slashExecute(interaction) {
    const queue = queues.get(interaction.guildId) || [];
    
    const embed = this.createQueueEmbed(queue, interaction.guild.name);
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },

  async execute(message) {
    const queue = queues.get(message.guildId) || [];
    const embed = this.createQueueEmbed(queue, message.guild.name);
    
    await message.channel.send({ embeds: [embed] });
  },

  createQueueEmbed(queue, guildName) {
    const embed = new EmbedBuilder()
      .setTitle(`🎵 Music Queue - ${guildName}`)
      .setColor('#5865F2')
      .setTimestamp();

    if (queue.length === 0) {
      embed.setDescription('Queue is empty');
    } else {
      const description = queue.slice(0, 10).map((url, index) => {
        const title = this.extractVideoTitle(url) || `Song ${index + 1}`;
        return `${index + 1}. ${title}`;
      }).join('\n');
      
      embed.setDescription(description);
      
      if (queue.length > 10) {
        embed.setFooter({ text: `Showing 10 of ${queue.length} songs` });
      } else {
        embed.setFooter({ text: `Total: ${queue.length} songs` });
      }
    }

    return embed;
  },

  extractVideoTitle(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1].substring(0, 50) + '...' : null;
  }
};
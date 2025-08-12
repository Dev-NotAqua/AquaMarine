const { Collection } = require('discord.js');
const SecurityUtils = require('../utils/security');

module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    // Prevent mass mentions and sanitize
    if (message.mentions.everyone) {
      return message.reply('Mass mentions are not allowed.');
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command || !command.execute) return;

    // Per-user rate limiting for prefix commands
    const rl = SecurityUtils.checkRateLimit(
      message.author.id,
      `prefix:${command.name}`,
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10)
    );

    if (!rl.allowed) {
      return message.reply(`Too many requests. Try again in ${rl.retryAfter} second(s).`);
    }

    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        return message.reply(`Please wait ${Math.round((expirationTime - now) / 1000)} more second(s) before reusing the \`${command.name}\` command.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command!');
    }
  }
};
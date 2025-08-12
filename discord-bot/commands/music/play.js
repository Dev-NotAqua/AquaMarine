const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const SecurityUtils = require('../../utils/security');

const players = new Map();
const queues = new Map();

module.exports.players = players;
module.exports.queues = queues;

module.exports.name = 'play';
module.exports.description = 'Play music from YouTube';
module.exports.options = [
  {
    name: 'query',
    type: 3,
    description: 'YouTube URL',
    required: true
  }
];
module.exports.cooldown = 2;

const MAX_QUEUE_LENGTH = 50;

module.exports.slashExecute = async function (interaction) {
  const urlRaw = interaction.options.getString('query');
  const url = SecurityUtils.validateInput(urlRaw, { maxLength: 200, pattern: /https?:\/\// });
  const member = interaction.member;
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });

  if (!SecurityUtils.isValidYouTubeUrl(url)) {
    return interaction.reply({ content: 'Please provide a valid YouTube URL.', ephemeral: true });
  }

  await interaction.deferReply();

  let queue = queues.get(interaction.guildId);
  if (!queue) {
    queue = [];
    queues.set(interaction.guildId, queue);
  }

  if (queue.length >= MAX_QUEUE_LENGTH) {
    return interaction.editReply('Queue is full. Please wait for some songs to finish.');
  }

  queue.push(url);

  if (!players.get(interaction.guildId)) {
    let connection;
    try {
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });
    } catch (e) {
      console.error('Voice connect error:', e);
      return interaction.editReply('Failed to join the voice channel.');
    }

    const player = createAudioPlayer();
    players.set(interaction.guildId, player);
    connection.subscribe(player);

    const playNext = async () => {
      const next = queue.shift();
      if (!next) {
        player.stop();
        return;
      }
      try {
        const stream = ytdl(next, { filter: 'audioonly', highWaterMark: 1 << 25 });
        const resource = createAudioResource(stream);
        player.play(resource);
      } catch (err) {
        console.error('Playback error:', err);
        return playNext();
      }
    };

    player.on(AudioPlayerStatus.Idle, playNext);
    player.on('error', (error) => {
      console.error('Audio player error:', error);
      playNext();
    });

    await interaction.editReply(`Joined ${voiceChannel.name} and queued: ${url}`);
    await playNext();
  } else {
    await interaction.editReply(`Queued: ${url}`);
  }
};

module.exports.execute = async function (message, args) {
  const urlRaw = args[0];
  const url = SecurityUtils.validateInput(urlRaw, { maxLength: 200, pattern: /https?:\/\// });
  const member = message.member;
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return message.reply('You need to be in a voice channel');

  if (!SecurityUtils.isValidYouTubeUrl(url)) {
    return message.reply('Please provide a valid YouTube URL.');
  }

  let queue = queues.get(message.guildId);
  if (!queue) {
    queue = [];
    queues.set(message.guildId, queue);
  }

  if (queue.length >= MAX_QUEUE_LENGTH) {
    return message.reply('Queue is full. Please wait for some songs to finish.');
  }

  queue.push(url);

  if (!players.get(message.guildId)) {
    let connection;
    try {
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guildId,
        adapterCreator: message.guild.voiceAdapterCreator
      });
    } catch (e) {
      console.error('Voice connect error:', e);
      return message.reply('Failed to join the voice channel.');
    }

    const player = createAudioPlayer();
    players.set(message.guildId, player);
    connection.subscribe(player);

    const playNext = async () => {
      const next = queue.shift();
      if (!next) {
        player.stop();
        return;
      }
      try {
        const stream = ytdl(next, { filter: 'audioonly', highWaterMark: 1 << 25 });
        const resource = createAudioResource(stream);
        player.play(resource);
      } catch (err) {
        console.error('Playback error:', err);
        return playNext();
      }
    };

    player.on(AudioPlayerStatus.Idle, playNext);
    player.on('error', (error) => {
      console.error('Audio player error:', error);
      playNext();
    });

    message.channel.send(`Joined ${voiceChannel.name} and queued: ${url}`);
    await playNext();
  } else {
    message.channel.send(`Queued: ${url}`);
  }
};
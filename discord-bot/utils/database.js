const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.dataPath = path.join(__dirname, '../data');
    this.guildsFile = path.join(this.dataPath, 'guilds.json');
    this.usersFile = path.join(this.dataPath, 'users.json');
    this.settingsFile = path.join(this.dataPath, 'settings.json');
    
    // Ensure data directory exists
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
    
    // Initialize files if they don't exist
    this.initFiles();
  }

  initFiles() {
    const files = [
      { path: this.guildsFile, default: {} },
      { path: this.usersFile, default: {} },
      { path: this.settingsFile, default: { global: {} } }
    ];

    files.forEach(({ path, default: defaultData }) => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify(defaultData, null, 2));
      }
    });
  }

  read(file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
      return {};
    }
  }

  write(file, data) {
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${file}:`, error);
      return false;
    }
  }

  // Guild operations
  getGuild(guildId) {
    const guilds = this.read(this.guildsFile);
    return guilds[guildId] || null;
  }

  setGuild(guildId, data) {
    const guilds = this.read(this.guildsFile);
    guilds[guildId] = { ...guilds[guildId], ...data, updatedAt: new Date().toISOString() };
    return this.write(this.guildsFile, guilds);
  }

  getAllGuilds() {
    return this.read(this.guildsFile);
  }

  // User operations
  getUser(userId) {
    const users = this.read(this.usersFile);
    return users[userId] || null;
  }

  setUser(userId, data) {
    const users = this.read(this.usersFile);
    users[userId] = { ...users[userId], ...data, updatedAt: new Date().toISOString() };
    return this.write(this.usersFile, users);
  }

  getAllUsers() {
    return this.read(this.usersFile);
  }

  // Settings operations
  getSetting(key, guildId = 'global') {
    const settings = this.read(this.settingsFile);
    return settings[guildId]?.[key] || settings.global[key] || null;
  }

  setSetting(key, value, guildId = 'global') {
    const settings = this.read(this.settingsFile);
    if (!settings[guildId]) settings[guildId] = {};
    settings[guildId][key] = value;
    return this.write(this.settingsFile, settings);
  }

  // Analytics
  addGuildStats(guildId, type, data) {
    const guild = this.getGuild(guildId) || {};
    if (!guild.stats) guild.stats = {};
    if (!guild.stats[type]) guild.stats[type] = [];
    
    guild.stats[type].push({
      ...data,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 entries
    if (guild.stats[type].length > 100) {
      guild.stats[type] = guild.stats[type].slice(-100);
    }
    
    return this.setGuild(guildId, guild);
  }

  getGuildStats(guildId, type = null) {
    const guild = this.getGuild(guildId);
    if (!guild || !guild.stats) return {};
    return type ? guild.stats[type] || [] : guild.stats;
  }
}

module.exports = new Database();
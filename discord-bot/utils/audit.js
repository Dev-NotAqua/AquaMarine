const fs = require('fs');
const path = require('path');

class AuditLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.auditLogPath = path.join(this.logDir, 'audit.log');
    this.securityLogPath = path.join(this.logDir, 'security.log');
    
    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log moderation actions
   * @param {Object} action - Action details
   */
  logModerationAction(action) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'MODERATION',
      action: action.type, // 'BAN', 'KICK', 'MUTE', 'UNMUTE'
      moderator: {
        id: action.moderator.id,
        tag: action.moderator.tag
      },
      target: {
        id: action.target.id,
        tag: action.target.tag
      },
      guild: {
        id: action.guildId,
        name: action.guildName
      },
      reason: action.reason,
      duration: action.duration || null
    };

    this.writeLog(this.auditLogPath, logEntry);
  }

  /**
   * Log security events
   * @param {Object} event - Security event details
   */
  logSecurityEvent(event) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'SECURITY',
      event: event.type, // 'RATE_LIMIT', 'INVALID_INPUT', 'PERMISSION_DENIED', etc.
      user: event.user ? {
        id: event.user.id,
        tag: event.user.tag
      } : null,
      guild: event.guild ? {
        id: event.guild.id,
        name: event.guild.name
      } : null,
      details: event.details,
      severity: event.severity || 'LOW' // LOW, MEDIUM, HIGH, CRITICAL
    };

    this.writeLog(this.securityLogPath, logEntry);
  }

  /**
   * Write log entry to file
   * @param {string} filePath - Path to log file
   * @param {Object} logEntry - Log entry object
   */
  writeLog(filePath, logEntry) {
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(filePath, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  /**
   * Get recent audit logs
   * @param {number} limit - Number of entries to return
   * @param {string} type - Filter by type ('MODERATION' or 'SECURITY')
   */
  getRecentLogs(limit = 100, type = null) {
    try {
      const logPath = type === 'SECURITY' ? this.securityLogPath : this.auditLogPath;
      if (!fs.existsSync(logPath)) return [];

      const logs = fs.readFileSync(logPath, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .reverse()
        .slice(0, limit);

      return type ? logs.filter(log => log.type === type) : logs;
    } catch (error) {
      console.error('Failed to read audit logs:', error);
      return [];
    }
  }

  /**
   * Clean up old logs (keep last 30 days)
   */
  cleanupOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    [this.auditLogPath, this.securityLogPath].forEach(logPath => {
      if (!fs.existsSync(logPath)) return;

      try {
        const logs = fs.readFileSync(logPath, 'utf8')
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
          .filter(log => new Date(log.timestamp) > cutoffDate);

        const newContent = logs.map(log => JSON.stringify(log)).join('\n') + '\n';
        fs.writeFileSync(logPath, newContent, 'utf8');
      } catch (error) {
        console.error('Failed to cleanup logs:', error);
      }
    });
  }
}

// Singleton instance
const auditLogger = new AuditLogger();

// Cleanup old logs daily
setInterval(() => {
  auditLogger.cleanupOldLogs();
}, 24 * 60 * 60 * 1000); // 24 hours

module.exports = auditLogger;
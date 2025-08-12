const { Collection } = require('discord.js');

// Rate limiting for additional security
const rateLimits = new Collection();

/**
 * Input validation and sanitization utilities
 */
class SecurityUtils {
  /**
   * Validate and sanitize user input
   * @param {string} input - User input to validate
   * @param {object} options - Validation options
   */
  static validateInput(input, options = {}) {
    if (!input || typeof input !== 'string') return null;
    
    // Remove potential harmful characters
    let sanitized = input.trim();
    
    // Length validation
    if (options.maxLength && sanitized.length > options.maxLength) {
      return sanitized.substring(0, options.maxLength);
    }
    
    if (options.minLength && sanitized.length < options.minLength) {
      return null;
    }
    
    // Pattern validation
    if (options.pattern && !options.pattern.test(sanitized)) {
      return null;
    }
    
    // Remove mentions if not allowed
    if (!options.allowMentions) {
      sanitized = sanitized.replace(/@(everyone|here)/gi, '');
    }
    
    return sanitized;
  }

  /**
   * Advanced rate limiting beyond Discord.js built-in cooldowns
   * @param {string} userId - User ID
   * @param {string} action - Action type (e.g., 'moderation', 'music')
   * @param {number} limit - Max actions per window
   * @param {number} windowMs - Time window in milliseconds
   */
  static checkRateLimit(userId, action = 'global', limit = 5, windowMs = 60000) {
    const key = `${userId}:${action}`;
    const now = Date.now();
    
    if (!rateLimits.has(key)) {
      rateLimits.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }
    
    const rateLimitData = rateLimits.get(key);
    
    if (now > rateLimitData.resetTime) {
      // Reset the rate limit
      rateLimits.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }
    
    if (rateLimitData.count >= limit) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: rateLimitData.resetTime,
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
      };
    }
    
    rateLimitData.count++;
    return { 
      allowed: true, 
      remaining: limit - rateLimitData.count, 
      resetTime: rateLimitData.resetTime 
    };
  }

  /**
   * Validate YouTube URL
   * @param {string} url - URL to validate
   */
  static isValidYouTubeUrl(url) {
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&[\w=]*)?$/;
    return ytRegex.test(url);
  }

  /**
   * Check if user has required permissions with enhanced validation
   * @param {GuildMember} member - Discord guild member
   * @param {string|array} permissions - Required permissions
   * @param {GuildMember} targetMember - Target member (for hierarchy checks)
   */
  static hasPermission(member, permissions, targetMember = null) {
    if (!member || !member.permissions) return false;
    
    // Convert single permission to array
    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    
    // Check if user has all required permissions
    const hasPerms = permsArray.every(perm => member.permissions.has(perm));
    if (!hasPerms) return false;
    
    // If targeting another member, check role hierarchy
    if (targetMember) {
      // Bot can't moderate server owner
      if (targetMember.id === member.guild.ownerId) return false;
      
      // Check role hierarchy
      if (member.roles.highest.position <= targetMember.roles.highest.position) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Sanitize reason strings for moderation actions
   * @param {string} reason - Moderation reason
   */
  static sanitizeReason(reason) {
    if (!reason) return 'No reason provided';
    
    return this.validateInput(reason, {
      maxLength: 500,
      allowMentions: false
    }) || 'Invalid reason provided';
  }

  /**
   * Log security events
   * @param {string} event - Event type
   * @param {object} data - Event data
   */
  static logSecurityEvent(event, data) {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} - ${event}:`, data);
  }

  /**
   * Clean up expired rate limit entries
   */
  static cleanupRateLimits() {
    const now = Date.now();
    for (const [key, data] of rateLimits) {
      if (now > data.resetTime) {
        rateLimits.delete(key);
      }
    }
  }
}

// Clean up rate limits every 5 minutes
setInterval(SecurityUtils.cleanupRateLimits, 5 * 60 * 1000);

module.exports = SecurityUtils;
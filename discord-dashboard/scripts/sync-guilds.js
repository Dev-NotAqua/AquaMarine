const { Client, GatewayIntentBits } = require('discord.js')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

async function syncGuilds() {
  try {
    console.log('Starting guild sync...')
    
    for (const guild of client.guilds.cache.values()) {
      console.log(`Syncing ${guild.name}...`)
      
      // Update or create guild
      await prisma.guild.upsert({
        where: { id: guild.id },
        update: {
          name: guild.name,
          icon: guild.icon,
          memberCount: guild.memberCount,
          updatedAt: new Date()
        },
        create: {
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          memberCount: guild.memberCount,
          joinedAt: guild.joinedAt || new Date()
        }
      })

      // Initialize stats if they don't exist
      await prisma.guildStats.upsert({
        where: { guildId: guild.id },
        update: {},
        create: {
          guildId: guild.id,
          songsPlayed: 0,
          moderationActions: 0,
          messagesReceived: 0,
          commandsUsed: 0
        }
      })

      console.log(`✅ Synced ${guild.name} (${guild.memberCount} members)`)
    }

    console.log('Guild sync completed!')
  } catch (error) {
    console.error('Error syncing guilds:', error)
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`)
  await syncGuilds()
  await prisma.$disconnect()
  process.exit(0)
})

client.login(process.env.DISCORD_BOT_TOKEN)
  .catch(console.error)
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

const TARGET_USERNAME = "zelda_life";
const WEBHOOK_URL = "YOUR_WEBHOOK_HERE";
const CODENAME = "hackis1";

let lastStatus = null;

// ===== UTIL =====
const rand = max => Math.floor(Math.random() * max);

function fakeIP() {
  return `${rand(255)}.${rand(255)}.${rand(255)}.${rand(255)}`;
}

function statusEmoji(status) {
  return {
    online: "🟢",
    idle: "🌙",
    dnd: "⛔",
    offline: "⚫"
  }[status] || "⚫";
}

function color(status) {
  return {
    online: 5763719,
    idle: 16705372,
    dnd: 15548997,
    offline: 8421504
  }[status] || 8421504;
}

async function sendWebhook(payload) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

// ===== READY =====
client.once("ready", () => {
  console.log(`⚡ GOD MODE ACTIVE: ${client.user.tag}`);

  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      const member = guild.members.cache.find(
        m => m.user.username.toLowerCase() === TARGET_USERNAME
      );

      if (!member) continue;

      const status = member.presence?.status || "offline";

      if (status !== lastStatus) {
        lastStatus = status;

        const terminal =
`💻 GOD TRACKER

> Target: ${member.user.username}
> Accessing India Node...
> Location: Taj Mahal Palace, Mumbai
> Injecting trace...

✔ STATUS CAPTURED`;

        await sendWebhook({
          content: "@here",
          username: "⚡ GOD TRACKER",
          embeds: [
            {
              title: "🇮🇳 INDIA NODE ACTIVE",
              description: terminal,
              color: color(status),
              fields: [
                {
                  name: "👤 User",
                  value: member.user.username,
                  inline: true
                },
                {
                  name: "📊 Status",
                  value: `${statusEmoji(status)} ${status.toUpperCase()}`,
                  inline: true
                },
                {
                  name: "🌐 IP (simulated)",
                  value: fakeIP()
                },
                {
                  name: "📍 Location",
                  value: "The Taj Mahal Palace, Mumbai, India"
                }
              ],
              footer: {
                text: "GOD MODE • Secure Node"
              }
            }
          ],
          allowed_mentions: { parse: ["here"] }
        });
      }
    }
  }, 5000);
});

// ===== PANEL COMMAND =====
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "panel") {
    return interaction.reply({
      content: "💻 ENTER CODENAME TO USE SYSTEM"
    });
  }
});

// ===== MESSAGE CODENAME SYSTEM =====
client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  if (msg.content === CODENAME) {
    await msg.reply("🔓 ACCESS GRANTED...");

    await sendWebhook({
      username: "⚡ SYSTEM",
      content:
`💻 CONTROL PANEL UNLOCKED

🔍 scan
🌐 trace
💀 hack

Type command name to execute.`
    });
  }

  if (msg.content === "scan") {
    await sendWebhook({
      content: "🔍 Scanning...\n✔ Completed"
    });
  }

  if (msg.content === "trace") {
    await sendWebhook({
      content: `🌐 IP FOUND: ${fakeIP()}`
    });
  }

  if (msg.content === "hack") {
    await sendWebhook({
      content:
`💀 Injecting...
💀 Bypassing...
💀 Access granted

✔ Target compromised (simulation)`
    });
  }
});

client.login(process.env.BOT_TOKEN);

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { CommandKit } = require("commandkit");
const serviceHandler = require("./events/ready/services.js");
const token = process.env.TOKEN;
const c = require("chalk");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

const handlerkit = new CommandKit({
  client,
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  skipBuiltInValidations: true,
  bulkRegister: true,
});

(async () => {
  try {
    console.log(c.cyan(`Running services...`));
    serviceHandler();

    await client.login(token);
  } catch (error) {
    throw new Error(c.red(error));
  }
})();

require("dotenv").config();
const { Client, GatewayIntentBits } = require(`discord.js`);
const { CommandKit } = require(`commandkit`);
const serviceHandler = require(`./events/ready/services.js`);
const token = process.env.TOKEN;
const c = require("chalk");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
});

new CommandKit({
  client,
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  bulkRegister: true,
  skipBuiltInValidations: true,
});

(async () => {
  try {
    console.log(c.cyan(`Running services...`));
    serviceHandler(client);

    await client.login(token);
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
})();

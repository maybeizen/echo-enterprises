const axios = require("axios");
const c = require("chalk");
const Modpack = require("../schemas/Modpack.js");
const apiUrl = "https://api.modrinth.com/v2/project";
const modpackIds = ["tz8bgwGi", "ecgx0zMM"];
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

async function checkUpdates(client) {
  console.log(c.cyan("Checking for modpack updates..."));

  for (const modpackId of modpackIds) {
    try {
      const response = await axios.get(`${apiUrl}/${modpackId}`);
      const data = response.data;
      const latestUpdateTimestamp = new Date(data.updated).getTime();

      const modpack = await Modpack.findOne({ modpackId: modpackId });

      if (!modpack || latestUpdateTimestamp > modpack.lastUpdated) {
        if (modpack) {
          console.log(c.yellow(`New update found for ${data.title}...`));
          modpack.lastUpdated = latestUpdateTimestamp;
          await modpack.save();
        } else {
          console.log("e");
          const newModpack = new Modpack({
            modpackId: modpackId,
            lastUpdated: latestUpdateTimestamp,
          });
          await newModpack.save();
        }

        notify(data, client);
      } else {
        console.log(c.white(`No new updates found for ${data.title}...`));
      }
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    }
  }
}

async function notify(modpack, client) {
  try {
    const latestVersionId = await getLatestVersion(modpack);
    const latestVersionResponse = await axios.get(
      `${apiUrl}/${modpack.id}/version/${latestVersionId}`
    );
    const latestVersionData = latestVersionResponse.data;

    const embed = new EmbedBuilder()
      .setTitle(`${modpack.title}`)
      .setDescription(
        `${modpack.title} was updated to ${latestVersionData.version_number}! Go and update now!`
      )
      .setColor("Purple")
      .setTimestamp(new Date(modpack.updated))
      .addFields(
        {
          name: "Version",
          value: `${latestVersionData.version_number}`,
          inline: false,
        },
        {
          name: "Changelog",
          value: `${latestVersionData.changelog}` || "No changelog available",
          inline: false,
        }
      );

    const channel = client.channels.cache.get("1182446862779818120");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(`Version ${latestVersionData.version_number}`)
        .setURL(
          `https://modrinth.com/modpack/${modpack.id}/version/${latestVersionId}`
        )
        .setStyle(ButtonStyle.Link)
    );

    await channel.send({
      embeds: [embed],
      components: [row],
      content: "<@&1182475846691328031>",
    });
  } catch (error) {
    console.error("Error notifying about modpack update:", error);
  }
}

async function getLatestVersion(modpack) {
  try {
    const response = await axios.get(`${apiUrl}/${modpack.id}`);
    const data = response.data;

    const latestVersionId = data.versions[data.versions.length - 1];

    return latestVersionId;
  } catch (error) {
    console.error("Error fetching modpack data:", error);
    return null;
  }
}

module.exports = checkUpdates;

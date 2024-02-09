const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Send the rule embed.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the rule embed to.")
        .addChannelTypes(ChannelType.GuildText)
        .addChannelTypes(ChannelType.GuildAnnouncement)
    ),

  run: ({ client, interaction }) => {
    const guild = interaction.guild;
    const channel = interaction.options.getChannel("channel");
    const rulesEmbed = new EmbedBuilder()
      .setDescription(
        `# Rules and Regulation
**Please follow our rules below. These may be updated without a warning, so it is your responsibility to look through them.**`
      )
      .addFields([
        {
          name: "» Be Respectful",
          value:
            "Treat each other with respect and kindness. No offensive language, hate speech, or personal attacks.",
        },
        {
          name: "» No Harassment or Bullying",
          value:
            "Strictly prohibit any form of harassment or bullying, including discrimination based on race, gender, religion, etc.",
        },
        {
          name: "» Keep it Safe",
          value:
            "Prohibit the sharing of personal information. Ensure the safety of members by avoiding sensitive details.",
        },
        {
          name: "» No Spam or Self-Promotion",
          value:
            "Discourage spamming and self-promotion. Avoid flooding channels with unrelated content or constant self-promotion.",
        },
        {
          name: "» Stay on Topic",
          value:
            "Encourage members to keep discussions relevant to the channels. Off-topic conversations can be disruptive.",
        },
        {
          name: "» No NSFW Content",
          value:
            "Prohibit the sharing of explicit or NSFW (Not Safe For Work) content, depending on the nature of the server.",
        },
        {
          name: "» Respect Discord TOS",
          value:
            "Members should adhere to Discord's Terms of Service. Avoid using the platform for illegal activities.",
        },
        {
          name: "» Follow Channel Guidelines",
          value:
            "Ensure that members follow specific guidelines for each channel. Keep discussions relevant to the channel's theme.",
        },
        {
          name: "» Use Appropriate Channels",
          value:
            "Encourage members to use the appropriate channels for discussions. Helps keep the server organized.",
        },
        {
          name: "» Listen to Moderators",
          value:
            "Members should respect and follow the instructions of moderators. Moderators play a crucial role in maintaining order.",
        },
        {
          name: "» Reporting Issues",
          value:
            "Provide a clear process for members to report issues, violations, or concerns to moderators or administrators.",
        },
        {
          name: "» Keep Voice Channels Civil",
          value:
            "Maintain a civil and respectful tone during discussions in voice channels.",
        },
        {
          name: "» Pinging Staff",
          value:
            "Avoid excessive pinging of staff members. Use the designated channels or reporting system for urgent matters.",
        },
        {
          name: " ",
          value: " ",
        },
        {
          name: `Thanks`,
          value: `Tanks for following the rules of Echo Enterprises. `,
        },
      ])
      .setColor(`#c24cff`)
      .setFooter({
        text: `Powered by Echo Enterprises`,
        iconURL: client.user.avatarURL(),
      });

    if (channel) {
      interaction.reply({
        content: `Rule Embed Sent to ${channel}`,
        ephemeral: true,
      });
      channel.send({
        embeds: [rulesEmbed],
      });
    } else {
      interaction.reply({
        embeds: [rulesEmbed],
      });
    }
  },

  options: {
    userPermissions: ["Administrator"],
  },
};

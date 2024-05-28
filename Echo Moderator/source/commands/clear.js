const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Bulk delete message from this channel")
    .addIntegerOption((options) =>
      options
        .setName("amount")
        .setDescription("The amount of messages to delete")
        .setRequired(true)
        .setMaxValue(99)
        .setMinValue(1)
    ),

  run: async ({ interaction, client }) => {
    const amount = interaction.options.getInteger("amount");

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      await interaction.reply("You are not allowed to run this command!");
      return;
    }

    try {
      const messageCount = await interaction.channel.messages.fetch({
        limit: amount,
      });

      await interaction.channel.bulkDelete(messageCount, true);

      const followUp = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Cleared Messages")
            .setDescription(
              `${interaction.user} has cleared ${amount} from ${interaction.channel}`
            )
            .setColor("Purple")
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            }),
        ],
      });

      await pause(2000);
      await followUp.delete();
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));

      await interaction.reply(
        "An internal error occured! Please try again later."
      );
    }
  },
};

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

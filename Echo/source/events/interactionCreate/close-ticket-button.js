const c = require("chalk");
const Ticket = require("../../schemas/Ticket.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }

  if (interaction.customId === "close-ticket-button") {
    const ticketChannel = interaction.channel;
    const ticket = await Ticket.findOne({
      userId: interaction.user.id,
      channelId: ticketChannel.id,
    });

    if (ticket) {
      await Ticket.deleteOne({
        userId: interaction.user.id,
        channelId: ticketChannel.id,
      });

      interaction.reply("Closing support ticket...");

      await pause(1500);

      console.log("\n" + `-`.repeat(25) + "\n");
      console.log(
        c.cyan(
          `Closing ticket for ${interaction.user.username} (${ticketChannel.name})`
        )
      );
      console.log("\n" + `-`.repeat(25) + "\n");

      await interaction.guild.channels.delete(ticketChannel).catch((error) => {
        console.error(c.red(error));
        console.log(c.gray(error.stack));
      });
    } else return;
  }
};

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

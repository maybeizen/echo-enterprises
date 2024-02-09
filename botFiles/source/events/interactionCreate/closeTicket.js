module.exports = async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }

  if (interaction.customId === "closeTicket") {
    const guild = interaction.guild;
    const ticketChannel = interaction.channel;
    interaction.reply("Closing Ticket in 3 seconds...");

    await pause(3000);

    await guild.channels.delete(ticketChannel);
  }
};

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

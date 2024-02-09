const {
  ButtonBuilder,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const chalk = require("chalk");

module.exports = async (interaction, message, client) => {
  const guild = interaction.guild;

  if (!interaction.isButton()) {
    return;
  }

  if (interaction.customId === "newTicketButton") {
    const ticketUserId = interaction.user.id;

    const staffRoleId = "1182472642465386586";

    const permissions = [
      {
        id: ticketUserId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      },
      {
        id: guild.roles.everyone.id,
        deny: [
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ViewChannel,
          ,
        ],
      },
      {
        id: staffRoleId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      },
    ];
    const parentCategory = guild.channels.cache.get("1182907427440570468");
    const ticketChannel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: permissions,
      parent: parentCategory,
    });
    console.log(
      chalk.white(`✅ Created a ticket for `) +
        chalk.blue(`${interaction.user.username} `) +
        chalk.white(`in channel `) +
        chalk.blue(`${ticketChannel.name}`)
    );

    const ticketEmbed = new EmbedBuilder()
      .setDescription(
        `## Welcome to your Ticket, ${interaction.user}.
                    
            Please state your issue below, along with providing logs and screenshots (if applicable) so we can further assist you. Inactive tickets will be closed after 24 hours.
            
            > **We do not offer help with plugin/mod configuration!**`
      )
      .setFooter({
        text: "Powered by Echo Enterprises",
      })
      .setColor("#c24cff")
      .setTimestamp();

    const ticketMadeEmbed = new EmbedBuilder()
      .setTitle(`✅ Ticket Created`)
      .setDescription(
        `Your ticket has been created. View it at <#${ticketChannel.id}>`
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("#c24cff")
      .setFooter({
        text: "Powered by Echo Enterprises",
      })
      .setTimestamp();

    const ticketJumpButton = new ButtonBuilder()
      .setLabel("Jump to Ticket")
      .setStyle(ButtonStyle.Link)
      .setURL(
        `https://discord.com/channels/1182443597468012696/${ticketChannel.id}`
      );

    const closeTicket = new ButtonBuilder()
      .setCustomId("closeTicket")
      .setLabel("Close Ticket")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Secondary);

    const ticketRow = new ActionRowBuilder().addComponents(closeTicket);

    await ticketChannel.send({
      embeds: [ticketEmbed],
      components: [ticketRow],
    });

    const ticketCreatedRow = new ActionRowBuilder().addComponents(
      ticketJumpButton
    );

    await interaction.reply({
      embeds: [ticketMadeEmbed],
      components: [ticketCreatedRow],
      ephemeral: true,
    });
  }
};

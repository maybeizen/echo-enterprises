const {
  ButtonBuilder,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const Ticket = require("../../schemas/Ticket.js");

module.exports = async (interaction, client) => {
  const guild = interaction.guild;
  const parentCategory = guild.channels.cache.get("1182907320448057396");

  if (!interaction.isButton()) {
    return;
  }

  if (interaction.customId === "eee-ticket-button") {
    const user = interaction.user;
    const staffRoleId = "1182472642465386586";

    const ticket = await Ticket.findOne({
      userId: interaction.user.id,
    });

    const permissions = [
      {
        id: user.id,
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

    if (ticket) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setColor("Red")
            .setDescription(
              `Hey! You already have a ticket open at <#${ticket.channelId}>! Please use this ticket instead!`
            )
            .setFooter({
              text: "Echo Enterprises",
              iconURL: client.user.avatarURL(),
            }),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Jump to Ticket")
              .setStyle(ButtonStyle.Link)
              .setURL(
                `https://discord.com/channels/${guild.id}/${ticket.channelId}`
              )
          ),
        ],

        ephemeral: true,
      });

      return;
    } else {
      try {
        const ticketChannel = await guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: permissions,
          parent: parentCategory,
        });

        if (!ticket) {
          const ticket = new Ticket({
            userId: user.id,
            channelId: ticketChannel.id,
          });

          await ticket.save();
        }

        console.log("\n" + `-`.repeat(25) + "\n");
        console.log(
          c.cyan(`Created ticket for ${user.username} (${ticketChannel.name})`)
        );
        console.log("\n" + `-`.repeat(25) + "\n");

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close-ticket-button")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Jump to Ticket")
            .setStyle(ButtonStyle.Link)
            .setURL(
              `https://discord.com/channels/${guild.id}/${ticketChannel.id}`
            )
        );

        await ticketChannel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `## Welcome to your Ticket, ${interaction.user}.
                            
                Please describe your issue in as much detail as possible. We will get back to you as soon as possible. Please do not ping staff members in your ticket. This will likely lead to an increased wait time.`
              )
              .setFooter({
                text: "Echo Enterprises",
                iconURL: client.user.avatarURL(),
              })
              .setColor("Purple")
              .setTimestamp(),
          ],
          components: [row],
        });

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Support Tickets`)
              .setDescription(
                `Your ticket has been created. View it at <#${ticketChannel.id}>`
              )
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              })
              .setColor("Purple")
              .setFooter({
                text: "Echo Enterprises",
                iconURL: client.user.avatarURL(),
              }),
          ],
          components: [row2],
          ephemeral: true,
        });
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));
      }
    }
  }
};

module.exports = async (member, client, handler) => {
  const welcomeChannel = member.guild.channels.cache.get("1182448315456032788");
  const autoRole = member.guild.roles.cache.get("1182472420767051908");

  await welcomeChannel.send(
    `Hey there ${member.user}, Welcoem to **Echo Enterprises**!`
  );
  await member.roles.add(autoRole);
  console.log(`✅Auto-assigned role ${autoRole.name} to ${member.user.tag}`);
};

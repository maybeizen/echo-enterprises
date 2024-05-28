const fs = require("fs");
const c = require("chalk");
let time = "";

function updateTime() {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  time = `${month}/${day}/${year} at ${hours}:${minutes}:${seconds}`;

  return time;
}

module.exports = (message) => {
  const file = `_messages_.log`;
  const path = `source/messages/${file}`;

  updateTime();

  let messageContent = `${message.author.username}: "${message.content}" (${time})\n`;

  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    messageContent += "    Attached Images:\n";
    message.attachments.forEach((attachment) => {
      messageContent += `    ${attachment.url}\n`;
    });
  }

  fs.appendFile(path, messageContent, (error) => {
    if (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    }
  });
};

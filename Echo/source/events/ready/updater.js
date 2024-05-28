const checkUpdates = require("../../utils/modpack-notifier.js");
const interval = 1000 * 5;

module.exports = (client) => {
  checkUpdates(client);

  setInterval(() => checkUpdates(client), interval);
};

const fs = require("fs");
const path = require("path");

function serviceHandler(client) {
  const serviceDir = path.resolve(`${__dirname}../../../services`);
  const serviceFiles = fs
    .readdirSync(serviceDir)
    .filter((file) => file.endsWith(".js"));

  for (const file of serviceFiles) {
    const service = require(`../../services/${file}`);
    if (service.init) {
      service.init(client);
    }
  }
}

module.exports = serviceHandler;

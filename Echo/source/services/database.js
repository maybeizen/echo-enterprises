const string = process.env.MONGODB_URI;
const c = require("chalk");
const mongoose = require("mongoose");
const startTime = Date.now();

(async () => {
  try {
    await mongoose.connect(string);

    const time = Date.now() - startTime;

    console.log(c.green(`Connected to MongoDB `) + c.cyan(`[${time} ms]`));
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
})();

const mongoose = require('mongoose');
const { after } = require('node:test');

after(async () => {
  await mongoose.connection.close();
});

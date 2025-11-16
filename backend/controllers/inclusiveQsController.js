const { InclusiveModule } = require('../models/questions');

const getAllInclusiveQs = async (request, response) => {
  const inclusiveQs = await InclusiveModule.find({});
  response.json(inclusiveQs);
};

module.exports = {
  getAllInclusiveQs,
};

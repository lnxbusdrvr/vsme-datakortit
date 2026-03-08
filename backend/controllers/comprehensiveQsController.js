const { ComprehensiveModule } = require('../models/questions');

const getAllComprehensiveQs = async (request, response) => {
  const comprehensiveQs = await ComprehensiveModule.find({});
  response.json(comprehensiveQs);
};

const getComprehensiveQById = async (request, response) => {
  const comprehensiveQs = await ComprehensiveModule.findById(request.params.id);

  if (!comprehensiveQs)
    response.status(404).end();

  response.json(comprehensiveQs);
};

module.exports = {
  getAllComprehensiveQs,
};

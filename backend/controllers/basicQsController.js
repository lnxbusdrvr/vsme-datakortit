const { BasicModule } = require('../models/questions')


const getAllBasicQs = async (request, response) => {
  const basicQs = await BasicModule.find({})
  response.json(basicQs)
}


module.exports = {
  getAllBasicQs
}


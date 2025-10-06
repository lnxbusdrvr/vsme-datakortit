const { BasicModule } = require('../models/questions')


const getAllBasicQs = async (request, response) => {
  const basicQs = await BasicModule.find({})
  response.json(basicQs)
}

const getBasicQById = async (request, response) => {
  const basicQs = await BasicModule.findById(request.params.id)
  response.json(basicQs)
}


module.exports = {
  getAllBasicQs,
  getBasicQById 
}


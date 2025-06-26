//const jwt = require('jsonwebtoken')
const router = require('express').Router()
const Question = require('../models/question')
//const User = require('../models/user')
//const userExtractor = require('../utils/middleware').userExtractor

router.get('/', async (request, response) => {
  const questions = await Question.find({})

    /*
  const questions = await Question
    .find({}).populate('user', { username: 1, name: 1 })
    */

  response.json(questions)
})

  /*
router.post('/', userExtractor, async (request, response) => {
  const blog = new Question(request.body)

  const user = request.user

  if (!user ) {
    return response.status(403).json({ error: 'user missing' })
  }  

  if (!blog.title || !blog.url ) {
    return response.status(400).json({ error: 'title or url missing' })
  }   

  blog.likes = blog.likes | 0
  blog.user = user
  user.questions = user.questions.concat(blog._id)

  await user.save()

  const savedQuestion = await blog.save()

  response.status(201).json(savedQuestion)
})
  */

  /*
router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Question.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }

  if ( user.id.toString() !== blog.user.toString() ) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  await blog.deleteOne()

  user.questions = user.questions.filter(b => b._id.toString() !== blog._id.toString())

  await user.save()

  response.status(204).end()
})
  */

  /*
router.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedQuestion = await Question.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedQuestion)
})
  */

module.exports = router


const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo


router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/new', (req, res) => {
  const UserId = req.user.id
  const { name } = req.body
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      res.render('edit', { todo: todo.toJSON() })
    })
})

router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => { res.redirect(`/todos/${id}`) })
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      return todo.destroy()
    })
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

module.exports = router
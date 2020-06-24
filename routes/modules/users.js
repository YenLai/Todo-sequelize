const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')


const db = require('../../models')
const User = db.User


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword)
    errors.push({ message: '每個欄位都是必填。' })
  if (confirmPassword !== password)
    errors.push({ message: '密碼與確認密碼不相符。' })

  User.findOne({ where: { email } }).then(user => {
    if (user)
      errors.push({ message: '該 Email 已經被註冊過。' })
    if (errors.length)
      return res.render('register', { errors, name, email, password, confirmPassword })

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name, email, password: hash
      }))
      .then(() => {
        req.flash('success_msg', '帳號註冊成功')
        res.redirect('/users/login')
      })
      .catch(error => console.log(error))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
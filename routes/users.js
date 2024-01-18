import { Router } from 'express'
import { create, login, logout, extend, getProfile, editCart, getCart } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = Router()
// 註冊
router.post('/', create)
// 登入
router.post('/login', auth.login, login)
router.delete('/logout', auth.jwt, logout)
// 舊換新token
router.patch('/extend', auth.jwt, extend)
// 取自己的資料
router.get('/me', auth.jwt, getProfile)
// 購物車
router.patch('/cart', auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)

export default router

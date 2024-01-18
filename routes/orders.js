import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'
import { create, get, getAll } from '../controllers/orders.js'

const router = Router()

router.post('/', auth.jwt, create)
// 查自己的訂單
router.get('/', auth.jwt, get)
// 查所有人訂單
router.get('/all', auth.jwt, admin, getAll)

export default router

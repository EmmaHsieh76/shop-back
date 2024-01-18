import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { create, getAll, edit, get, getId } from '../controllers/products.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'

const router = Router()

// 驗證有無登錄(auth.jwt) 判斷是否管理員(admin) 是的話才可以上傳檔案(upload),再建立(create)
router.post('/', auth.jwt, admin, upload, create)

// 驗證有無登錄(auth.jwt) 判斷是否管理員(admin) 是的話才可以抓取所有商品(包含未上架)
router.get('/all', auth.jwt, admin, getAll)
router.patch('/:id', auth.jwt, admin, upload, edit)
// 取首頁介面不需要認證
router.get('/', get)
router.get('/:id', getId)
export default router

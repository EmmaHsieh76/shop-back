import { Schema, model, ObjectId, Error } from 'mongoose'
// 驗證
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

// 購物車
const cartSchema = new Schema({
  product: {
    // ObjectId => _id mogoseDB的
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品欄位']
  },
  quantity: {
    type: Number,
    required: [true, '缺少商品數量']
  }
})

// 帳號 信箱 密碼 購物車
const schema = new Schema({
    // 帳號
    account: {
      type: String,
      required: [true, '缺少使用者帳號'],
      minlength: [4, '使用者帳號長度不符'],
      maxlength: [20, '使用者帳號長度不符'],
      unique: true,
      validate: {
        validator (value) {
          return validator.isAlphanumeric(value)
        },
        message: '使用者帳號格式錯誤'
      }
    },
    // 信箱
    email: {
      type: String,
      required: [true, '缺少使用者信箱'],
      unique: true,
      validate: {
        validator (value) {
          return validator.isEmail(value)
        },
        message: '使用者信箱格式錯誤'
      }
    },
    // 密碼
    // 密碼的驗證會放在下方，保存密碼後加密
    password: {
      type: String,
      required: [true, '缺少使用者密碼']
    },
    //
    tokens: {
      // 型態是文字
      type: [String]
    },
    // 購物車
    cart: {
      // 格式為陣列
      type: [cartSchema]
    },
    // 定義用戶為一般使用者還是管理員
    role: {
      // 用數字來判斷
      type: Number,
      // 0 = 會員
      // 1 = 管理員
      // 另外用一個檔案UserRole.js來引入，比看數字更好判斷用戶級別
      default: UserRole.USER
    }
  },
  {
    // 每一筆資料建立日期跟更新日期打開
    timestamps: true,
    // 把建立的資料__v:更新次數關掉
    versionKey: false
  })

  // 建立一個空的使用者?
schema.virtual('cartQuantity')
.get(function () {
return this.cart.reduce((total, current) => {
return total + current.quantity
}, 0)
})


schema.pre('save', function (next) {
  // 準備要保存進去的資料
  const user = this
  // 如果有修改到密碼欄位
  if (user.isModified('password')) {
    if (user.password.length < 4 || user.password.length > 20) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度不符' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default model('users', schema)

import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

// 允許使用者用過期的jwt來請求
// 做舊換新管道

// local的驗證方式，passportLocal.Strategy的策略
passport.use(
  'login',
  new passportLocal.Strategy(
    {
      // 欄位要是account
      usernameField: 'account',
      // 欄位要是password
      passwordField: 'password'
    },
    async (account, password, done) => {
      try {
        // 找帳號
        const user = await users.findOne({ account })
        // 如果沒有使用者
        if (!user) {
          throw new Error('ACCOUNT')
        }
        // 明文密文比較如果不相等
        if (!bcrypt.compareSync(password, user.password)) {
          throw new Error('PASSWORD')
        }
        return done(null, user, null)
      } catch (error) {
        if (error.message === 'ACCOUNT') {
          return done(null, null, { message: '帳號不存在' })
        } else if (error.message === 'PASSWORD') {
          return done(null, null, { message: '密碼錯誤' })
        } else {
          return done(null, null, { message: '未知錯誤' })
        }
      }
    }
  )
)

// passport使用jwy的驗證策略
passport.use('jwt',new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  // 才能取得請求的資訊
  passReqToCallback: true,
  // 略過過期檢查
  ignoreExpiration: true
}, async (req,payload,done) => {
  try{
// 成功後進到這邊
// 檢查過期
// 時間戳記
// jwt 單位是秒 , node.js 單位是毫秒
// 相比較要把jwt*1000才跟 node.js 是同一個單位
const expired = payload.exp * 1000 < new Date().getTime() 

// 登陸後會產生一組jwt
// 只允許舊換新的路徑跟登出的路徑過期，其他的過期就丟出錯誤訊息
const url = req.baseUrl + req.path
if (expired && url !== '/users/extend' && url !== '/users/logout') {
  throw new Error('EXPIRED')
}


// const token = req.headers.authorization.split(' ')
const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
const user = await users.findOne({ _id: payload._id, tokens: token })
if (!user) {
  throw new Error('JWT')
}

return done(null, { user, token }, null)
  }catch(error){
    if (error.message === 'EXPIRED') {
      return done(null, null, { message: 'JWT 過期' })
    } else if (error.message === 'JWT') {
      return done(null, null, { message: 'JWT 無效' })
    } else {
      return done(null, null, { message: '未知錯誤' })
    }
}

}))

import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // 如果沒有使用者或是錯誤
    if (!user || error) {
      // 如果訊息顯示Missing credentials
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          // 狀態碼
          success: false,
          message: '欄位錯誤'
        })
        return
      } else if (info.message === '未知錯誤') {
        // 500=>內部伺服器錯誤 (INTERNAL_SERVER_ERROR)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
        return
      }
    }
    req.user = user
    next()
  })(req, res, next)
}

// 登錄完passport的驗證方式後會來執行這邊
// jwt無效才會過來這裡
export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // jwt 格式不對、 SECRET不對
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'JWT 無效'
        })
        
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
      } else {
        // 其他錯誤
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
      }
      return
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}



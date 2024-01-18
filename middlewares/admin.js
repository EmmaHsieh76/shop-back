// 看使用者是不是管理員
import UserRole from '../enums/UserRole.js'
import { StatusCodes } from 'http-status-codes'

export default (req, res, next) => {
  // 知道是使用者但是不是管理員
  if (req.user.role !== UserRole.ADMIN) {
    // 沒有權限403 =>FORBIDDEN
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: '沒有權限'
    })
  } else {
    // 如果是管理員進入下一步
    next()
  }
}
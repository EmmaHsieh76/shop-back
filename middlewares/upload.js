import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

// 設定雲端平台
cloudinary.config({
  // 名稱
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter(req, file, callback) {
    // 如果符合檔案型態就callback
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      // LIMIT_FILE_FORMAT => 自訂的
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    }
  }, //檔案限制大小1GB
  limits: {
    fileSize: 1024 * 1024
  }
})

// 當檔案上傳放在image的欄位
export default (req, res, next) => {
  upload.single('image')(req, res, error => {
    if (error instanceof multer.MulterError) {
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        // 預設 message 是上傳錯誤
        message
      })
    } else if (error) {
      // 不會debug在每個error都加上console.log
      // 看錯誤訊息寫啥
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    } else {
      next()
    }
  })
}

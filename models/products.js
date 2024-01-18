// 值要是包含這幾項 => enum: {}
// 商品介面日期跟更新日期 => timestamps: true,
// 設定不會出現'_v' => versionKey: false

import { Schema, model } from 'mongoose'

const schema = new Schema({
  // 名稱
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  // 價格
  price: {
    type: Number,
    required: [true, '缺少商品價格']
  },
  // 圖片
  image: {
    type: String,
    required: [true, '缺少商品圖片']
  },
  // 描述
  description: {
    type: String,
    required: [true, '缺少商品說明']
  },
  // 種類
  category: {
    type: String,
    required: [true, '缺少商品分類'],
    // 商品介面日期跟更新日期
    enum: {
      values: ['衣服', '食品', '3C', '遊戲'],
      message: '商品分類錯誤'
    }
  },
  // 上架狀態
  sell: {
    type: Boolean,
    required: [true, '缺少商品上架狀態']
  }
}, {
  // 商品介面日期跟更新日期
  timestamps: true,
  // 設定不會出現'_v'
  versionKey: false
})

export default model('products', schema)

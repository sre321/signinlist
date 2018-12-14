// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('points').where({
    _openid: event.userInfo.openId
  })
    .update({
      data: {
        day: 0,
        week: 0,
        month: 0
      },
    })
}
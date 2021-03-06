// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'signinlist'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  await db.collection('tasks').where({
    cycle: 'week'
  }).update({
    data: {
      isComplete: false,
      okNum: 0
    },
  })
}
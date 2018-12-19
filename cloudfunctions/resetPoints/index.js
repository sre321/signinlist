// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'signinlist'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { stats }= await db.collection('points').update({
      data: {
        day: 0,
        week: 0
      },
    })
    if()
  }
  catch{
    console.error
  }
}
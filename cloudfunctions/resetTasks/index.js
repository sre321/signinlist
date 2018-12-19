// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'signinlist'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('tasks').update({
      data: {
        isComplete: false,
        okNum:0
      },
    })
  }
  catch{
    console.error
  }

}
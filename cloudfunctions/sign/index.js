// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'signinlist'
})
const db = cloud.database()
const com = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const {
      stats
    } = await db.collection('tasks').doc(event.taskId).update({
      data: {
        okNum: com.inc(1),
        isComplete: true
      }
    })
    if (stats.updated) {
      const result = await db.collection('point').where({
          _openid: event.userInfo.openId
        })
        .update({
          data: {
            point: com.inc(event.point)
          },
        })

      if (result.stats.updated) {
        return {
          code: 1,
          msg: 'update success'
        }
      } else {
        await db.collection('tasks').doc(event.taskId).update({
          data: {
            okNum: com.inc(-1),
            isComplete: false
          }
        })
        return {
          code: 0,
          msg: 'update point failed'
        }
      }
    }
    return {
      code: 0,
      msg: 'update tasks failed,更新' + stats.updated + '条数据'
    }
  } catch (e) {
    return {
      code: 0,
      msg: '系统错误！！！'
    }
  }
}
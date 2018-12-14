// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const com = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { stats } = await db.collection('tasks').doc(event.taskId).update({
      data: {
        num: com.inc(1)
      }
    })
    if (stats.updated) {
      let result = ''
      switch (event.type) {
        case 'day':
          result = await db.collection('points').where({
            _openid: event.userInfo.openId
          })
            .update({
              data: {
                day: com.inc(event.point)
              },
            })
          break
        case 'week':
          result = await db.collection('points').where({
            _openid: event.userInfo.openId
          })
            .update({
              data: {
                week: com.inc(event.point)
              },
            })
          break
        case 'month':
          result = await db.collection('points').where({
            _openid: event.userInfo.openId
          })
            .update({
              data: {
                month: com.inc(event.point)
              },
            })
        default:
          break
      }
      if (result.stats.updated) {
        return {
          code: 1
        }
      }
      else {
        await db.collection('tasks').doc(event.taskId).update({
          data: {
            num: com.inc(-1)
          }
        })
        return {
          code: 0,
          msg: 'update points failed'
        }
      }
    }
    return {
      code: 0,
      msg: 'update tasks failed'
    }
  } catch (e) {
    return e
  }
}
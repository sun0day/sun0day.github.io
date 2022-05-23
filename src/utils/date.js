import moment from 'moment'
// 获取中文周几
export const getDayZh = (date) => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][moment(date).day()]

// 获取小时
export const getHour = date => {
  let hour = moment(date).hour()
  if(isNaN(hour)) {
    hour = +date.slice(8, 10)
  }
  return hour % 12 + (hour > 11 ? 'pm' : 'am')
}

export const isNight = () => {
  return moment().hour() > 11
}
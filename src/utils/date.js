import moment from 'moment'
export const getDayZh = (date) => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][moment(date).day()]
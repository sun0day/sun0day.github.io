import { isNight } from './date'
import dayWind from '../assets/day-wind.svg'
import dayCloud from '../assets/day-cloud.svg'
import dayRain from '../assets/day-rain.svg'
import daySun from '../assets/day-sun.svg'
import daySnow from '../assets/day-snow.svg'
import dayStorm from '../assets/day-storm.svg'

import nightWind from '../assets/night-wind.svg'
import nightCloud from '../assets/night-cloud.svg'
import nightRain from '../assets/night-rain.svg'
import nightMoon from '../assets/night-moon.svg'
import nightSnow from '../assets/night-snow.svg'
import nightStorm from '../assets/night-storm.svg'

// 计算天气图标
export const getWeatherLogo = (text) => {
  const reg = new RegExp(text)
  const night = isNight()
  if(reg.test('晴')) {
    return night ? nightMoon : daySun
  }
  if(reg.test('雷')) {
    return night ? nightStorm : dayStorm
  }
  if(reg.test('雨')) {
    return night ? nightRain : dayRain
  }
  if(reg.test('雪')) {
    return night ? nightSnow : daySnow
  }
  if(reg.test(/云|阴/)) {
    return night ? nightCloud : dayCloud
  }

  return night ? nightWind : dayWind
}
// 获取当日天气
export const getWeatherNow = () => {
  return JSON.parse(localStorage.getItem('weather-now'))
}
// 获取未来 24h 天气
export const getWeather24h = () => {
  return JSON.parse(localStorage.getItem('weather-hour'))
}
// 获取未来 7 天天气
export const getWeather7d = () => {
  return JSON.parse(localStorage.getItem('weather-day'))
}
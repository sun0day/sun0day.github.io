import { useEffect, useState } from 'react';
import * as echarts from 'echarts'
import { Link } from 'react-router-dom';
import leftArrow from '../../assets/left-arrow.svg'
import precip from '../../assets/precip2.svg'
import windSpeed from '../../assets/wind-speed2.svg'
import humidity from '../../assets/humidity2.svg'
import { getWeatherLogo } from '../../utils/weather';
import {getDayZh} from '../../utils/date'
import './index.css';

function Detail() {

  return (
    <div className="detail-container">
      <header>
        <Link to='/'><img src={leftArrow} /></Link>
        <img src={getWeatherLogo()} />
      </header>

      <div>
        <div className='location'>杭州市,</div>
        <div className='location'>浙江省</div>

        <div className='temp'>13</div>
      </div>

      <div className='weather-index-list'>
        <div className='weather-index precip'>
          <img src={precip} />
          <span>6%</span>
        </div>
        <div className='weather-index humidity'>
          <img src={humidity} />
          <span>90%</span>
        </div>
        <div className='weather-index wind-speed'>
          <img src={windSpeed} />
          <span>19km/h</span>
        </div>
      </div>

      <div className='chart-title'>Today</div>
      <TempChart />
      <HourList />
      <DayList />
    </div>
  );
}

// 温度折线图
function TempChart() {
  const [inst, setInst] = useState(null)
  const [option, setOption] = useState({
    // title: {
    //   text: 'Today'
    // },
    grid: {
      left: '-4%',
      right: '-4%',
      top: 0,
      bottom: '24%',
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#332821',
        opacity: 0.5,
        fontSize: '0.4rem',
        fontFamily: 'Alegreya Sans',
        fontWeight: 500,
        // padding: [0,0,0,18]
      }
    },
    yAxis: {
      show: false,
      type: 'value',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'weather temp',
        type: 'line',
        showSymbol: false,
        data: new Array(6).fill(0).map((x, i) => [i + 'am', Math.random() * 50]),
        itemStyle: {
          color: '#E9C939'
        },
        areaStyle: {
          color: '#E9C939',
          opacity: 0.25
        }
      }
    ]
  })

  useEffect(() => {
    setInst(echarts.init(document.getElementById('temp-chart')))
  }, [])

  useEffect(() => {
    inst && inst.setOption(option)
  }, [inst, option])
  console.log(option)
  return (
    <div className='temp-chart-container'>
      <div id='temp-chart'></div>
    </div>
  )
}


function HourList() {
  return (<div className='hour-list'>{
    [{ temp: 20, time: '10am' },
    { temp: 30, time: '11am' },
    { temp: 20, time: '10am' },
    { temp: 30, time: '11am' },{ temp: 20, time: '10am' },
    { temp: 30, time: '11am' },
    { temp: 20, time: '10am' },
    { temp: 30, time: '11am' }].map(w => (
      <div className='hour-block' key={w.time}>
        <div className='temp'>{w.temp}</div>
        <div className='time'>{w.time}</div>
      </div>
    ))
  }</div>)
}

function DayList() {
  return (<div className='week-list'>{
    [{
      "fxDate": "2021-11-15",
      "sunrise": "06:58",
      "sunset": "16:59",
      "moonrise": "15:16",
      "moonset": "03:40",
      "moonPhase": "盈凸月",
      "moonPhaseIcon": "803",
      "tempMax": "12",
      "tempMin": "-1",
      "iconDay": "101",
      "textDay": "多云",
      "iconNight": "150",
      "textNight": "晴",
      "wind360Day": "45",
      "windDirDay": "东北风",
      "windScaleDay": "1-2",
      "windSpeedDay": "3",
      "wind360Night": "0",
      "windDirNight": "北风",
      "windScaleNight": "1-2",
      "windSpeedNight": "3",
      "humidity": "65",
      "precip": "0.0",
      "pressure": "1020",
      "vis": "25",
      "cloud": "4",
      "uvIndex": "3"
    },
    {
      "fxDate": "2021-11-16",
      "sunrise": "07:00",
      "sunset": "16:58",
      "moonrise": "15:38",
      "moonset": "04:40",
      "moonPhase": "盈凸月",
      "moonPhaseIcon": "803",
      "tempMax": "13",
      "tempMin": "0",
      "iconDay": "100",
      "textDay": "晴",
      "iconNight": "101",
      "textNight": "多云",
      "wind360Day": "225",
      "windDirDay": "西南风",
      "windScaleDay": "1-2",
      "windSpeedDay": "3",
      "wind360Night": "225",
      "windDirNight": "西南风",
      "windScaleNight": "1-2",
      "windSpeedNight": "3",
      "humidity": "74",
      "precip": "0.0",
      "pressure": "1016",
      "vis": "25",
      "cloud": "1",
      "uvIndex": "3"
    },
    {
      "fxDate": "2021-11-17",
      "sunrise": "07:01",
      "sunset": "16:57",
      "moonrise": "16:01",
      "moonset": "05:41",
      "moonPhase": "盈凸月",
      "moonPhaseIcon": "803",
      "tempMax": "13",
      "tempMin": "0",
      "iconDay": "100",
      "textDay": "晴",
      "iconNight": "150",
      "textNight": "晴",
      "wind360Day": "225",
      "windDirDay": "西南风",
      "windScaleDay": "1-2",
      "windSpeedDay": "3",
      "wind360Night": "225",
      "windDirNight": "西南风",
      "windScaleNight": "1-2",
      "windSpeedNight": "3",
      "humidity": "56",
      "precip": "0.0",
      "pressure": "1009",
      "vis": "25",
      "cloud": "0",
      "uvIndex": "3"
    }
  ].map(w => (
      <div className='week-block' key={w.fxDate}>
        <div className='time'>{getDayZh(w.fxDate)}</div>
        <div className='text'>{w.textDay}</div>
        <div className='temp-list'>
          <span className='max-temp'>{w.tempMax}</span>
          <span className='min-temp'>{w.tempMin}</span>
        </div>
      </div>
    ))
  }</div>)
}

export default Detail;

import { useEffect, useState } from 'react';
import * as echarts from 'echarts'
import { Link } from 'react-router-dom';
import leftArrow from '../../assets/left-arrow.svg'
import precip from '../../assets/precip2.svg'
import windSpeed from '../../assets/wind-speed2.svg'
import humidity from '../../assets/humidity2.svg'
import rain from '../../assets/rain.svg'
import { getWeather24h, getWeather7d, getWeatherLogo, getWeatherNow } from '../../utils/weather';
import { getDayZh, getHour } from '../../utils/date'
import './index.css';

function Detail() {
  const data = getWeatherNow()
  return (
    <div className="detail-container">
      <header>
        <Link to='/'><img src={leftArrow} /></Link>
        <img src={getWeatherLogo(data.text)} />
      </header>

      <div>
        <div className='location'>杭州市,</div>
        <div className='location'>浙江省</div>

        <div className='temp'>{data.temp}</div>
      </div>

      <div className='weather-index-list'>
        <div className='weather-index precip'>
          <img src={precip} />
          <span>{parseInt(data.precip)}%</span>
        </div>
        <div className='weather-index humidity'>
          <img src={humidity} />
          <span>{parseInt(data.humidity)}%</span>
        </div>
        <div className='weather-index wind-speed'>
          <img src={windSpeed} />
          <span>{parseInt(data.windSpeed)}km/h</span>
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
  const data = getWeather24h()
  const [inst, setInst] = useState(null)
  const [option, setOption] = useState({
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
        data: Object.keys(data).slice(0, 4).map((k, i) => [getHour(data[k].update_time), +data[k].degree]),
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
  const data = getWeather24h()
  return (<div className='hour-list'>{
    Object.keys(data).slice(0, 25).map(k => (
      <div className='hour-block' key={data[k].update_time}>
        <div className='temp'>{data[k].degree}</div>
        <div className='time'>{getHour(data[k].update_time)}</div>
      </div>
    ))
  }</div>)
}

function DayList() {
  const data = getWeather7d()
  return (<div className='week-list'>{
    Object.keys(data).slice(1, 8).map(k => (
      <div className='week-block' key={data[k].time}>
        <div className='time'>{getDayZh(data[k].time)}</div>
        <img src={rain} className='text'/>
        <div className='temp-list'>
          <span className='max-temp'>{data[k].max_degree}</span>
          <span className='min-temp'>{data[k].min_degree}</span>
        </div>
      </div>
    ))
  }</div>)
}

export default Detail;

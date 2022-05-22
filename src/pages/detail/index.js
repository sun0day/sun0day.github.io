import { useEffect, useState } from 'react';
import * as echarts from 'echarts'
import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import home from '../../assets/home.svg'
import './index.css';

function Detail() {

  return (
    <div className="detail-container">
      <TempChart />
    </div>
  );
}

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

export default Detail;

import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { getWeatherLogo } from '../../utils/weather'
import logo from '../../assets/logo.svg'
import home from '../../assets/home.svg'
import precip from '../../assets/precip.svg'
import windSpeed from '../../assets/wind-speed.svg'
import humidity from '../../assets/humidity.svg'
import './index.css';

function Home() {
  return (
    <div className="home-container">
      <img src={logo} className='logo' />

      <div className='content'>
        <OverviewPanel />
        <IndexPanel />
      </div>
      <footer>
        <img src={home} />
      </footer>
    </div>
  );
}

// 天气概览
function OverviewPanel() {
  return (
    <div className="overview-panel">
      <img src={getWeatherLogo()} />
      <strong className='location'>杭州市,浙江省</strong>
      <div>
        <div>
          <strong className='temp'>15</strong>
          <div className='time'>
            <span className='time-zh'>
              周日,
            </span>
            <span className='time-en'>
              11 am
            </span>
          </div>
        </div>
        <div className='weather-tag-list'>
          <div className='weather-tag wind'>强风</div>
          <div className='weather-tag cloud'>多云</div>
        </div>
      </div>

      <Link to='/weather'>
      <div className='weather-detail-entry'>
        详情
      </div>
      </Link>
    </div>
  )
}

// 天气详情指标
function IndexPanel() {
  return (
    <div className='index-panel'>
      <div>
        <div><img src={precip} /> <span>降水量</span></div>
        <span>6%</span>
      </div>
      <div>
        <div><img src={humidity} /> <span>湿度</span></div>
        <span>90%</span>
      </div>
      <div>
        <div><img src={windSpeed} /> <span>风速</span></div>
        <span>17km/h</span>
      </div>
    </div>
  )
}

export default Home;

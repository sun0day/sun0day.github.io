import { Link } from 'react-router-dom'
import { getWeatherLogo, getWeatherNow } from '../../utils/weather'
import { getDayZh, getHour } from '../../utils/date'
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
  const data = getWeatherNow()

  return (
    <div className="overview-panel">
      <img src={getWeatherLogo(data.text)} />
      <strong className='location'>杭州市,浙江省</strong>
      <div>
        <div>
          <strong className='temp'>{data.temp}</strong>
          <div className='time'>
            <span className='time-zh'>
              {getDayZh()},
            </span>
            <span className='time-en'>
              {getHour()}
            </span>
          </div>
        </div>
        <div className='weather-tag-list'>
          <div className='weather-tag wind'>{data.windDir}</div>
          <div className='weather-tag cloud'>{data.text}</div>
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
  const data = getWeatherNow()
  return (
    <div className='index-panel'>
      <div>
        <div><img src={precip} /> <span>降水量</span></div>
        <span>{parseInt(data.precip)}%</span>
      </div>
      <div>
        <div><img src={humidity} /> <span>湿度</span></div>
        <span>{parseInt(data.humidity)}%</span>
      </div>
      <div>
        <div><img src={windSpeed} /> <span>风速</span></div>
        <span>{parseInt(data.windSpeed)}km/h</span>
      </div>
    </div>
  )
}

export default Home;

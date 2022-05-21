import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import home from '../../assets/home.svg'
import './index.css';

function Home() {
  return (
    <div className="home-container">
      <img src={logo} className='logo' />

      <OverviewPanel />

      <footer>
        <img src={home} />
      </footer>
    </div>
  );
}

function OverviewPanel() {
  return (
    <div className="overview-panel">
      <img />
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
        <div></div>
      </div>
    </div>
  )
}

export default Home;

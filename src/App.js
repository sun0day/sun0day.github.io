import { Button } from 'antd-mobile'
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Detail from './pages/detail'
import logo from './logo.svg';
import './App.css';
import 'lib-flexible/flexible'

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/weather' element={<Detail />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

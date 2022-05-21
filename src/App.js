import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import logo from './logo.svg';
import './App.css';
import 'lib-flexible/flexible'

function App() {
  return (
    <div className="App">
      <Router basename='/assets'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/weather' element={<div>aaaa</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

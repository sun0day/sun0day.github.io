import { Button } from 'antd-mobile'
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Detail from './pages/detail'
import logo from './logo.svg';
import './App.css';
import 'lib-flexible/flexible'

function serviceRegister() {
  const { serviceWorker } = navigator;
  if (!serviceWorker) {
    console.warn("your browser not support serviceWorker");
    return;
  }
  window.addEventListener("load", async () => {
    let sw = null;
    const regisration = await serviceWorker.register("/sw.js");
    sw = regisration.installing || regisration.waiting || regisration.active;
    sw && sw.addEventListener("statechange", (e) => {
      const { state } = e.target;
      console.log(state);
    });
  });
}
serviceRegister();

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

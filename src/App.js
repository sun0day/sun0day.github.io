import 'lib-flexible/flexible'
import { HashRouter, Routes, Route } from 'react-router-dom'
import {serviceRegister} from './utils/sw'
import Home from './pages/home'
import Detail from './pages/detail'
import './App.css';

serviceRegister()

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

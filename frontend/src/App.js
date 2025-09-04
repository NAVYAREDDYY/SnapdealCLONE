import Navbar from './components/Navbar';
import HomePage from './Pages/Homepage';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";

function App() {
  return (
    
    <div>
      <BrowserRouter>
      <Navbar />
       <Routes>
        <Route path="/" element={<HomePage/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

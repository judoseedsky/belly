import './App.css'
import Welcome from "./components/Welcome/welcome"
import Books from "./components/Books/Books"
import Threads from "./components/Threads"
import Health from "./components/Health/health"
import Writtings from './components/Writtings/Writtings'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import threadText from "./utils/threadTexts"
import belly from "./img/belly-nobck.png"

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome/> }/>
          <Route path="/texts" element={<Books/> }/>
          <Route path="/thread" element={<Threads/> }/>
          <Route path="/health" element={<Health/> }/>
          <Route path="/musings-on-beaty" 
          element={<Writtings title={threadText[0].title}
          tweets={threadText[0].tweets} image={threadText[0].image}
          /> }/>
          <Route path="/broodings-on-spritual-ego" 
          element={<Writtings title={threadText[1].title}
          tweets={threadText[1].tweets} image={threadText[1].image}
          /> }/>
        </Routes>
      </Router>

      <img src={belly} id="belly" alt=""/>
    </div>
  );
}

export default App;

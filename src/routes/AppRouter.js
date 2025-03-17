import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import About from "../pages/About";
import ModeSelection from "../pages/ModeSelection";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:level" element={<ModeSelection />} />
        <Route path="/game/:level/:mode" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

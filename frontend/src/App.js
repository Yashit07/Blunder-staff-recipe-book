import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import RecipeManual from "@/pages/RecipeManual";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<RecipeManual />} />
        </Routes>
      </HashRouter>
      <Analytics />
    </div>
  );
}

export default App;

import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecipeManual from "@/pages/RecipeManual";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RecipeManual />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

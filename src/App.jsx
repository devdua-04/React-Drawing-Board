import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import CanvasBoard from "./components/CanvasBoard";
import "./App.css";

function App() {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [tool, setTool] = useState("brush");

  return (
    <div className="app">
      <Toolbar
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        canvasColor={canvasColor}
        setCanvasColor={setCanvasColor}
        setTool={setTool}
      />
      <CanvasBoard
        brushColor={brushColor}
        brushSize={brushSize}
        canvasColor={canvasColor}
        tool={tool}
      />
    </div>
  );
}

export default App;

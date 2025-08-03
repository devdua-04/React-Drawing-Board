import React from "react";
import "./Toolbar.css";

export default function Toolbar({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  canvasColor,
  setCanvasColor,
  setTool,
}) {
  const triggerCanvasAction = (action) => {
    const event = new CustomEvent("canvas-action", { detail: { action } });
    window.dispatchEvent(event);
  };

  return (
    <div className="toolbar">
      <div className="section">
        <h3>Shapes</h3>
        <button onClick={() => setTool("rectangle")}>⬛ Rectangle</button>
        <button onClick={() => setTool("circle")}>⚪ Circle</button>
        <button onClick={() => setTool("line")}>📏 Line</button>
      </div>

      <div className="section">
        <h3>Free Tools</h3>
        <button onClick={() => setTool("brush")}>✏️ Brush</button>
        <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
      </div>

      <div className="section">
        <h3>Tool Size</h3>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />
      </div>

      <div className="section">
        <h3>Brush Color</h3>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
        />
      </div>

      <div className="section">
        <h3>Canvas Color</h3>
        <input
          type="color"
          value={canvasColor}
          onChange={(e) => setCanvasColor(e.target.value)}
        />
      </div>

      <div className="section">
        <h3>Actions</h3>
        <button onClick={() => triggerCanvasAction("undo")}>↩️ Undo</button>
        <button onClick={() => triggerCanvasAction("redo")}>↪️ Redo</button>
        <button onClick={() => triggerCanvasAction("clear")}>🗑️ Clear</button>
        <button onClick={() => triggerCanvasAction("save")}>💾 Save</button>
      </div>
    </div>
  );
}

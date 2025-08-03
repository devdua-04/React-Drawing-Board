import React, { useEffect, useRef, useState } from "react";
import "./CanvasBoard.css";

export default function CanvasBoard({
  brushColor,
  brushSize,
  canvasColor,
  tool,
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [tempPath, setTempPath] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth - 240;
    canvas.height = window.innerHeight;
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    redrawAll(ctx);
  }, [canvasColor]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const temp = canvas.toDataURL();
      const img = new Image();
      img.src = temp;
      img.onload = () => {
        canvas.width = window.innerWidth - 240;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = canvasColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasColor]);

  useEffect(() => {
    const listener = (e) => {
      const ctx = canvasRef.current.getContext("2d");
      if (e.detail.action === "undo" && paths.length) {
        const last = paths.pop();
        setRedoStack((r) => [...r, last]);
        redrawAll(ctx);
      } else if (e.detail.action === "redo" && redoStack.length) {
        const last = redoStack.pop();
        setPaths((p) => [...p, last]);
        redrawAll(ctx);
      } else if (e.detail.action === "clear") {
        setPaths([]);
        setRedoStack([]);
        ctx.fillStyle = canvasColor;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      } else if (e.detail.action === "save") {
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
      }
    };
    window.addEventListener("canvas-action", listener);
    return () => window.removeEventListener("canvas-action", listener);
  }, [paths, redoStack, canvasColor]);

  const redrawAll = (ctx) => {
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    paths.forEach((p) => drawPath(ctx, p));
  };

  const drawPath = (ctx, path) => {
    const { tool, brushColor, brushSize, points } = path;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (tool === "brush" || tool === "eraser") {
      ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    } else if (tool === "rectangle") {
      const [start, end] = points;
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (tool === "circle") {
      const [start, end] = points;
      const radius = Math.hypot(end.x - start.x, end.y - start.y);
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tool === "line") {
      const [start, end] = points;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPos({ x: offsetX, y: offsetY });
    if (["brush", "eraser"].includes(tool)) {
      setPaths((p) => [...p, { tool, brushColor, brushSize, points: [{ x: offsetX, y: offsetY }] }]);
    } else {
      setTempPath({ tool, brushColor, brushSize, points: [{ x: offsetX, y: offsetY }, { x: offsetX, y: offsetY }] });
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "brush" || tool === "eraser") {
      setPaths((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].points.push({ x: offsetX, y: offsetY });
        drawPath(ctx, copy[copy.length - 1]);
        return copy;
      });
    } else if (tempPath) {
      const copy = { ...tempPath, points: [tempPath.points[0], { x: offsetX, y: offsetY }] };
      setTempPath(copy);
      redrawAll(ctx);
      drawPath(ctx, copy);
    }
  };

  const handleMouseUp = () => {
    if (tempPath) setPaths((prev) => [...prev, tempPath]);
    setTempPath(null);
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

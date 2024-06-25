import React, { useEffect, useRef, useState } from 'react'
import './WhiteBoard.css'
import { Stage, Layer, Line, Text } from 'react-konva';
import penIcon from '../assets/pen.png';
import io from 'socket.io-client';

const socket = io('https://real-time-whiteboard-server.vercel.app:4000');

const WhiteBoard = () => {
    const [tool, setTool] = useState('pen');
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
  
    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    useEffect(() => {
        socket.on('draw', (data) => {
            const { line } = data;
            lineRef.current.points([...line]);
        });
    }, []);

  
    const handleMouseMove = (e) => {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);
  
      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    };
  
    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    const getCursorStyle = () => {
        return tool === 'pen' ? `url(${penIcon}) 0 32, auto` : 'crosshair';
    };

    return (
        <div className='white-board'>
            <div className='toolbar'>
            <select
                value={tool}
                onChange={(e) => {
                    setTool(e.target.value);
                }}
            >
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
            </select>
            {/* <button >undo</button> */}
            </div>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                style={{ cursor: getCursorStyle() }} // Set cursor style dynamically
            >
                <Layer>
                    {/* <Text text="Just start drawing" x={5} y={30} /> */}
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#000"
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
        </div>

    )
}

export default WhiteBoard
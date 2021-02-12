import React, { useState, useEffect, useReducer } from 'react';

import './App.css';

function App() {
  const [hover, setHover] = useState<HTMLElement | null>(null);
  const [pixel, setPixel] = useState(4);
  const [paint, setPaint] = useState(false);
  const squaresArray: number[] = Array(pixel * pixel).fill('');

  const initialState = { count: 0 };

  const counterReducer: (
    state: { count: number },
    action: { type: string }
  ) => { count: number } = (state, action) => {
    switch (action.type) {
      case 'reset':
        return { count: 0 };
      case 'increment':
        return { count: state.count + 1 };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(counterReducer, initialState);

  useEffect(() => {
    const colors = [
      '#0088ff',
      '#ffaa00',
      '#ff7700',
      '#ff0033',
      '#9911aa',
      '#aadd22',
    ];

    const paintElement: (elem: HTMLElement) => void = (elem) => {
      elem.style.backgroundColor = colors[state.count];
    };
    if (paint) {
      if (hover) {
        paintElement(hover);
      }
    }

    if (state.count >= colors.length - 1) {
      dispatch({ type: 'reset' });
    } else dispatch({ type: 'increment' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, paint]);

  useEffect(() => {
    const gridContainer: HTMLDivElement | null = document.querySelector(
      '.grid-container'
    );
    if (gridContainer) {
      gridContainer.style.gridTemplateColumns = `repeat(${pixel},1fr)`;
      gridContainer.style.gridTemplateRows = `repeat(${pixel},1fr)`;
    }
  }, [pixel]);

  const handleHover = (target: EventTarget) => {
    const element = target as HTMLElement;
    setHover(element);
  };
  const handleChange = (elem: HTMLSelectElement) => {
    const value = parseInt(elem.value);
    setPixel(value);
  };
  const handleClearBtn = () => {
    const squares: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.square'
    );
    squares.forEach((square) => (square.style.backgroundColor = ''));
    dispatch({ type: 'reset' });
  };

  const sizeArr = [4, 8, 12, 16, 20, 24, 29, 34, 38, 45, 50];
  return (
    <div className="main-container">
      <div className="wrapper">
        <h1>Etch-a-sketch</h1>
        {!paint ? (
          <p>Click on the square to start sketching!</p>
        ) : (
          <p> Click again to stop </p>
        )}
        <div
          onClick={() => {
            !paint ? setPaint(true) : setPaint(false);
          }}
          className="grid-container"
        >
          {squaresArray.map((square, key) => {
            return (
              <div
                onMouseEnter={(e) => handleHover(e.target)}
                className={`square ${key}`}
                key={key}
              />
            );
          })}
        </div>
      </div>
      <div className="options-wrapper">
        <p>Sketch size</p>
        <select onChange={(e) => handleChange(e.target)} name="pixels">
          {sizeArr.map((op, i) => {
            return (
              <option value={op} key={i}>
                {op}
              </option>
            );
          })}
        </select>
        <button onClick={() => handleClearBtn()}>Clear</button>
      </div>
    </div>
  );
}

export default App;

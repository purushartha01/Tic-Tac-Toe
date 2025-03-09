import React, { useEffect } from "react";
import { useRef, useState } from "react";

const App = () => {
  const [boardOrder, setBoardOrder] = useState(3);
  const [cells, setCells] = useState([...Array(boardOrder * boardOrder).keys()]);
  console.log(`TOP CELLS: ${cells}`);

  // const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [currSymbol, setCurrSymbol] = useState('X');
  const [isClickDisabled, setIsClickDisabled] = useState(false);


  // const cellRef = useRef([]);
  // const markedCellsRef = useRef([]);


  const cellRef = useRef(cells.map(() => React.createRef(null)));
  const markedCellsRef = useRef(cells.map(() => React.createRef(null)));


  

  const filledCells = useRef(0);

  const checkRows = (currRow, symbol) => {
    "use strict"
    let flag = true;


    let orderOfSquare = Math.sqrt(cellRef.current.length);

    for (let i = orderOfSquare * currRow; i < orderOfSquare * (currRow + 1); i++) {
      // console.log(!cellRef.current[i]);
      if (!cellRef.current[i]) {
        return false;
      }
      if (cellRef.current[i].current.innerText !== symbol) {
        flag = false;
        break;
      }
    }

    if (flag) {
      for (let i = orderOfSquare * currRow; i < orderOfSquare * (currRow + 1); i++) {
        cellRef.current[i].current.className += ' match-made';
      }
    }
    return flag
  }

  const checkCols = (currCol, symbol) => {
    "use strict"
    let i = currCol;
    let flag = true;


    let orderOfSquare = Math.sqrt(cellRef.current.length);

    while (i < cellRef.current.length) {
      if (!cellRef.current[i]) {
        return false;
      }
      else if (cellRef.current[i].current.innerText !== symbol) {
        flag = false;
        break;
      }
      i += orderOfSquare;
    }

    i = currCol;
    if (flag) {
      while (i < cellRef.current.length) {
        cellRef.current[i].current.className += ' match-made';
        i += orderOfSquare;
      }
    }

    return flag;
  }

  const checkDiagonals = (symbol) => {
    "use strict"
    let leftDiagonalFlag = true;
    let rightDiagonalFlag = true;

    console.log("symbol: ", symbol);


    let orderOfSquare = Math.sqrt(cellRef.current.length);

    for (let i = 0; i < cellRef.current.length; i += (orderOfSquare + 1)) {
      if (!cellRef.current[i]) {
        return false;
      }
      if (cellRef.current[i].current.innerText !== symbol) {
        leftDiagonalFlag = false
        break
      }
    }

    if (leftDiagonalFlag) {
      for (let i = 0; i < cellRef.current.length; i += (orderOfSquare + 1)) {
        cellRef.current[i].current.className += ' match-made';
      }
    }

    for (let i = (orderOfSquare - 1); i < (orderOfSquare * (orderOfSquare - 1)) + 1; i += (orderOfSquare - 1)) {
      if (!cellRef.current[i]) {
        return false;
      }
      if (cellRef.current[i].current.innerText !== symbol) {
        rightDiagonalFlag = false;
        break;
      }
    }

    if (rightDiagonalFlag) {
      for (let i = (orderOfSquare - 1); i < (orderOfSquare * (orderOfSquare - 1)) + 1; i += (orderOfSquare - 1)) {
        cellRef.current[i].current.className += ' match-made';
      }
    }

    console.log("leftDiagonalFlag: ", leftDiagonalFlag, " rightDiagonalFlag: ", rightDiagonalFlag);
    return leftDiagonalFlag || rightDiagonalFlag;
  }

  const findWinner = (currIndex, winningSymbol) => {
    console.log("winningSymbol: ", winningSymbol);
    const currRow = Math.floor(currIndex / boardOrder);
    const currCol = currIndex % boardOrder;
    console.log("Current Row: ", currRow, " Current Column: ", currCol);
    if (checkRows(currRow, winningSymbol) || checkCols(currCol, winningSymbol) || ((currRow === currCol || (currRow === 0 && currCol === 2) || (currRow === 2 && currCol === 0)) && checkDiagonals(winningSymbol))) {
      console.log(`Winner is ${winningSymbol}`);
      setIsClickDisabled(true);
      // handleClear();
      return;
    } else if (filledCells.current === 9) {
      console.log("Unfortunately, it was a draw. Better Luck next time!");
      return;
    }
  }

  const handleClick = (e, ele) => {
    e.preventDefault();
    handleMouseLeave(ele);
    console.log(cellRef.current[ele].current);
    const cellContent = cellRef.current[ele].current.innerText;
    if (!cellContent) {
      cellRef.current[ele].current.innerText = currSymbol;
      markedCellsRef.current[ele].current = true;
      filledCells.current += 1;
      setCurrSymbol(currSymbol === 'X' ? 'O' : 'X');
      // console.log(filledCells.current);
      if (filledCells.current > 4) {
        // console.log("calling findWinner() ");
        findWinner(ele, cellRef.current[ele].current.innerText);
      }
    } else {
      console.log("Already filled cell!");
    }
  }

  const handleClear = () => {
    cellRef.current.forEach((value) => {
      // cellRef.current[index].current.innerText = "";
      // cellRef.current[index].current.className=cellRef.current[index].current.className.split(' match-made')[0];
      value.current.innerText = "";
      value.current.className = value.current.className.split(" match-made")[0];
    })
    markedCellsRef.current.forEach((value) => {
      value.current = false;
    })
    filledCells.current = 0;
    setCurrSymbol('X');
    setIsClickDisabled(false);
    console.clear();
  }

  const handleMouseLeave = (index) => {
    // console.log("Mouse Leaving!")
    if (!markedCellsRef.current[index].current) {
      cellRef.current[index].current.innerText = "";
    }
  }

  // useEffect(() => {
  //   console.log(boardOrder);
  // }, [boardOrder])

  return (
    <>
      <main className="flex h-[100vh] w-[100vw] flex-row justify-center items-center">
        <section className="flex flex-col justify-evenly items-center h-[100%] w-[100%]">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-6xl ">Tic-Tac-Toe</h1>
            <div className="flex flex-row items-center justify-center w-full h-fit">
              <label>Choose the order of the board:
                <select name="selectOrder" value={boardOrder.toString()} onChange={(e) => {
                  console.log(e.target.value);
                  setBoardOrder(JSON.parse(e.target.value)); setCells([...Array(JSON.parse(e.target.value)*JSON.parse(e.target.value)).keys()]); console.log(cells);
                }}>
                  <option value="3">3X3</option>
                  <option value="4">4X4</option>
                  <option value="5">5X5</option>
                </select>
              </label>
            </div>
          </div>
          {boardOrder === 3 && <div className={`lg:w-1/3 w-1/2 aspect-square border border-white grid grid-cols-3 grid-rows-3`}>
            {/* {console.log(`cells value: ${cells}`)} */}
            {cells.map((cell, index) =>
              <div key={index} className={`h-[1/${boardOrder}] aspect-square cursor-pointer border border-white contain-size cell`} >
                <span ref={cellRef.current[index]} onClick={e => isClickDisabled ? false : handleClick(e, index)} className='h-[100%] w-[100%] cellContent flex justify-center items-center hover:text-gray-400' onMouseEnter={e => {
                  e.preventDefault(); console.log("CELLS AFTER UPDATE: ", cells);
                  if (!markedCellsRef.current[index].current) { cellRef.current[index].current.innerText = currSymbol; }
                }} onMouseOut={e => { e.preventDefault(); handleMouseLeave(index) }}></span>
              </div>
            )}
          </div>}
          {boardOrder === 4 && <div className={`lg:w-1/3 w-1/2 aspect-square border border-white grid grid-cols-4 grid-rows-4`}>
            {/* {console.log(`cells value: ${cells}`)} */}
            {cells.map((cell, index) =>
              <div key={index} className={`h-[1/${boardOrder}] aspect-square cursor-pointer border border-white contain-size cell`} >
                <span ref={cellRef.current[index]} onClick={e => isClickDisabled ? false : handleClick(e, index)} className='h-[100%] w-[100%] cellContent flex justify-center items-center hover:text-gray-400' onMouseEnter={e => {
                  e.preventDefault(); console.log("CELLS AFTER UPDATE: ", cells);
                  if (!markedCellsRef.current[index].current) { cellRef.current[index].current.innerText = currSymbol; }
                }} onMouseOut={e => { e.preventDefault(); handleMouseLeave(index) }}></span>
              </div>
            )}
          </div>}
          {boardOrder === 5 && <div className={`lg:w-1/3 w-1/2 aspect-square border border-white grid grid-cols-5 grid-rows-5`}>
            {/* {console.log(`cells value: ${cells}`)} */}
            {cells.map((cell, index) =>
              <div key={index} className={`h-[1/${boardOrder}] aspect-square cursor-pointer border border-white contain-size cell`} >
                <span ref={cellRef.current[index]} onClick={e => isClickDisabled ? false : handleClick(e, index)} className='h-[100%] w-[100%] cellContent flex justify-center items-center hover:text-gray-400' onMouseEnter={e => {
                  e.preventDefault(); console.log("CELLS AFTER UPDATE: ", cells);
                  if (!markedCellsRef.current[index].current) { cellRef.current[index].current.innerText = currSymbol; }
                }} onMouseOut={e => { e.preventDefault(); handleMouseLeave(index) }}></span>
              </div>
            )}
          </div>}
          <div className="h-1/20 w-1/2 flex flex-row justify-center items-center">
            <button onClick={handleClear} className="cursor-pointer font-bold text-xl border  border-gray-600 px-4 py-1 transition-all ease-in-out rounded-md hover:bg-gray-400 hover:scale-102 active:bg-gray-500">Clear</button>
          </div>
        </section>
      </main>
    </>
  )
}

export default App

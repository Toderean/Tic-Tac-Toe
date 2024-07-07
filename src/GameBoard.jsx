import React, { useState, useEffect } from "react";
import "./GameBoard.css";

const winningCombos = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];
const symbols = ["X", "0"];

function checkWinner(stateArray) {
  for (let i = 0; i < winningCombos.length; i++) {
    let winningCombo = winningCombos[i];
    if (
      stateArray[winningCombo[0]] !== "" &&
      stateArray[winningCombo[0]] === stateArray[winningCombo[1]] &&
      stateArray[winningCombo[1]] === stateArray[winningCombo[2]]
    )
      return {
        symbol: stateArray[winningCombo[0]],
        winningCombo: winningCombo,
      };
  }
  return false;
}

function existEmptyCellsOnTable(stateArray) {
  return (
    stateArray.filter((elem) => {
      return elem === "";
    }).length > 0
  );
}

/**
 * GameBoard Component
 * @returns game interface
 */
function GameBoard() {
  const [value, setValue] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [arr, setArr] = useState(Array(9).fill(""));
  const [difficulty, setDifficulty] = useState(null);
  const [showBoard, setShowBoard] = useState(false);

  const winnerCombo = checkWinner(arr)?.winningCombo;

  function calculateGameStatus() {
    let winner = checkWinner(arr);
    if (winner) {
      return `Player ${winner.symbol} won!`;
    } else if (existEmptyCellsOnTable(arr) === false) {
      return "It's a draw!";
    } else return `Next player: ${value}`;
  }

  function isGameOver() {
    return !calculateGameStatus().includes("Next player");
  }

  function handleCellClick(index) {
    if (arr[index] !== "" || checkWinner(arr)) {
      return;
    } else {
      let newArrayState = arr.map((element, indexElem) => {
        if (index === indexElem) return mySymbol;
        return element;
      });
      setArr(newArrayState);
      if (checkWinner(newArrayState) === false) {
        if (existEmptyCellsOnTable(newArrayState)) {
          setValue((value) => (value === "X" ? "0" : "X"));
          setTimeout(() => showComputerMove(newArrayState), 1000);
        } else return;
      }
    }
  }

  function showComputerMove(newArrayState) {
    let randomAvailableIndex = null;
    while (randomAvailableIndex === null) {
      let randomIndex = Math.floor(Math.random() * 9);
      if (newArrayState[randomIndex] === "") randomAvailableIndex = randomIndex;
    }
    let newArray = newArrayState.slice();
    console.log(value);
    newArray[randomAvailableIndex] = mySymbol === "X" ? "0" : "X";
    setArr(newArray);
    setValue((value) => (value === "X" ? "0" : "X"));
  }

  function startGame() {
    winnerCombo = Array(3).fill("");
    const ressetedArray = setArr(Array(9).fill[""]);
    setArr(ressetedArray);
    
    if (mySymbol === "0") {
      showComputerMove(ressetedArray);
    }
  }

  function startSymbol() {
    setShowBoard(true);
    let myPlayerStartsFirst = Math.random() > 0.5 ? true : false;

    if (myPlayerStartsFirst) {
      setMySymbol("X");
      return;
    } else {
      setMySymbol("0");
      showComputerMove(arr);
    }
  }

  return (
    <>
      {!showBoard ? (
        <div className="text-center mt-1">
          <button
            className="btn btn-danger justify-content-centre w-50"
            onClick={() => startSymbol()}
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className={`d-flex`}>
            <h5>{calculateGameStatus()}</h5>
            <div
              className={`d-flex justify-content-centre mx-3 ${
                value === mySymbol ? `visually-hidden` : ""
              }`}
            >
              <span>Waiting for partner...</span>
              <div
                className="spinner-border text-secondary"
                role="status"
              ></div>
            </div>
          </div>
          <div className="container ">
            <div className="row">
              {arr.map((element, index) => (
                <div
                  className={`col-4 text-center align-content-center fs-bold fs-1 ${
                    isGameOver() ? `game-over` : `cell`
                  } 
              ${value !== mySymbol ? `pe-none` : ""}
              ${winnerCombo?.includes(index) ? `bg-success` : ""}`}
                  key={index}
                  onClick={() => handleCellClick(index)}
                  style={{ aspectRatio: 1 / 1 }}
                >
                  {element}
                </div>
              ))}
            </div>
          </div>
          {isGameOver() ? (
            <div className="text-center mt-3">
              <button
                className="btn btn-danger justify-content-centre w-50"
                onClick={() => startGame()}
              >
                Play vs Player
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default GameBoard;

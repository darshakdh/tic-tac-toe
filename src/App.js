import React, { useState } from "react";

function createEmptySquares() {
  return Array(9)
    .fill(null)
    .map(() => ({ value: null, isPartOfWinningLine: null }));
}

function Square({ value, isPartOfWinningLine, onSquareClick }) {
  return (
    <button
      className={"square" + (isPartOfWinningLine ? " winning" : "")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove, historyLength }) {
  const winner = squares.find((square) => square.isPartOfWinningLine)?.value;
  const isDraw =
    !winner && currentMove === historyLength - 1 && historyLength === 10;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const handleClick = (i) => {
    if (squares[i].value || winner) {
      return;
    }
    const nextSquares = squares.map((square) => ({ ...square }));
    nextSquares[i] = {
      ...nextSquares[i],
      value: xIsNext ? "X" : "O",
    };
    calculateWinner(nextSquares);
    onPlay(nextSquares);
  };
  const boardRow = Array(3)
    .fill(null)
    .map((_, rowIndex) => (
      <div className="board-row" key={rowIndex}>
        {Array(3)
          .fill(null)
          .map((_, colIndex) => {
            const squareIndex = rowIndex * 3 + colIndex;
            return (
              <Square
                key={squareIndex}
                value={squares[squareIndex].value}
                isPartOfWinningLine={squares[squareIndex].isPartOfWinningLine}
                onSquareClick={() => handleClick(squareIndex)}
              />
            );
          })}
      </div>
    ));
  return (
    <>
      <div className="status">{status}</div>
      {boardRow}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([createEmptySquares()]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((squares, move) => {
    let description;
    const isCurrentMove = move === currentMove;
    if (isCurrentMove) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {isCurrentMove ? (
          <strong>{description}</strong>
        ) : (
          <button
            onClick={() => {
              jumpTo(move);
            }}
          >
            {" "}
            {description}
          </button>
        )}
      </li>
    );
  });

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
  };
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a].value &&
      squares[a].value === squares[b].value &&
      squares[a].value === squares[c].value
    ) {
      squares[a] = { ...squares[a], isPartOfWinningLine: true };
      squares[b] = { ...squares[b], isPartOfWinningLine: true };
      squares[c] = { ...squares[c], isPartOfWinningLine: true };
      return squares[a].value;
    }
  }
  return null;
}

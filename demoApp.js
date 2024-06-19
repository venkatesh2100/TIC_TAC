import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import moveSound from './ASSETS/move.mp3'; // Path to move sound effect
import bgMusic from './ASSETS/BG.mp3'; // Path to background music

function App() {
  const [board, setBoard] = useState([
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [gameMode, setGameMode] = useState(null);
  const [playerOneName, setPlayerOneName] = useState('');
  const [playerTwoName, setPlayerTwoName] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [draws, setDraws] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [humanWins, setHumanWins] = useState(0);
  const [audio, setAudio] = useState(new Audio(bgMusic));

  const playMoveSound = () => {
    const audio = new Audio(moveSound);
    audio.play().catch(error => console.log('Move sound play error:', error));
  };

  const handleClick = (row, col) => {
    if (board[row][col] !== ' ' || gameOver) return;

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? (isPlayerTurn ? 'X' : 'O') : cell))
    );

    setBoard(newBoard);
    playMoveSound();

    axios.post('http://localhost:5000/move', {
      board: newBoard,
      player: gameMode === 'singlePlayer' ? 'Player 1' : isPlayerTurn ? playerOneName : playerTwoName,
      move: [row, col]
    })
    .then(response => {
      const { board: updatedBoard, winner, draw } = response.data;
      setBoard(updatedBoard);

      if (winner) {
        if (winner === 'AI') {
          setMessage('AI wins!');
          setAiWins(aiWins + 1);
        } else {
          setMessage(`${winner} wins!`);
          setHumanWins(humanWins + 1);
        }
        setGameOver(true);
      } else if (draw) {
        setMessage('It\'s a draw!');
        setDraws(draws + 1);
        setGameOver(true);
      } else {
        if (gameMode === 'singlePlayer') {
          setIsPlayerTurn(false);
          // AI move
          axios.post('http://localhost:5000/move', {
            board: updatedBoard,
            player: 'AI'
          }).then(aiResponse => {
            const { board: aiBoard, winner: aiWinner, draw: aiDraw } = aiResponse.data;
            setBoard(aiBoard);
            if (aiWinner) {
              setMessage('AI wins!');
              setAiWins(aiWins + 1);
              setGameOver(true);
            } else if (aiDraw) {
              setMessage('It\'s a draw!');
              setDraws(draws + 1);
              setGameOver(true);
            }
            setIsPlayerTurn(true);
          });
        } else {
          setIsPlayerTurn(!isPlayerTurn);
        }
      }
    });
  };

  const handleStartGame = (mode) => {
    if (mode === 'multiPlayer') {
      const playerOne = prompt("Enter Player One's Name:");
      const playerTwo = prompt("Enter Player Two's Name:");
      if (playerOne && playerTwo) {
        setPlayerOneName(playerOne);
        setPlayerTwoName(playerTwo);
      } else {
        alert('Please enter names for both players.');
        return;
      }
    }
    setGameMode(mode);
    resetGame();
    audio.play().catch(error => console.log('Background music play error:', error));
  };

  const resetGame = () => {
    setBoard([
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ]);
    setMessage('');
    setGameOver(false);
    setIsPlayerTurn(true);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      {!gameMode && (
        <div className="mode-buttons">
          <button onClick={() => handleStartGame('singlePlayer')}>Single Player</button>
          <button onClick={() => handleStartGame('multiPlayer')}>Multiplayer</button>
        </div>
      )}
      {gameMode === 'multiPlayer' && (
        <p>Current Players: {playerOneName} (X) vs. {playerTwoName} (O)</p>
      )}
      {gameMode && (
        <>
          <div className="board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className={`cell ${cell !== ' ' ? 'occupied' : ''}`} onClick={() => handleClick(rowIndex, colIndex)}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="message">{message}</p>
          <div className="score-board">
            <p>Draws: {draws}</p>
            <p>AI Wins: {aiWins}</p>
            <p>Human Wins: {humanWins}</p>
          </div>
          <button className="reset-button" onClick={resetGame}>Reset Game</button>
        </>
      )}
  <a href="https://github.com/venkatesh2100" className="VenkysLink">Venky</a>
    </div>
  );
}

export default App;

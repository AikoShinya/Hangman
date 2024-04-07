import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [randomWord, setRandomWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [remainingAttempts, setRemainingAttempts] = useState(11); // Nombre d'essais restants
  const [gameOver, setGameOver] = useState(false); // État du jeu
  const [wrongAttempts, setWrongAttempts] = useState(0); // Nombre d'erreurs

  useEffect(() => {
    async function fetchRandomWord() {
      try {
        const response = await fetch('http://localhost:3333', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        if (!response.ok) {
          throw new Error('Failed to fetch random word');
        }
        const data = await response.json();
        setRandomWord(data.word.toUpperCase()); // Convertir le mot en majuscules
      } catch (error) {
        console.error('Error fetching random word:', error);
      }
    }
    fetchRandomWord();
  }, []);

  function handleGuess(letter) {
    if (gameOver) return; // Ne rien faire si le jeu est terminé
    const normalizedLetter = letter.toUpperCase();
    setGuessedLetters(prevGuessedLetters => new Set([...prevGuessedLetters, normalizedLetter]));

    if (!randomWord.includes(normalizedLetter)) {
      setRemainingAttempts(prevRemainingAttempts => prevRemainingAttempts - 1);
      setWrongAttempts(prevWrongAttempts => prevWrongAttempts + 1);
      if (remainingAttempts === 1) {
        setGameOver(true); // Définir l'état du jeu sur terminé si le nombre d'essais restants est égal à 1
      }
    }
  }

  function displayWord() {
    return randomWord.split('').map(letter => (
      <span key={letter} className={guessedLetters.has(letter) ? 'guessed-letter' : ''}>
        {guessedLetters.has(letter) ? letter : '_ '}
      </span>
    ));
  }

  function renderKeyboard() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map(letter => (
      <button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.has(letter) || gameOver} // Désactiver les boutons si le jeu est terminé
        className={guessedLetters.has(letter) ? 'clicked-key' : ''}
      >
        {letter}
      </button>
    ));
  }

  // Fonction pour afficher l'image correspondant au nombre d'erreurs
  function displayHangmanImage() {
    const hangmanImageNumber = Math.min(wrongAttempts, 10);
    return <img src={`../public/images/${hangmanImageNumber}.jpg`} alt={`Hangman ${hangmanImageNumber}`}/>;
    
  }

  return (
    <div>
      <h1>Hangman</h1>
      <div className="word-display">Word: {displayWord()}</div>
      <div>Attempts left: {remainingAttempts}</div>
      <div className="hangman-image">{displayHangmanImage()}</div>
      <div className="keyboard">{renderKeyboard()}</div>
      {gameOver && <div>Game Over</div>}
    </div>
  );
}

export default App;

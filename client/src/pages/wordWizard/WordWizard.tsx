import './WordWizard.scss';
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Guess from './components/Word.tsx';
import axios from 'axios';

type TGuess = {
  word: string,
  num: number,
};

type GameState = {
  guesses: TGuess[],
  message: string,
  timeRemaining: number,
};

function WordWizard() {
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    message: '',
    timeRemaining: 300,
  });

  const input = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/wordWizard');
      setGameState(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  const makeGuess = async () => {
    try {
      if (input && input.current) {
        const response = await axios.post(
          '/api/wordWizard',
          { guess: input.current.value },
        );
        setGameState(response.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      makeGuess();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="word-wizard d-flex flex-column align-center">
      <h1>Word Wizard</h1>
      <Link to='/wordWizard/howToPlay' >
        How to play
      </Link>
      <div>
        <GuessList guesses={gameState.guesses} />
      </div>
      <input ref={input} onKeyPress={handleInputKeyPress} />
    </div>
  )
}

function GuessList(props: { guesses: TGuess[] }) {
  const renderedGuesses = props.guesses
    .map((guess: TGuess) => <Guess guess={guess} />);

  return (
    <div>
      { renderedGuesses }
    </div>
  );
}

export type {
  TGuess,
};

export default WordWizard

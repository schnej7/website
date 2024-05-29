import './WordWizard.scss';
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useReducer } from "react";
import {
  initialHelperLetters,
  helperLettersReducer,
} from './store/HelperLettersStore.ts';
import Guess from './components/Guess.tsx';
import HelperLettersContext from './components/HelperLettersContext.tsx';
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
  const [helperLetters, dispatchHelperLetters] = useReducer(helperLettersReducer, initialHelperLetters);

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
        <HelperLettersContext
          helperLetters={helperLetters}
          dispatchHelperLetters={dispatchHelperLetters}
          render={() => (
            <div>
              {
                gameState.guesses.map((guess: TGuess) =>
                  <Guess
                    guess={guess}
                  />
                )
              }
            </div>
          )}
        />
      </div>
      <input ref={input} onKeyPress={handleInputKeyPress} />
    </div>
  )
}

export type {
  TGuess,
};

export default WordWizard

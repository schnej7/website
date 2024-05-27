import './WordWizard.scss';
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useReducer } from "react";
import type {
  HelperLetters,
  HelperLettersAction,
} from './store/HelperLettersStore.ts';
import {
  initialHelperLetters,
  helperLettersReducer,
} from './store/HelperLettersStore.ts';
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
        <GuessList
          guesses={gameState.guesses}
          helperLetters={helperLetters}
          dispatchHelperLetters={dispatchHelperLetters}
        />
      </div>
      <input ref={input} onKeyPress={handleInputKeyPress} />
    </div>
  )
}

function GuessList(
  props: {
    guesses: TGuess[];
    helperLetters: HelperLetters;
    dispatchHelperLetters: (action: HelperLettersAction) => void;
  },
) {
  const renderedGuesses = props.guesses
    .map((guess: TGuess) =>
      <Guess
        guess={guess}
        helperLetters={props.helperLetters}
        dispatchHelperLetters={props.dispatchHelperLetters}
      />
    );

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

import './WordWizard.scss';
import { Link } from "react-router-dom";
import { useReducer } from "react";
import {
  initialHelperLetters,
  helperLettersReducer,
} from './store/HelperLettersStore.ts';
import Guess from './components/Guess.tsx';
import HelperLettersContext from './components/HelperLettersContext.tsx';
import { TGuess } from './WordWizard.tsx';

function WordWizardHowToPlay() {

  const [helperLetters, dispatchHelperLetters] = useReducer(helperLettersReducer, initialHelperLetters);

  const guesses = [
    {
      word: 'wrist',
      num: 1,
    },
    {
      word: 'relay',
      num: 3,
    },
    {
      word: 'brave',
      num: 5,
    },
  ];

  return (
    <div className="word-wizard d-flex flex-column align-center">
      <h1>How to play Word Wizard</h1>
      <div className="tray">
        <HelperLettersContext
          helperLetters={helperLetters}
          dispatchHelperLetters={dispatchHelperLetters}
          render={() => (
            <div>
              <h2>The Goal</h2>
              <div>
                The goal of Word Wizard is to guess a hidden 5 letter word. Each round you have 5 minutes to guess the word, and every time you make a valid guess the timer resets to 5 minutes. For each valid guess you will see a number which represents the number of letters in the guess that also appear in the hidden word. Everyone playing at the same time is trying to guess the same word, the goal is for you to be the first person to guess it!
              </div>
              <h2>What makes a valid guess?</h2>
              <ul>
                <li>The guess must contain exactly 5 UNIQUE letters (no repeat letters)</li>
                <li>The guess must contain exactly the number of correct letters in each previous guess</li>
                <li>The guess must be a real word (the game dictionary is not perfect, <a href="https://github.com/schnej7/website/blob/main/wordWizard/Words.ts" target="_blank">submit a pull request to fix it here</a>)
                </li>
              </ul>
              <h2>Example</h2>
              <div>To begin, make the guess "wrist":</div>
              {
                guesses.slice(0, 1).map((guess: TGuess) =>
                  <Guess
                    guess={guess}
                  />
                )
              }
              <div>We now know that exactly 1 of the letters of W R I S T is in the word we are trying to guess. Now our next guess must contain exactly 1 of those letters. Our next guess can be "relay", because it shares only one letter with "wrist" (R).</div>
              {
                guesses.slice(0, 2).map((guess: TGuess) =>
                  <Guess
                    guess={guess}
                  />
                )
              }
              <div>We now know that exactly 3 of the letters of R E L A Y are in the word we are trying to guess. Now our next guess must contain exactly 1 letter from W R I S T and 3 letters from R E L A Y. Our next guess can be "brave" because it contains one letter from "wrist" (R) and 3 letters from "relay" (R E A).</div>
              {
                guesses.map((guess: TGuess) =>
                  <Guess
                    guess={guess}
                  />
                )
              }
              <div>Congratulations! You guessed the word! <Link to='/word-wizard'>Now try playing with everyone else.</Link></div>
              <h2>Tips</h2>
              <ul>
                <li>You can click on a letter to highlight every instance of that letter to visualize which letters you want to use.</li>
                <li>You can right click on a letter to highlight every instance of that letter red to visualize which letters you don't want to use.</li>
                <li>Other players can see your guesses and you can see theirs. You can work together to figure out the answer!</li>
              </ul>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default WordWizardHowToPlay;

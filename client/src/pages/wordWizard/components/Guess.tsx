import './Guess.scss';
import { TGuess } from '../WordWizard.tsx';
import { HLContext } from './HelperLettersContext.tsx';
import { useContext } from 'react';

type Props = {
  guess: TGuess;
};

export default function Guess(props: Props) {
  const helperLettersContext = useContext(HLContext);

  const handleOnClick = (letter: string) => {
    helperLettersContext.dispatchHelperLetters({
      type: 'select',
      letter,
    });
  };

  const handleOnRightClick = (letter: string) => {
    helperLettersContext.dispatchHelperLetters({
      type: 'de-select',
      letter,
    });
  };

  const guessLetters = props.guess.word.split('');

  const selectedHelperLettersInWord = guessLetters.reduce(
    (acc, cur) => acc += helperLettersContext.helperLetters.include[cur] ? 1 : 0,
    0,
  );

  const correctNumberClass = Object.keys(helperLettersContext.helperLetters.include).length
    ? (props.guess.num === selectedHelperLettersInWord ? 'correct' : 'incorrect')
    : '';

  const letters = [
    (
      <div className={`number ${correctNumberClass}`}>
        {props.guess.num}
      </div>
    ),
    ...guessLetters.map((letter) => {
        const included = helperLettersContext.helperLetters.include[letter] ? 'included' : '';
        const excluded = helperLettersContext.helperLetters.exclude[letter] ? 'excluded' : '';
        const classes = `letter ${included} ${excluded}`;
        return (
          <div
            className={classes}
            onClick={() => {handleOnClick(letter)}}
            onContextMenu={(e) => {
              e.preventDefault();
              handleOnRightClick(letter);
            }}
          >
            {letter}
          </div>
        )
      }),
  ]

  return (
    <div className="guess">
      {letters}
    </div>
  )
}

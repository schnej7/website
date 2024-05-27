import './Word.scss';
import { TGuess } from '../WordWizard.tsx';
import type {
  HelperLetters,
  HelperLettersAction,
} from '../store/HelperLettersStore.ts';

type Props = {
  guess: TGuess;
  helperLetters: HelperLetters;
  dispatchHelperLetters: (action: HelperLettersAction) => void;
};

export default function Guess(props: Props) {
  const letters = [
    (
      <div className='number'>
        {props.guess.num}
      </div>
    ),
    ...props.guess.word
      .split('')
      .map((letter) => (
        <div className='letter'>
          {letter}
        </div>
      )),
  ]

  return (
    <div className="guess">
      {letters}
    </div>
  )
}

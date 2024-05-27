import './Word.scss';
import { TGuess } from '../WordWizard.tsx';

type Props = {
  guess: TGuess;
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

import { createContext, ReactElement } from 'react';
import type {
  HelperLetters,
  HelperLettersAction,
} from '../store/HelperLettersStore.ts';

type Props = {
  helperLetters: HelperLetters;
  dispatchHelperLetters: (action: HelperLettersAction) => void;
  render: () => ReactElement,
};

type HelperLettersContextType = {
  helperLetters: HelperLetters;
  dispatchHelperLetters: (action: HelperLettersAction) => void;
};

const HLContext = createContext<HelperLettersContextType>({
  helperLetters: {
    include: {},
    exclude: {},
  },
  dispatchHelperLetters: (action: HelperLettersAction) => { console.warn('unexpected call of default dispatch', action) },
});

export default function HelperLettersContext(props: Props) {
  return (
    <div>
      <HLContext.Provider value={{helperLetters: props.helperLetters, dispatchHelperLetters: props.dispatchHelperLetters}}>
        {props.render()}
      </HLContext.Provider>
    </div>
  )
}

export {
  HLContext,
};

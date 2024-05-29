type HelperLetters = {
  include: { [key: string]: boolean };
  exclude: { [key: string]: boolean };
}

const initialHelperLetters = {
  include: {},
  exclude: {},
};

type HelperLettersAction = {
  type: string;
  letter: string;
};

const helperLettersReducer = (
  state: HelperLetters,
  action: HelperLettersAction,
) => {
  switch (action.type) {
    case "select":
      if (state.exclude[action.letter]) {
        delete state.exclude[action.letter];
      }
      if (state.include[action.letter]) {
        delete state.include[action.letter];
      } else {
        state.include[action.letter] = true;
      }
      return { ...state };
    case "de-select":
      if (state.include[action.letter]) {
        delete state.include[action.letter];
      }
      if (state.exclude[action.letter]) {
        delete state.exclude[action.letter];
      } else {
        state.exclude[action.letter] = true;
      }
      return { ...state };
    default:
      return state;
  }
}

export type {
  HelperLetters,
  HelperLettersAction,
};

export {
  initialHelperLetters,
  helperLettersReducer,
};

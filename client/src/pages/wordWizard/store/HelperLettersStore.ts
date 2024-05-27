type HelperLetters = {
  include: Set<string>;
  exclude: Set<string>;
}

const initialHelperLetters = {
  include: new Set<string>(),
  exclude: new Set<string>(),
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
      if (state.exclude.has(action.letter)) {
        state.exclude.delete(action.letter);
      } else {
        state.include.add(action.letter);
      }
      return state;
    case "de-select":
      if (state.include.has(action.letter)) {
        state.exclude.delete(action.letter);
      } else {
        state.exclude.add(action.letter);
      }
      return state
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

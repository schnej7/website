import WordList from './Words.ts';

const GAME_RESET_TIME = 1000 * 60 * 5; // 5 minutes

class WordWizard {
  guesses = [];

  answer = '';

  message = '';

  resetInterval = null;

  intervalStartTime = Date.now();

  getRemainingTime() {
    if (!this.resetInterval) {
      return GAME_RESET_TIME / 1000;
    }
    return Math.ceil((GAME_RESET_TIME - (Date.now() - this.intervalStartTime)) / 1000);
  }

  resetGame() {
    this.guesses = [];
    this.answer = this.getNewAnswerWord();
    console.log("New answer:", this.answer);
    clearInterval(this.resetInterval);
    this.resetInterval = null;
  }

  resetGameInactive() {
    this.message = `Nobody got ${this.answer}, game reset.`;
    this.resetGame();
  }

  getNewAnswerWord() {
    let answerIndex = Math.floor(Math.random() * WordList.length);
    while(!this.isValidGuess(WordList[answerIndex])) {
      answerIndex = Math.floor(Math.random() * WordList.length);
    }
    return WordList[answerIndex];
  }

  numOccurences(word, target) {
    return word.split("").filter((letter) => letter === target).length;
  };

  getWordScore(word) {
    let score = 0;
    for (let letterIdx in word) {
      if (this.numOccurences(this.answer, word[letterIdx]) === 1) {
        score += 1;
      }
    }
    return score;
  }

  isValidGuess (guess) {
    if (guess.length != 5) {
      return false;
    }

    for (let letterIdx in guess) {
      if (this.numOccurences(guess, guess[letterIdx]) > 1) {
        return false;
      }
    }

    for (let prevGuessIdx in this.guesses) {
      const prevGuess = this.guesses[prevGuessIdx];
      if (prevGuess.word === guess) {
        return false;
      }

      let occ = 0;
      for (let letterIdx in guess) {
        occ += this.numOccurences(prevGuess.word, guess[letterIdx]);
      }
      if (occ != prevGuess.num) {
        return false;
      }
    }

    return WordList.indexOf(guess) >= 0;
  }

  makeGuess(guess) {
    if (this.isValidGuess(guess)) {
      if (this.answer === guess) {
        this.resetGame();
        this.message = `Someone got the word "${guess}"`;
        return true;
      }
      else {
        this.guesses.push({ word: guess, num: this.getWordScore(guess) });
        clearInterval(this.resetInterval);
        this.intervalStartTime = Date.now();
        this.resetInterval = setInterval((() => this.resetGameInactive()), GAME_RESET_TIME);
        return true;
      }
    }
    return false;
  }

  reset() {
    this.resetGame();
  }

  handleGetRequest(req, res) {
    res.send({
      guesses: this.guesses,
      message: this.message,
      timeRemaining: this.getRemainingTime(),
    });
  }

  handlePostRequest(req, res) {
    if (req.body.guess) {
      this.makeGuess(req.body.guess.toLowerCase(), req.query.user);
    }

    res.send({
      guesses: this.guesses,
      message: this.message,
      timeRemaining: this.getRemainingTime(),
    });
  }
}

export { WordWizard };

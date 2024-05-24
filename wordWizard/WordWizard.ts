import WordList from './Words.ts';

const GAME_RESET_TIME = 1000 * 60 * 5; // 5 minutes

class WordWizard {
  guesses = [];

  answer = '';

  message = '';

  resetInterval = null;

  getTimeLeft() {
    if (!this.resetInterval) {
      return GAME_RESET_TIME / 1000;
    }
    return Math.ceil((this.resetInterval._idleStart + this.resetInterval._idleTimeout - Date.now()) / 1000);
  }

  resetGame() {
    this.guesses = [];
    this.answer = this.getNewAnswerWord();
    console.log("New answer:", this.answer);
    clearInterval(this.resetInterval);
    this.resetInterval = null;
  }

  resetGameInactive() {
    this.message = "Nobody got "+this.answer+", game reset.";
    this.resetGame();
  }

  getNewAnswerWord() {
    var answerIndex = Math.floor(Math.random() * WordList.length);
    while( !this.isValidGuess(WordList[answerIndex]) )
    {
        answerIndex = Math.floor(Math.random() * WordList.length);
    }
    return WordList[answerIndex];
  }

  numOccurences(arr, target) {
    var occ = 0;
    for (let letter in arr) {
      if (target == arr[letter]) {
        occ += 1;
      }
    }
    return occ;
  };

  getWordScore(word) {
    var score = 0;
    for (var letter in word) {
      if (this.numOccurences(this.answer, word[letter]) == 1) {
        score += 1;
      }
    }
    return score;
  }

  isValidGuess (guess) {
    if (guess.length != 5) { return false; }
    for (var letter in guess) {
      if (this.numOccurences(guess, guess[letter]) > 1) { return false; }
    }
    for (var oldGuess in this.guesses) {
      if (this.guesses[oldGuess].word == guess) { return false; }
      var localOcc = 0;
      for (var letter in guess) {
        localOcc += this.numOccurences(this.guesses[oldGuess].word, guess[letter]);
      }
      if (localOcc != this.guesses[oldGuess].num) { return false; }
    }
    return WordList.indexOf(guess) >= 0;
  }

  makeGuess(guess, user) {
    if (this.isValidGuess(guess)) {
      if (this.answer == guess) {
        this.resetGame();
        this.message = user + " got the word " + guess;
        return "Got it!";
      }
      else {
        this.guesses.push({word: guess, num: this.getWordScore(guess)});
        clearInterval(this.resetInterval);
        this.resetInterval = setInterval(function(){ this.resetGameInactive(); }, GAME_RESET_TIME);
        return "Accepted";
      }
    }
    else {
      return "Invalid guess";
    }
  }

  getGuesses() {
    return this.guesses;
  }

  reset() {
    this.resetGame();
  }

  getMessage() {
    return this.message + " Time Left: " + this.getTimeLeft();
  }
}

var w = new WordWizard();

exports.handleRequest = function(req, res) {
    console.log(req.query);
    if (!req.query.guess) {
        res.send({
            guesses: w.getGuesses(),
            message: w.getMessage()
        });
    }
    else {
        var userMessage = w.makeGuess(req.query.guess, req.query.user);
        res.send({
            guesses: w.getGuesses(),
            message: userMessage
        });
    }
}

w.reset();

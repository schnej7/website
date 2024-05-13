import Jumbotron from '@components/jumbotron/Jumbotron'
import Tile from '@components/tile/Tile'

const tiles = [
  {
    title: "Word Wizard",
    description: "MMO Word guessing game written in javascript on nodeJS",
    link: {
      path: "word-wizard",
    },
  },
  {
    title: "Cloud Rocket",
    description: "Endless runner written in javascript for a game jam",
    link: {
      path: "cloud-rocket",
    },
  },
  {
    title: "Chip8 Emulator",
    description: "Chip8 emulator written in javascript including some fun games",
    link: {
      path: "chip8-emulator",
    },
  },
  {
    title: "RPS Contest",
    description: "My AI solutions for an AI vs AI rock, paper, scissors contest",
    link: {
      href: "http://www.rpscontest.com/authorSearch?name=Jerry",
    },
  },
  {
    title: "Python Markov Lib",
    description: "A Markov chain library and some fun word games which use it",
    link: {
      href: "https://github.com/schnej7/markov",
    },
  },
];

function Homepage() {
  return (
    <>
      <Jumbotron />
      <div className="tray">
        { tiles.map((tile, i) => <Tile
          key={i}
          title={tile.title}
          description={tile.description}
          link={tile.link}
        /> ) }
      </div>
    </>
  )
}

export default Homepage

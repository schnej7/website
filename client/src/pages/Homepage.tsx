import Tile, { TileProps } from '@components/tile/Tile.tsx'
import bgImgWebsite from '@components/tile/img/website.png'
import bgImgLinux from '@components/tile/img/linux.png'
import bgImgChip8 from '@components/tile/img/chip8.png'
import bgImgWordWizard from '@components/tile/img/wordwizard.png'
import bgImgCloudRocket from '@components/tile/img/cloudrocket.gif'
import bgImgRps from '@components/tile/img/rps.png'
import bgImgLinkedIn from '@components/tile/img/linkedin.jpg'
import bgImgGithub from '@components/tile/img/github.png'

const tiles: TileProps[] = [
  {
    title: "`src` for this website!",
    description: "The code behind your current experience",
    bgImagePath: bgImgWebsite,
    link: {
      href: "https://github.com/schnej7/website",
    },
  },
  {
    title: "`.files` linux configurations",
    description: ".bashrc, .vimrc, .screenrc",
    bgImagePath: bgImgLinux,
    link: {
      href: "https://github.com/schnej7/dotfiles",
    },
  },
  {
    title: "Chip8 Emulator",
    description: "Chip8 emulator written in javascript including some fun games",
    bgImagePath: bgImgChip8,
    link: {
      path: "chip8-emulator",
    },
  },
  {
    title: "Word Wizard",
    description: "MMO Word guessing game written in javascript on nodeJS",
    bgImagePath: bgImgWordWizard,
    link: {
      path: "word-wizard",
    },
  },
  {
    title: "Cloud Rocket",
    description: "Endless runner written in javascript for a game jam",
    bgImagePath: bgImgCloudRocket,
    link: {
      path: "cloud-rocket",
    },
  },
  {
    title: "RPS Contest",
    description: "My AI solutions for an AI vs AI rock, paper, scissors contest",
    bgImagePath: bgImgRps,
    link: {
      href: "http://www.rpscontest.com/authorSearch?name=Jerry",
    },
  },
  {
    title: "LinkedIn",
    description: "Check out my professional chops",
    bgImagePath: bgImgLinkedIn,
    link: {
      href: "https://www.linkedin.com/in/jerome-schneider-92a59340/",
    },
  },
  {
    title: "Github",
    description: "I love to write code",
    bgImagePath: bgImgGithub,
    link: {
      href: "https://github.com/schnej7",
    },
  },
];

function Homepage() {
  return (
    <>
      <div className="tray">
        {
          tiles.map((tile, i) => 
            <Tile
              key={i}
              title={tile.title}
              description={tile.description}
              link={tile.link}
              bgImagePath={tile.bgImagePath}
            />
          )
        }
      </div>
    </>
  )
}

export default Homepage

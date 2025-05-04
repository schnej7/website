import Tile, { TileProps } from '@components/tile/Tile.tsx'
import Blurb, { BlurbProps } from '@components/blurb/Blurb.tsx'
import bgImgWebsite from '@components/tile/img/website.png'
import bgImgLinux from '@components/tile/img/linux.png'
import bgImgChip8 from '@components/tile/img/chip8.png'
import bgImgWordWizard from '@components/tile/img/wordwizard.png'
import bgImgCloudRocket from '@components/tile/img/cloudrocket.gif'
import bgImgRps from '@components/tile/img/rps.png'
import bgImgLinkedIn from '@components/tile/img/linkedin.jpg'
import bgImgGithub from '@components/tile/img/github.png'
import bgImgNpm from '@components/tile/img/npm.png'

const blurb: BlurbProps = {
  header: "Crafting Seamless Front Ends with Code and Curiosity",
  subheader: "Hi, I'm Jerry — a passionate Front End developer and engineering lead with over a decade of experience building intuitive user interfaces. I’ve led development on React-based Chrome Extensions, real-time Vue apps, and TypeScript-heavy platforms, always with a focus on clean design, performance, and team collaboration. I thrive at the intersection of UI/UX, modern web tech, and lifelong learning.",
}

const tiles: TileProps[] = [
  {
    title: "Word Wizard",
    description: "Multiplayer word guessing game written in TypeScript using WebSockets",
    bgImagePath: bgImgWordWizard,
    link: {
      path: "word-wizard",
    },
  },
  {
    title: "Chip8 Emulator",
    description: "Chip8 emulator written in TypeScript using HTML5 Canvas",
    bgImagePath: bgImgChip8,
    link: {
      path: "chip8-emulator",
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
    title: "`src` for this website!",
    description: "The code behind your current experience",
    bgImagePath: bgImgWebsite,
    link: {
      href: "https://github.com/schnej7/website",
    },
  },
  {
    title: "Debouncer",
    description: "Open Source TypeScript function debouncer",
    bgImagePath: bgImgNpm,
    link: {
      href: "https://www.npmjs.com/package/@schnej7/debouncer",
    },
  },
  {
    title: "`.files`",
    description: " linux configurations: .bashrc, .vimrc, .screenrc",
    bgImagePath: bgImgLinux,
    link: {
      href: "https://github.com/schnej7/dotfiles",
    },
  },
  {
    title: "RPS Contest",
    description: "My submissions for an AI rock, paper, scissors contest",
    bgImagePath: bgImgRps,
    link: {
      href: "http://www.rpscontest.com/authorSearch?name=Jerry",
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
  {
    title: "LinkedIn",
    description: "let's connect",
    bgImagePath: bgImgLinkedIn,
    link: {
      href: "https://www.linkedin.com/in/jerome-schneider-92a59340/",
    },
  },
];

function Homepage() {
  return (
    <>
      <div className="tray">
        <Blurb
          header={ blurb.header }
          subheader={ blurb.subheader }
        />
        <div className="tiles">
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
      </div>
    </>
  )
}

export default Homepage

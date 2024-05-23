import './Tile.scss';
import { Link } from "react-router-dom";

type TileProps = {
  title: string;
  description: string;
  link: {
    href: string;
    path?: undefined;
  } | {
    href?: undefined;
    path: string;
  },
};

export default function Tile(props: TileProps) {

  const innerTile = (
    <>
      <div className="title">
        <div className="text">{ props.title }</div>
      </div>
      <div className="description">
        <div className="text">{ props.description }</div>
      </div>
    </>
  );

  if (props.link.href) {
    return (
      <>
        <a className="tile" href={ props.link.href } target="_blank">
          { innerTile }
        </a>
      </>
    )
  }

  return (
    <>
      <Link className="tile" to={ props.link.path! } >
        { innerTile }
      </Link>
    </>
  )
}

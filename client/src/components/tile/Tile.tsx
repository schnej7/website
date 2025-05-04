import './Tile.scss';
import { Link } from "react-router-dom";

export type TileProps = {
  title: string;
  description: string;
  bgImagePath?: string;
  link: {
    href: string;
    path?: never;
  } | {
    href?: never;
    path: string;
  },
};

export default function Tile(props: TileProps) {

  const style = props.bgImagePath
    ? {
      background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9) ), url(${props.bgImagePath})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    } : undefined;

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
        <a
          className="tile"
          href={ props.link.href }
          target="_blank"
          style={ style }
        >
          { innerTile }
        </a>
      </>
    )
  }

  return (
    <>
      <Link
        className="tile"
        to={ props.link.path! }
        style={ style }
      >
        { innerTile }
      </Link>
    </>
  )
}

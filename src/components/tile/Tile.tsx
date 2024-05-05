import './Tile.scss';
import { Link } from "react-router-dom";

export default function Tile(props) {

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
      <Link className="tile" to={ props.link.path } name={props.link.path} >
        { innerTile }
      </Link>
    </>
  )
}

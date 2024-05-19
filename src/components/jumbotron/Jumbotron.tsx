import './Jumbotron.scss';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Jumbotron(props) {
  const [ isAtTop, setIsAtTop ] = useState(true);

  const handleScroll = () => {
    const app = document.getElementById("APP");
    setIsAtTop(app.scrollTop === 0);
  };

  useEffect(() => {
    handleScroll();
    const app = document.getElementById("APP");
    app.addEventListener("scroll", handleScroll);

    return () => {
      app.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const atTop = isAtTop ? 'at-top' : '';

  const noJumbo = props.noJumbo ? 'no-jumbo' : '';

  return (
    <>
      <div className={`jumbotron ${atTop} ${noJumbo}`}>
        {headerText(noJumbo)}
      </div>
      <div className={`jumbotron-spacer ${atTop} ${noJumbo}`} />
    </>
  )
}

function headerText(noJumbo) {
  const href = noJumbo ? '/' : undefined;
  return (
    <Link className="text-wrap" to={href}>
      {headerTextContent()}
    </Link>
  );
}

function headerTextContent() {
  return (
    <>
      <div className="rotate-wrap">
        <h2>Software<br />Engineer</h2>
      </div>
      <h1>Jerry<br />Schneider</h1>
    </>
  )
}

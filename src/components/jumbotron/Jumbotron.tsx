import './Jumbotron.scss';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Jumbotron(props: { noJumbo?: boolean }) {
  const [ isAtTop, setIsAtTop ] = useState(true);

  const handleScroll = () => {
    const app = document.getElementById("APP");
    setIsAtTop(Boolean(app) && app!.scrollTop === 0);
  };

  useEffect(() => {
    handleScroll();
    const app = document.getElementById("APP");
    if (app) {
      app.addEventListener("scroll", handleScroll);

      return () => {
        app.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const atTop = isAtTop ? 'at-top' : '';

  const noJumboClass = props.noJumbo ? 'no-jumbo' : '';

  return (
    <>
      <div className={`jumbotron ${atTop} ${noJumboClass}`}>
        <Link className="text-wrap" to='/'>
          <div className="rotate-wrap">
            <h2>Software<br />Engineer</h2>
          </div>
          <h1>Jerry<br />Schneider</h1>
        </Link>
      </div>
      <div className={`jumbotron-spacer ${atTop} ${noJumboClass}`} />
    </>
  )
}

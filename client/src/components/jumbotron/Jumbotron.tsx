import './Jumbotron.scss';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Debouncer from "@schnej7/debouncer";

export default function Jumbotron(props: { noJumbo?: boolean }) {
  const [ isAtTop, setIsAtTop ] = useState(true);

  useEffect(() => {
    const handleScrollDebouncer = new Debouncer(() => {
      const app = document.getElementById("APP");
      setIsAtTop(Boolean(app) && app!.scrollTop === 0);
    }, 100);

    const onScroll = () => handleScrollDebouncer.debounce();
    onScroll();
    const app = document.getElementById("APP");
    if (app) {
      app.addEventListener("scroll", onScroll);

      return () => {
        app.removeEventListener("scroll", onScroll);
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

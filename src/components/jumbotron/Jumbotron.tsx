import './Jumbotron.scss';
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
        <div className="flex-spacer" />
        <div className="text-wrap">
          <div className="rotate-wrap">
            <div className="flex-spacer" />
            <h2>Software<br />Engineer</h2>
          </div>
          <h1>Jerry<br />Schneider</h1>
        </div>
        <div className="flex-spacer" />
      </div>
      <div className={`jumbotron-spacer ${atTop} ${noJumbo}`} />
    </>
  )
}

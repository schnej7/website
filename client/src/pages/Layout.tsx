import AnimatedBackground from "@components/animatedBackground/AnimatedBackground.tsx";
import Jumbotron from "@components/jumbotron/Jumbotron.tsx";
import { Outlet } from "react-router-dom";

type Props = {
  noHeader?: boolean,
  smallHeader?: boolean,
};

const Layout = (props: Props) => {

  let header = undefined;
  let background = undefined;

  if (!props.noHeader) {
    header = props.smallHeader ? <Jumbotron noJumbo={true} /> : <Jumbotron />;
    background = props.smallHeader ? undefined : <AnimatedBackground />;
  }

  return (
    <>
      <div id="APP">
        { header }
        <Outlet />
      </div>
      { background }
    </>
  )
};

export default Layout;

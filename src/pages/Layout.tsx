import Jumbotron from "@components/jumbotron/Jumbotron.tsx";
import { Outlet } from "react-router-dom";

type Props = {
  noHeader?: boolean,
  smallHeader?: boolean,
};

const Layout = (props: Props) => {

  let header = undefined;

  if (!props.noHeader) {
    header = props.smallHeader ? <Jumbotron noJumbo={true} /> : <Jumbotron />;
  }

  return (
    <>
      <div id="APP">
        { header }
        <Outlet />
      </div>
    </>
  )
};

export default Layout;

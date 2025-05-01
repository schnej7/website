import './Blurb.scss';

export type BlurbProps = {
  header: string;
  subheader: string;
};

export default function Blurb(props: BlurbProps) {
  return (
    <>
      <div className="blurb">
        <h2 className="header">{ props.header }</h2>
        <div className="subheader">{ props.subheader }</div>
      </div>
    </>
  )
}

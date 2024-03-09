import "./Path.css";

const PathHeader = (props: { name: string }) => {
  return (
    <div className="pathHeader">
      <p>{props.name}</p>
    </div>
  );
};

export default PathHeader;

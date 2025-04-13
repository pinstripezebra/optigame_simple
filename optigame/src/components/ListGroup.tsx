import { Fragment, useState } from "react";

// {items: [], heading: ""}
interface Props {
    items: string[];
    heading: string;

}
function ListGroup({items, heading}: Props) {
  // Hook functional component
  const [selectedIndex, setSelectedIndex] = useState(-1);
 


  return (
    <Fragment>
      <h1>{heading}</h1>
      {items.length === 0 && <p> No items found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {setSelectedIndex(index);}}
          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default ListGroup;

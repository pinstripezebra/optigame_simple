import { Fragment, useState } from "react";

function ListGroup() {
  let items = ["monopoly", "chess", "poker", "uno", "scrabble"];

  // Hook functional component
  const [selectedIndex, setSelectedIndex] = useState(-1);
 


  return (
    <Fragment>
      <h1> List</h1>
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

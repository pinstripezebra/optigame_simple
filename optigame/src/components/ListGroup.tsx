import { Fragment, useState } from "react";

// {items: [], heading: ""}
interface Props {
    items: string[];
    heading: string;
    //notify of selected item
    onSelectItem: (item: string) => void;

}
function ListGroup({items, heading, onSelectItem}: Props) {
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
            onClick={() => {
                setSelectedIndex(index);
                onSelectItem(item); // Notify the parent component of the selected item
            }}

          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default ListGroup;

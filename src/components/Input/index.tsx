import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { useRef, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const DEBOUNCE_TIME = 100; //ms

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  const inputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // DO NOT remove this log
  console.log("input re-render");

  const onChangeInput = debounce((event) => {
    const { value } = event.target;
    setIsLoading(true);
    setErrorMessage("");
    fetchData(value)
      .then((response) => {
        // skip result if the value has been changed
        if (inputRef.current.value != value) {
          return;
        }
        setItems(response);
      })
      .catch((error) => {
        if (inputRef.current.value != value) {
          return;
        }
        setErrorMessage(error);
      })
      .finally(() => {
        if (inputRef.current.value != value) {
          return;
        }
        setIsLoading(false);
      });
  }, DEBOUNCE_TIME);

  const renderSearchResult = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (errorMessage) {
      return (
        <div className={"search__error-message"}>{errorMessage}</div>
      );
    }
    if (items.length === 0) {
      return <div className={'search__no-result'}>No result</div>
    }
    return (
      <ul className={'search__list'}>
        {items.map((item, index) => (
          <li className={'search__item'} key={item + index} onClick={() => onSelectItem(item)}>{item}</li>
        ))}
      </ul>
    );
  };

  // Your code start here
  return (
    <div className={"search"}>
      <input
        className={"search__input"}
        placeholder={placeholder}
        onChange={onChangeInput}
        ref={inputRef}
      />
      {inputRef.current && inputRef.current.value && (
        <div className={"search__result"}>
          {renderSearchResult()}
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default Input;

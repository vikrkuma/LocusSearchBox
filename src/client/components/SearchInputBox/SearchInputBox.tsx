import React, { memo, useState, useCallback } from "react";
import cx from "classnames";

import constants from "./constants";
import styles from "./SearchInputBox.scss";

interface ISearchInputBoxProps {
  onSearchInput: (input: string) => void;
}

let inputTimeout: NodeJS.Timeout;

function SearchInputBox({ onSearchInput }: ISearchInputBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const text = event.currentTarget.value;
      setShowClearButton(!!text);
      setIsFocused(!!text);

      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(() => {
        onSearchInput(text);
      }, constants.DEBOUNCE_TIME);
    },
    [onSearchInput]
  );

  const onClearText = useCallback(() => {
    setShowClearButton(false);
    setIsFocused(false);
    onSearchInput("");
  }, [onSearchInput]);

  const wrapperClass = cx(styles.wrapper, {
    [styles.nonFocused]: !isFocused,
    [styles.focused]: isFocused,
  });

  return (
    <div className={wrapperClass}>
      <img />
      <input
        placeholder={constants.PLACEHOLDER_TEXT}
        onChange={onInputChange}
        className={styles.inputBox}
      />
      {showClearButton && (
        <button className={styles.clearButton} onClick={onClearText}>
          X
        </button>
      )}
    </div>
  );
}

export default memo(SearchInputBox);

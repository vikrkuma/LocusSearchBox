import React, { memo } from "react";

import SearchListItem from "./SearchListItem";
import styles from "./SuggestionBox.scss";

interface ISuggestionBoxProps {
  suggestions: IDataItem[] | null;
  searchText: string | null;
}

function SuggestionBox({ suggestions, searchText }: ISuggestionBoxProps) {
  if (!Array.isArray(suggestions) || !searchText) return null;

  if (suggestions.length === 0) {
    return (
      <div className={styles.noUserFound}>
        <p>No User Found</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {suggestions.map((suggestion, index) => (
        <SearchListItem {...suggestion} key={index} searchText={searchText} />
      ))}
    </div>
  );
}

export default memo(SuggestionBox);

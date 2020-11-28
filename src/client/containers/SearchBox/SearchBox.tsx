import React, { memo, useState, useCallback } from "react";

import SearchInputBox from "../../components/SearchInputBox";
import SuggestionBox from "../../components/SuggestionBox";
import styles from "./SearchBox.scss";

import { getSearchSuggestions } from "./dataHelper";

function SearchBox() {
  const [suggestions, setSuggestions] = useState<IDataItem[] | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);

  const onSearchInput = useCallback((text: string) => {
    setSuggestions(null);
    if (!text) {
      setSearchText(null);
      return;
    }
    setSearchText(text);

    getSearchSuggestions(text).then(setSuggestions);
  }, []);

  return (
    <div className={styles.wrapper}>
      <SearchInputBox onSearchInput={onSearchInput} />
      <SuggestionBox suggestions={suggestions} searchText={searchText} />
    </div>
  );
}

export default memo(SearchBox);

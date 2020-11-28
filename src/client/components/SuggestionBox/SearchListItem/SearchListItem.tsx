import React, { memo } from "react";

import TextHighlighter from "../TextHighlighter";
import styles from "./SearchListItem.scss";

interface ISearchListItemProps extends IDataItem {
  searchText: string;
}

function SearchListItem({ id, name, address, pincode, searchText, items }: ISearchListItemProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.id}>
        <TextHighlighter input={id} highlight={searchText} />
      </div>
      <div className={styles.name}>
        <TextHighlighter input={name} highlight={searchText} />
      </div>
      {items && (
        <div className={styles.foundInItem}>
          <div className={styles.dot} />
          <p>{`"${searchText}" found in items`}</p>
        </div>
      )}
      <div className={styles.address}>
        <TextHighlighter input={address} highlight={searchText} />
      </div>
      <div className={styles.pincode}>
        <TextHighlighter input={pincode} highlight={searchText} />
      </div>
    </div>
  );
}

export default memo(SearchListItem);

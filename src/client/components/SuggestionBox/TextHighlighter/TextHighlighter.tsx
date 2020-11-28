import React, { memo, useState, useEffect } from "react";

import { getSplitStrings } from "./helper";
import styles from "./TextHighlighter.scss";

interface ITextHighlighterProps {
  input: string;
  highlight: string;
}

function TextHighlighter({ input, highlight }: ITextHighlighterProps) {
  const [stringParts, setStringParts] = useState<string[] | null>(null);

  useEffect(() => {
    if (input && highlight) {
      setStringParts(getSplitStrings(input, highlight));
    }
  }, []);

  if (stringParts === null) return null;

  if (stringParts.length === 1) return <p className={styles.para}>{stringParts}</p>;

  return (
    <p className={styles.para}>
      {stringParts.map((s, index) => {
        if (index % 2 !== 0) {
          return (
            <mark key={index} className={styles.mark}>
              {s}
            </mark>
          );
        } else {
          return <span key={index}>{s}</span>;
        }
      })}
    </p>
  );
}

export default memo(TextHighlighter);

export function getSplitStrings(input: string, highlight: string): string[] {
  const splitStrings: string[] = [];
  const clone = input.toLowerCase();
  const checkString = highlight.toLowerCase();
  let index = clone.indexOf(checkString);
  let previousIndex = 0;

  if (index === -1) {
    splitStrings.push(input);
    return splitStrings;
  }

  while (index > -1) {
    splitStrings.push(input.substring(previousIndex, index));
    splitStrings.push(input.substr(index, highlight.length));
    previousIndex = index + highlight.length;
    index = clone.indexOf(checkString, previousIndex + 1);
  }
  splitStrings.push(input.substr(previousIndex));
  return splitStrings;
}

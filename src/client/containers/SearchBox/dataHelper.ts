const URL = "http://www.mocky.io/v2/5ba8efb23100007200c2750c";

function isStringMatch(data: string, searchText: string): boolean {
  return data.toLowerCase().indexOf(searchText) > -1;
}

function getMatchedItems(data: string[] | null, searchText: string): string[] | null {
  if (!Array.isArray(data)) return null;

  const filteredItems = data.filter((d) => isStringMatch(d, searchText));

  return filteredItems.length ? filteredItems : null;
}

function filterData(inputData: IDataItem[], searchText: string): IDataItem[] | null {
  if (!Array.isArray(inputData)) return null;

  if (inputData.length === 0) return [];

  const filteredData: IDataItem[] = [];
  inputData.forEach((data) => {
    const items = getMatchedItems(data.items, searchText);
    if (
      isStringMatch(data.id, searchText) ||
      isStringMatch(data.name, searchText) ||
      isStringMatch(data.address, searchText) ||
      isStringMatch(data.pincode, searchText) ||
      items
    ) {
      filteredData.push({ ...data, items });
    }
  });

  return filteredData;
}

export async function getSearchSuggestions(searchText: string): Promise<IDataItem[] | null> {
  if (!searchText) return Promise.resolve(null);

  const response = await fetch(URL);

  if (response.ok) {
    const data: IDataItem[] = await response.json();
    return Promise.resolve(filterData(data, searchText.toLowerCase()));
  } else {
    return Promise.resolve(null);
  }
}

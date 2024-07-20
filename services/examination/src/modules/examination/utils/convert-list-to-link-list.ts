type IItemData = {
  _id: string;
  prev?: string | null;
  next?: string | null;
};

export const convertListToLinkList = <T extends IItemData>(
  list: T[],
  results: T[],
): T[] => {
  if (results.length === list.length) return results;

  let cachedResults = [...results];
  if (!cachedResults.length) {
    const outsideItems = list.filter((item) => !item.prev && !item.next);
    cachedResults = [...outsideItems];

    const itemFirst = list.find((item) => !item.prev && !!item.next);
    if (!itemFirst) return cachedResults;
    cachedResults = [...cachedResults, itemFirst];
    return convertListToLinkList(list, cachedResults);
  }

  const itemResult = cachedResults[cachedResults.length - 1];
  const itemFound = list.find(
    (item) => item.prev?.toString() === itemResult._id.toString(),
  );

  if (itemFound) {
    cachedResults = [...cachedResults, itemFound];
    return convertListToLinkList(list, cachedResults);
  }

  return cachedResults;
};

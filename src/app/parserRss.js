const extractDataFromItem = (item) => ({
  title: item.querySelector('title').textContent,
  description: item.querySelector('description').textContent,
  link: item.querySelector('link').textContent,
});

export default (rss) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(rss.data.contents, 'application/xml');

  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    const error = new Error('XML parsing error');
    error.name = 'ParsingError';
    throw error;
  }

  const items = xml.querySelectorAll('item');
  const data = {
    feeds: extractDataFromItem(xml),
    items: Array.from(items).map((item) => extractDataFromItem(item)),
  };

  return data;
};

const extractDataFromItem = (item) => ({
  title: item.querySelector('title').textContent,
  description: item.querySelector('description').textContent,
  link: item.querySelector('link').textContent,
});

export default (rss) => {
  const parser = new DOMParser();

  const xml = parser.parseFromString(rss.data.contents, 'application/xml');
  const items = xml.querySelectorAll('item');

  const data = {
    feeds: {
      title: xml.querySelector('title').textContent,
      description: xml.querySelector('description').textContent,
      url: xml.querySelector('link').textContent,
    },
    items: Array.from(items).map((item) => extractDataFromItem(item)),
  };
  return data;
};

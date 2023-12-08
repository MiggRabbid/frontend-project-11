import axios from 'axios';

const addProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};

const getData = (url) => axios.get(addProxy(url));

const extractDataFromItem = (item) => ({
  title: item.querySelector('title').textContent,
  description: item.querySelector('description').textContent,
  link: item.querySelector('link').textContent,
});

const parseXml = (url, parser) => getData(url)
  .then((response) => {
    const xml = parser.parseFromString(response.data.contents, 'application/xml');
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
  })
  .catch((error) => {
    console.error('Error parsing data:', error);
    throw error;
  });

export default (url, i18next) => {
  const parser = new DOMParser();
  return parseXml(url, parser)
    .then((rss) => rss)
    .catch((error) => {
      console.error('Error fetching RSS:', error);
      error.message = i18next.t('errors.incorrectRss');
      throw error;
    });
};

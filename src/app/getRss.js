import axios from 'axios';

const addProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};

const getData = (url) => axios.get(addProxy(url));

const parsData = (url, parser) => getData(url).then((response) => parser.parseFromString(response.data.contents, 'application/xml'))
  .then((xml) => {
    const items = xml.querySelectorAll('item');
    const data = {
      feeds: {
        title: xml.querySelector('title').textContent,
        description: xml.querySelector('description').textContent,
        url: xml.querySelector('link').textContent,
      },
      items: [],
    };
    items.forEach((item) => {
      data.items.push({
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      });
    });
    return data;
  })
  .catch((error) => { throw error; });

export default (url, i18next) => {
  const parser = new DOMParser();
  return parsData(url, parser).then((rss) => rss)
    .catch((error) => {
      error.message = i18next.t('errors.incorrectRss');
      throw error;
    });
};

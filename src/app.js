import requestRss from './requestRss/main';

export default () => {
  const state = {
    state: 'filling',
    data: {
      rssUrls: [{ id: 1, url: 'https://lenta.ru/rss' }],
      rss: [],
    },
    currentUrl: {
      inputUrl: '',
      error: '',
    },
  };

  requestRss(state);
};

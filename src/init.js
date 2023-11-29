
import i18next from 'i18next';
import resources from './locales/index';
import requestRss from './requestRss/main';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    resources,
  });

  const state = {
    state: 'filling',
    data: {
      rssUrls: [{ id: 1, url: 'https://lenta.ru/rss' }],
      rss: [],
    },
    currentUrl: {
      inputUrl: '',
      error: null,
      feedback: null,
    },
  };

  requestRss(state, i18nextInstance);
};

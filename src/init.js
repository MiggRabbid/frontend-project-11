import i18next from 'i18next';
import resources from './locales/index';
import app from './app/app';

export default () => {
  const state = {
    state: 'filling', // filling, processing, processed, failed
    data: {
      feeds: [],
      posts: [],
    },
    currentUrl: {
      inputUrl: '',
      error: null,
      feedback: null,
    },
  };

  const defaultLanguage = 'ru';

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: defaultLanguage,
    resources,
  })
    .then(() => {
      app(state, i18nextInstance);
    });
};

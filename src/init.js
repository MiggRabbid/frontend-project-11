import i18next from 'i18next';
import resources from '../locales/index';
import setYupLocale from '../locales/locale';
import app from './app/app';

export default () => {
  const state = {
    state: 'filling', // filling, processing, processed, failed
    data: {
      feeds: [],
      posts: [],
    },
    uiState: {
      vievedPost: null,
      viewedPostsId: new Set(),
    },
    currentUrl: null,
    feedbacks: [],
  };

  const defaultLanguage = 'ru';

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: defaultLanguage,
    resources,
  })
    .then(() => {
      setYupLocale(i18nextInstance);
      app(state, i18nextInstance);
    });
};

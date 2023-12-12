import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId';
import urlValidator from './validator';
import getRss from './getRss';
import parsserRss from './parserRss';
import updateRss from './updateRss';
import render from './render';

const handleLinksAndViewModal = (state, watchedState) => {
  const container = document.querySelector('.posts');

  container.addEventListener('click', (event) => {
    const currentId = event.target.dataset.id;
    const indexToUpdate = state.data.posts.findIndex((post) => post.id === currentId);

    if (indexToUpdate !== -1) {
      const updatedPost = {
        ...state.data.posts[indexToUpdate],
        linkStatus: 'viewed',
      };
      watchedState.data.posts[indexToUpdate] = updatedPost;
    }
  });
};

const processRssData = (state, watchedState, data, inputUrl) => {
  const feedId = uniqueId();
  watchedState.data.feeds.push({
    id: feedId,
    ...data.feeds,
    link: inputUrl,
  });
  const currentPosts = [];
  data.items.forEach((item) => {
    currentPosts.unshift({
      id: uniqueId(),
      feedId,
      ...item,
      linkStatus: 'new',
    });
  });
  watchedState.data.posts = [...currentPosts, ...state.data.posts];
};

export default (state, i18next) => {
  const watchedState = onChange(state, render);

  const form = document.querySelector('.rss-form');
  const buttonAdd = form.querySelector('button[aria-label="add"]');

  buttonAdd.addEventListener('click', (event) => {
    event.preventDefault();

    const formData = new FormData(document.querySelector('.rss-form'));
    const inputUrl = formData.get('url');
    state.currentUrl.url = inputUrl;

    urlValidator(state.data.feeds, inputUrl, i18next)
      .then(() => { watchedState.state = 'processing'; })
      .then(() => getRss(inputUrl))
      .then((rss) => parsserRss(rss))
      .then((data) => processRssData(state, watchedState, data, inputUrl))
      .then(() => {
        watchedState.currentUrl.feedback = i18next.t('feedback.uploadedRss');
        watchedState.state = 'processed';
        formData.set('url', '');
      })
      .catch((error) => {
        if (error.message === 'not unique url') {
          watchedState.currentUrl.error = i18next.t('errors.existsUrl');
        } else if (error.name === 'TypeError') {
          watchedState.currentUrl.error = i18next.t('errors.incorrectRss');
        } else if (error.name === 'AxiosError') {
          watchedState.currentUrl.error = i18next.t('errors.networkError');
        } else {
          watchedState.currentUrl.error = error.message;
        }
        watchedState.state = 'failed';
      })
      .finally(() => {
        state.state = 'filling';
        state.currentUrl.url = '';
        state.currentUrl.error = null;
        state.currentUrl.feedback = null;
        handleLinksAndViewModal(state, watchedState);
      });
  });

  updateRss(state, watchedState, handleLinksAndViewModal);
};

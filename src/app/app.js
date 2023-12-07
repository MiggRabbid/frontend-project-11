import onChange from 'on-change';
import urlValidator from './validator';
import getRss from './getRss';
import updateRss from './updateRss';
import render from './render';

export default (state, i18next) => {
  const watchedState = onChange(state, render('state'));
  const watchedFeedback = onChange(state, render('feedback'));
  const watchedFeeds = onChange(state, render('feeds'));
  const watchedPosts = onChange(state, render('posts'));

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input[id="url-input"]');
  const buttonAdd = form.querySelector('button[aria-label="add"]');

  updateRss(state, i18next, watchedPosts);

  input.addEventListener('input', (event) => {
    state.currentUrl.inputUrl = event.target.value.trim();
  });

  buttonAdd.addEventListener('click', () => {
    const { inputUrl } = state.currentUrl;
    urlValidator(state.data.feeds, inputUrl, i18next)
      .then(() => {
        watchedState.state = 'processing';
      })
      .then(() => getRss(inputUrl, i18next))
      .then((rss) => {
        const feedId = state.data.feeds.length + 1;
        watchedFeeds.data.feeds.push({
          id: feedId,
          ...rss.feeds,
          link: inputUrl,
        });
        const currentPosts = [];
        rss.items.forEach((item) => {
          currentPosts.push({
            id: state.data.posts.length + currentPosts.length + 1,
            feedId,
            ...item,
          });
        });
        watchedPosts.data.posts = [...currentPosts, ...state.data.posts];
      })
      .then(() => {
        watchedFeedback.currentUrl.feedback = i18next.t('feedback.uploadedRss');
        watchedState.state = 'processed';
      })
      .catch((error) => {
        watchedFeedback.currentUrl.error = error.message;
        watchedState.state = 'failed';
      })
      .finally(() => {
        state.state = 'filling';
        state.currentUrl.error = null;
        state.currentUrl.feedback = null;
      });

    !form.reset();
  });
};

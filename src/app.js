import onChange from 'on-change';
import rssUrlValidator from './rssUrlValidator';
import { renderFeedback } from './render';

const app = () => {
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

  const watchedState = onChange(state, renderFeedback);
  const watchedError = onChange(state, renderFeedback);

  const form = document.querySelector('.rss-form');

  const inputUrl = form.querySelector('input[id="url-input"]');
  inputUrl.addEventListener('input', (event) => {
    state.state = 'filling';
    state.currentUrl.inputUrl = event.target.value;
  });

  const buttonAdd = form.querySelector('button[aria-label="add"]');
  buttonAdd.addEventListener('click', (event) => {
    rssUrlValidator(state.data.rssUrls, state.currentUrl.inputUrl)
      .then(() => {
        watchedState.state = 'processed';
      })
      .catch((error) => {
        state.state = 'failed';
        watchedError.currentUrl.error = error.message;
      });

    !form.reset();
  });
};

export default app;

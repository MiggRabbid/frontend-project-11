import onChange from 'on-change';
import axios from 'axios';
import rssUrlValidator from './rssUrlValidator';
import render from './render';

const requestRss = (url, i18next) => {
  console.log('url -', url)
  return axios.get(url)
    .then(() => console.log('data -', response.data))
    .catch((error) => {
      console.log('error.code -', error.code)
      console.log('error.name -', error.name)
      console.log('error.message -', error.message)
    });
}

export default (state, i18next) => {
  const watchedState = onChange(state, render('state'));
  const watchedFeedback = onChange(state, render('feedback'));

  const form = document.querySelector('.rss-form');

  const inputUrl = form.querySelector('input[id="url-input"]');
  inputUrl.addEventListener('input', (event) => {
    state.currentUrl.inputUrl = event.target.value;
  });

  const buttonAdd = form.querySelector('button[aria-label="add"]');
  buttonAdd.addEventListener('click', () => {
    const inputUrl = state.currentUrl.inputUrl
    rssUrlValidator(state.data.rssUrls, inputUrl, i18next)
      .then(() => {
        watchedState.state = 'processing';
        requestRss(inputUrl, i18next)
      })
      .catch((error) => {
        watchedState.state = 'failed';
        watchedFeedback.currentUrl.error = error.message;
      })
      .then(() => {
        console.log('feedback -', state.currentUrl.feedback)
        watchedFeedback.currentUrl.feedback = i18next.t('feedback.uploadedRss');
        console.log('feedback -', state.currentUrl.feedback)
        watchedState.state = 'processed';
      })
      .catch((error) => {
        watchedState.state = 'failed';
        watchedFeedback.currentUrl.error = error.message;
      })
      .finally(() => {
        state.state = 'filling';
        state.currentUrl.error = null;
        state.currentUrl.feedback = null;
      });

    !form.reset();
  });
};

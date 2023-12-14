import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId';
import urlValidator from './validator';
import getRss from './getRss';
import parsserRss from './parserRss';
import updateRss from './updateRss';
import render from './render';

const processRssData = (watchedState, data, inputUrl) => {
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
    });
  });
  watchedState.data.posts = [...currentPosts, ...watchedState.data.posts];
};

export default (state, i18next) => {
  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('input[id="url-input"]');
  const container = document.querySelector('.posts');
  const watchedState = onChange(state, render(rssForm, input));

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(rssForm);
    const inputUrl = formData.get('url');

    urlValidator(watchedState.data.feeds, inputUrl, i18next)
      .then(() => { watchedState.state = 'processing'; })
      .then(() => getRss(inputUrl))
      .then((rss) => {
        const data = parsserRss(rss);
        processRssData(watchedState, data, inputUrl);
        watchedState.currentUrl.feedback.push({
          inputUrl,
          feedback: i18next.t('feedback.uploadedRss'),
        });
        watchedState.state = 'processed';
      })
      .catch((error) => {
        console.error(error);
        switch (error.name) {
          case 'ParsingError':
            watchedState.currentUrl.error.push({
              inputUrl,
              error: i18next.t('errors.incorrectRss'),
            });
            break;
          case 'AxiosError':
            watchedState.currentUrl.error.push({
              inputUrl,
              error: i18next.t('errors.networkError'),
            });
            break;
          default:
            watchedState.currentUrl.error.push({
              inputUrl,
              error: i18next.t(error.message),
            });
            break;
        }
        watchedState.state = 'failed';
      })
      .finally(() => {
        watchedState.state = 'filling';
        input.focus();
      });
  };

  const handleLinksAndModal = (event) => {
    const currentId = event.target.dataset.id;
    const indexToUpdate = watchedState.data.posts.findIndex((post) => post.id === currentId);

    if (indexToUpdate !== -1) {
      const updatedPost = {
        ...watchedState.data.posts[indexToUpdate],
      };
      watchedState.data.viewedPostsIds.push(updatedPost.id);
      watchedState.data.posts[indexToUpdate] = updatedPost;
    }
  };

  rssForm.addEventListener('submit', handleSubmit);
  container.addEventListener('click', handleLinksAndModal);
  updateRss(watchedState);
};

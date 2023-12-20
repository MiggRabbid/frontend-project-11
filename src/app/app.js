import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId';
import axios from 'axios';
import urlValidator from './validator';
import parserRss from './parserRss';
import render from './render';

const refreshTiming = 5000;

const addProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};

const getData = (url) => axios.get(addProxy(url), { timeout: 5000 })
  .catch((error) => { throw error; });

const updateRss = (watchedState) => {
  const { feeds, posts } = watchedState.data;
  feeds.forEach((feed) => {
    const feedPosts = posts.filter((post) => post.feedId === feed.id);
    getData(feed.link)
      .then((rss) => parserRss(rss))
      .then((data) => {
        const newPosts = [];
        data.items.forEach((item) => {
          newPosts.unshift({ id: uniqueId(), feedId: feed.id, ...item });
        });
        const isNewPost = (newPost, oldPosts) => !oldPosts.some((old) => old.link === newPost.link);
        const resultPost = newPosts.filter((newPost) => isNewPost(newPost, feedPosts));
        watchedState.data.posts.unshift(...resultPost);
      });
  });
  setTimeout(() => updateRss(watchedState), refreshTiming);
};

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

const errorMessage = (error) => {
  switch (error.name) {
    case 'ParsingError':
      return 'errors.incorrectRss';
    case 'AxiosError':
      return 'errors.networkError';
    default:
      return error.message;
  }
};

export default (state, i18next) => {
  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('input[id="url-input"]');
  const button = document.querySelector('button[aria-label="add"]');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  const elements = {
    rssForm, button, input, feeds, posts,
  };

  const watchedState = onChange(state, render(elements));

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(rssForm);
    const inputUrl = formData.get('url');
    urlValidator(watchedState.data.feeds, inputUrl)
      .then(() => {
        state.currentUrl = inputUrl
        watchedState.state = 'processing';
        return getData(inputUrl);
      })
      .then((rss) => {
        const data = parserRss(rss);
        processRssData(watchedState, data, inputUrl);
        const message = i18next.t('feedback.uploadedRss');
        watchedState.feedbacks.push({ type: 'uploaded', inputUrl, message });
        watchedState.state = 'processed';
      })
      .catch((error) => {
        console.error(error);
        const message = i18next.t(errorMessage(error));
        watchedState.feedbacks.push({ type: 'error', inputUrl, message });
        watchedState.state = 'failed';
      })
      .finally(() => {
        watchedState.state = 'filling';
      });
  };

  const handlePostClick = (event) => {
    const element = event.target;
    const curId = event.target.dataset.id;
    if (element.type === 'button') {
      const newViewedPost = state.data.posts.find((obj) => obj.id === curId);
      watchedState.uiState.vievedPost = newViewedPost;
    }
    watchedState.uiState.viewedPostsId.add(curId);
  };

  rssForm.addEventListener('submit', handleSubmit);
  posts.addEventListener('click', handlePostClick);

  updateRss(watchedState);
};

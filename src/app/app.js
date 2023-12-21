import uniqueId from 'lodash/uniqueId';
import axios from 'axios';
import urlValidator from './validator';
import parserRss from './parserRss';
import watcher from './render';

const refreshTiming = 5000;

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

const addProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};

const getData = (url) => axios.get(addProxy(url), { timeout: 5000 })
  .catch((error) => { throw error; });

const getPosts = (feedId, data) => {
  const posts = [];
  data.items.forEach((item) => posts.unshift({ id: uniqueId(), feedId, ...item }));
  return posts;
};

const updateRss = (watchedState) => {
  const { feeds, posts } = watchedState.data;
  feeds.forEach((feed) => {
    const feedPosts = posts.filter((post) => post.feedId === feed.id);
    const feedId = feed.id;
    getData(feed.link)
      .then((rss) => parserRss(rss))
      .then((data) => {
        const newPosts = getPosts(feedId, data);
        const isNewPost = (newPost, oldPosts) => !oldPosts.some((old) => old.link === newPost.link);
        const resultPost = newPosts.filter((newPost) => isNewPost(newPost, feedPosts));
        watchedState.data.posts.unshift(...resultPost);
      })
      .catch((error) => { console.error(error); });
  });
  setTimeout(() => updateRss(watchedState), refreshTiming);
};

const processRssData = (watchedState) => {
  watchedState.state = 'processing';
  watchedState.formState.isValid = 'waiting';
  const url = watchedState.currentUrl;
  return getData(url)
    .then((rss) => parserRss(rss))
    .then((data) => {
      const feedId = uniqueId();
      watchedState.data.feeds.push({ id: feedId, ...data.feeds, link: url });
      const currentPosts = getPosts(feedId, data);
      watchedState.data.posts = [...currentPosts, ...watchedState.data.posts];
      watchedState.formState.isValid = true;
      watchedState.state = 'processed';
    });
};

export default (state, i18next) => {
  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('input[id="url-input"]');
  const button = document.querySelector('button[aria-label="add"]');
  const modal = document.querySelector('div[id="modal"]');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  const elements = {
    rssForm, button, input, modal, feeds, posts,
  };
  const watchedState = watcher(state, i18next, elements);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(rssForm);
    const inputUrl = formData.get('url');
    watchedState.currentUrl = inputUrl;
    urlValidator(watchedState.data.feeds, inputUrl)
      .then(() => processRssData(watchedState))
      .catch((error) => {
        watchedState.formState.errors.push(errorMessage(error));
        watchedState.formState.isValid = false;
        watchedState.state = 'failed';
        console.error(error);
      })
      .finally(() => {
        state.formState.isValid = null;
        watchedState.state = 'filling';
      });
  };
  const handlePostClick = (event) => {
    const element = event.target;
    const postId = event.target.dataset.id;
    if (element.type === 'button') {
      const newViewedPost = state.data.posts.find((obj) => obj.id === postId);
      watchedState.uiState.vievedPost = newViewedPost;
    }
    watchedState.uiState.viewedPostsId.add(postId);
  };
  rssForm.addEventListener('submit', handleSubmit);
  posts.addEventListener('click', handlePostClick);
  updateRss(watchedState);
};

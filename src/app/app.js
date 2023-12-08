import onChange from 'on-change';
import urlValidator from './validator';
import getRss from './getRss';
import updateRss from './updateRss';
import render from './render';

const updateLinkOrModal = (state, watcher, event) => {
  const currentId = Number(event.target.dataset.id);
  const indexToUpdate = state.data.posts.findIndex((post) => post.id === currentId);
  if (indexToUpdate !== -1) {
    watcher[indexToUpdate] = {
      ...state.data.posts[indexToUpdate],
      linkStatus: 'viewed',
    };
  }
};

const handleLinksAndViewModal = (state) => {
  const watchedLinks = onChange(state.data.posts, render('link'));
  const watchedModal = onChange(state.data.posts, render('modal'));

  const postLinks = document.querySelector('.posts').querySelectorAll('a');
  const postViews = document.querySelector('.posts').querySelectorAll('button[data-bs-target="#modal"]');

  postLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      updateLinkOrModal(state, watchedLinks, event);
    });
  });

  postViews.forEach((view) => {
    view.addEventListener('click', (event) => {
      updateLinkOrModal(state, watchedModal, event);
    });
  });
};

const processRssData = (state, watchedFeeds, watchedPosts, rss, inputUrl) => {
  const feedId = state.data.feeds.length + 1;
  watchedFeeds.data.feeds.push({
    id: feedId,
    ...rss.feeds,
    link: inputUrl,
  });
  const currentPosts = [];
  rss.items.forEach((item) => {
    currentPosts.unshift({
      id: state.data.posts.length + currentPosts.length + 1,
      feedId,
      ...item,
      linkStatus: 'new',
    });
  });
  watchedPosts.data.posts = [...currentPosts, ...state.data.posts];
};

const handleButtonAddClick = (state, i18next, form, watchedState, watchedFeedback, watchedFeeds, watchedPosts) => {
  const buttonAdd = form.querySelector('button[aria-label="add"]');

  buttonAdd.addEventListener('click', () => {
    const { inputUrl } = state.currentUrl;
    urlValidator(state.data.feeds, inputUrl, i18next)
      .then(() => watchedState.state = 'processing')
      .then(() => getRss(inputUrl, i18next))
      .then((rss) => processRssData(state, watchedFeeds, watchedPosts, rss, inputUrl))
      .then(() => {
        watchedFeedback.currentUrl.feedback = i18next.t('feedback.uploadedRss');
        watchedState.state = 'processed';
      })
      .catch((error) => {
        console.error(error);
        watchedFeedback.currentUrl.error = error.message;
        watchedState.state = 'failed';
      })
      .finally(() => {
        state.state = 'filling';
        state.currentUrl.error = null;
        state.currentUrl.feedback = null;
        handleLinksAndViewModal(state);
      });

    !form.reset();
  });
};

export default (state, i18next) => {
  const watchedState = onChange(state, render('state'));
  const watchedFeedback = onChange(state, render('feedback'));
  const watchedFeeds = onChange(state, render('feeds'));
  const watchedPosts = onChange(state, render('posts'));

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input[id="url-input"]');

  input.addEventListener('input', (event) => {
    state.currentUrl.inputUrl = event.target.value.trim();
  });

  handleButtonAddClick(state, i18next, form, watchedState, watchedFeedback, watchedFeeds, watchedPosts);
  updateRss(state, i18next, watchedPosts, handleLinksAndViewModal);
};

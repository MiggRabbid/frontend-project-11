import onChange from 'on-change';

const renderState = (input, button, value) => {
  if (value === 'filling') {
    button.disabled = false;
    input.disabled = false;
    input.value = '';
    input.focus();
  }
  if (value === 'processing') {
    const oldFeedback = document.querySelector('.feedback');
    if (oldFeedback) oldFeedback.remove();
    button.disabled = true;
    input.disabled = true;
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
  }
  if (value === 'processed') {
    input.classList.add('is-valid');
  }
  if (value === 'failed') {
    input.classList.add('is-invalid');
  }
};

const renderFeedback = (state, i18next, rssForm, value) => {
  const oldFeedback = rssForm.parentElement.querySelector('.feedback');
  if (oldFeedback) oldFeedback.remove();
  const newFeedback = document.createElement('p');
  newFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  let newTextContent;
  if (value === 'waiting') {
    newTextContent = i18next.t('feedback.uploadingRss');
    newFeedback.classList.add('text-white-50');
  }
  if (value === true) {
    newTextContent = i18next.t('feedback.uploadedRss');
    newFeedback.classList.add('text-success');
  }
  if (value === false) {
    const errorMessage = state.formState.errors.at(-1);
    newTextContent = i18next.t(errorMessage);
    newFeedback.classList.add('text-danger');
  }
  newFeedback.textContent = newTextContent;
  rssForm.parentElement.append(newFeedback);
};

const renderFeeds = (feeds, value) => {
  let card;
  if (feeds.querySelector('.card')) {
    card = feeds.querySelector('.card');
  } else {
    card = document.createElement('div');
    card.classList.add('card', 'border-0');
    card.innerHTML = `<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>
    <ul class="list-group border-0 rounded-0"></ul>`;
    feeds.append(card);
  }
  const listGroup = feeds.querySelector('.list-group');
  listGroup.innerHTML = '';
  value.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(h3);
    li.append(p);
    listGroup.prepend(li);
  });
};

const renderPosts = (posts, value, prevValue) => {
  let newPosts;
  if (prevValue === undefined) {
    newPosts = value;
  } else if (prevValue !== undefined) {
    const isObjInPrevValue = (newPost) => prevValue.some((prevPost) => prevPost.id === newPost.id);
    newPosts = value.filter((newPost) => !isObjInPrevValue(newPost));
  }
  let card;
  if (posts.querySelector('.card')) {
    card = posts.querySelector('.card');
  } else {
    card = document.createElement('div');
    card.classList.add('card', 'border-0');
    card.innerHTML = `<div class="card-body"><h2 class="card-title h4">Посты</h2></div>
<ul class="list-group border-0 rounded-0"></ul>`;
    posts.append(card);
  }
  const listGroup = posts.querySelector('.list-group');
  newPosts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = document.createElement('a');
    link.href = post.link;
    link.classList.add('fw-bold');
    link.setAttribute('data-id', post.id);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = post.title;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
    li.append(link);
    li.append(button);
    listGroup.prepend(li);
  });
};

const renderViewedLink = (value, prevValue) => {
  const findNewId = () => Array.from(new Set([...value].filter((item) => !prevValue.has(item))))[0];
  const newId = findNewId();
  const link = document.querySelector(`a[data-id="${newId}"]`);
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'link-secondary');
};

const renderModal = (modal, value) => {
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const read = modal.querySelector('.modal-footer').querySelector('a');
  modalTitle.textContent = value.title;
  modalBody.textContent = value.description;
  read.href = value.link;
};

const render = (state, i18next, elements) => (path, value, prevValue) => {
  const {
    rssForm, button, input, modal, feeds, posts,
  } = elements;
  switch (path) {
    case 'state':
      renderState(input, button, value);
      break;
    case 'formState.isValid':
      renderFeedback(state, i18next, rssForm, value);
      break;
    case 'data.feeds':
      renderFeeds(feeds, value);
      break;
    case 'data.posts':
      renderPosts(posts, value, prevValue);
      break;
    case 'uiState.viewedPostsId':
      renderViewedLink(value, prevValue);
      break;
    case 'uiState.vievedPost':
      renderModal(modal, value);
      break;
    default:
      break;
  }
};

export default (state, i18next, elements) => onChange(state, render(state, i18next, elements));

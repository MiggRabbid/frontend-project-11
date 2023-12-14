const renderState = (input, path, value) => {
  const button = document.querySelector('button[aria-label="add"]');

  if (value === 'filling') {
    button.disabled = false;
    input.disabled = false;
    input.value = '';
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

const renderFeedback = (rssForm, path, value) => {
  const newFeedback = document.createElement('p');
  newFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  let newTextContent;

  const oldFeedback = rssForm.parentElement.querySelector('.feedback');
  if (oldFeedback) oldFeedback.remove();

  if (path === 'currentUrl.feedback' && value !== null) {
    newFeedback.classList.add('text-success');
    newTextContent = value.at(-1).feedback;
  }
  if (path === 'currentUrl.error' && value !== null) {
    newFeedback.classList.add('text-danger');
    newTextContent = value.at(-1).error;
  }

  newFeedback.textContent = newTextContent;
  rssForm.parentElement.append(newFeedback);
};

const renderFeeds = (path, value) => {
  const feeds = document.querySelector('.feeds');
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
    li.innerHTML = `<h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p>`;
    listGroup.prepend(li);
  });
};

const renderPosts = (path, value, prevValue) => {
  let newPosts;

  if (prevValue === undefined) {
    newPosts = value;
  } else if (prevValue !== undefined) {
    const isObjInPrevValue = (newPost) => prevValue.some((prevPost) => prevPost.id === newPost.id);
    newPosts = value.filter((newPost) => !isObjInPrevValue(newPost));
  }

  const posts = document.querySelector('.posts');
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

    const link = `<a href="${post.link}" class="fw-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>`;

    li.innerHTML = ` ${link}
<button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;

    listGroup.prepend(li);
  });
};

const renderLinkAndModal = (path, value) => {
  const link = document.querySelector(`a[data-id="${value.id}"]`);
  const modal = document.querySelector('div[id="modal"]');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const read = modal.querySelector('.modal-footer').querySelector('a');

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'link-secondary');
  modalTitle.textContent = value.title;
  modalBody.textContent = value.description;
  read.href = value.link;
};

export default (rssForm, input) => (path, value, previousValue) => {
  if (path === 'state') renderState(input, path, value);
  if (path === 'currentUrl.feedback') renderFeedback(rssForm, path, value);
  if (path === 'currentUrl.error') renderFeedback(rssForm, path, value);
  if (path === 'data.feeds') renderFeeds(path, value);
  if (path === 'data.posts') renderPosts(path, value, previousValue);
  if (path.match(/^data\.posts\.\d+$/)) renderLinkAndModal(path, value);
};

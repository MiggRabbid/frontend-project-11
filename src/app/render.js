const renderState = (path, value) => {
  const rssForm = document.querySelector('.rss-form');
  const button = document.querySelector('button[aria-label="add"]');

  if (value === 'filling') {
    button.disabled = false;
  }
  if (value === 'processing') {
    const oldFeedback = document.querySelector('.feedback');

    if (oldFeedback) oldFeedback.remove();

    button.disabled = true;

    const input = rssForm.querySelector('input[id="url-input"]');
    input.classList.remove('is-invalid');
  }

  if (value === 'processed') {
    button.disabled = false;
  }

  if (value === 'failed') {
    button.disabled = false;
    const input = rssForm.querySelector('input[id="url-input"]');

    input.classList.add('is-invalid');
  }
};

const renderFeedback = (path, value) => {
  const rssForm = document.querySelector('.rss-form');
  const newFeedback = document.createElement('p');
  const oldFeedback = rssForm.parentElement.querySelector('.feedback');

  if (oldFeedback) oldFeedback.remove();

  if (path === 'currentUrl.feedback') {
    newFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    newFeedback.textContent = value;
  }

  if (path === 'currentUrl.error') {
    newFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    newFeedback.textContent = value;
  }

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

    let link;

    if (post.linkStatus === 'new') {
      link = `<a href="${post.link}" class="fw-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
    } else if (post.linkStatus === 'viewed') {
      link = `<a href="${post.link}" class="fw-normal link-secondary" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
    }

    li.innerHTML = ` ${link}
<button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;

    listGroup.prepend(li);
  });
};

const renderLinkAndModal = (path, value) => {
  const link = document.querySelector(`a[data-id="${value.id}"]`);

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'link-secondary');

  const modal = document.querySelector('div[id="modal"]');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const read = modal.querySelector('.modal-footer').querySelector('a');

  modalTitle.textContent = value.title;
  modalBody.textContent = value.description;
  read.href = value.link;
};

export default (path, value, previousValue) => {
  if (path === 'state') renderState(path, value);
  if (path === 'currentUrl.feedback') renderFeedback(path, value);
  if (path === 'currentUrl.error') renderFeedback(path, value);
  if (path === 'data.feeds') renderFeeds(path, value);
  if (path === 'data.posts') renderPosts(path, value, previousValue);
  if (path.match(/^data\.posts\.\d+$/)) renderLinkAndModal(path, value);
};

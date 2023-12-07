const renderState = (path, value) => {
  const rssForm = document.querySelector('.rss-form');
  const button = document.querySelector('button[aria-label="add"]');
  if (path === 'state' && value === 'filling') {
    button.disabled = false;
  }
  if (path === 'state' && value === 'processing') {
    const oldFeedback = document.querySelector('.feedback');
    if (oldFeedback) oldFeedback.remove();
    button.disabled = true;
    const input = rssForm.querySelector('input[id="url-input"]');
    input.classList.remove('is-invalid');
  }
  if (path === 'state' && value === 'processed') {
    button.disabled = false;
  }
  if (path === 'state' && value === 'failed') {
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
    console.log(feed)
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p>`;
    listGroup.prepend(li);
    console.log(listGroup)
  });
};

const renderPosts = (path, value) => {
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
  listGroup.innerHTML = '';
  value.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.innerHTML = `<a href="${post.link}" class="fw-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
<button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    listGroup.append(li);
  });
};

export default (renderType) => (path, value) => {
  const render = {
    state: (currentPath, newValue) => renderState(currentPath, newValue),
    feedback: (currentPath, newValue) => renderFeedback(currentPath, newValue),
    feeds: (currentPath, newValue) => renderFeeds(currentPath, newValue),
    posts: (currentPath, newValue) => renderPosts(currentPath, newValue),
  };

  render[renderType](path, value);
};

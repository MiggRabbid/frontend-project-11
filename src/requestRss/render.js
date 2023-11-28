const renderFeedback = (path, value) => {
  const rssForm = document.querySelector('.rss-form');

  const oldFeedback = rssForm.parentElement.querySelector('.feedback');
  if (oldFeedback) oldFeedback.remove();

  const newFeedback = document.createElement('p');

  if (path === 'state' && value === 'processed') {
    newFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    newFeedback.textContent = 'RSS успешно загружен';
  }

  if (path === 'currentUrl.error') {
    newFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    newFeedback.textContent = value;
  }

  rssForm.parentElement.append(newFeedback);
};

const renderRss = () => {
};

export { renderFeedback, renderRss };

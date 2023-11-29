const renderState = (path, value, previousValue) => {
  console.log('------------- run renderState -------------')
  const rssForm = document.querySelector('.rss-form');

  if (path === 'state' && value === 'processing') {
    const input = rssForm.querySelector('input[id="url-input"]')
    input.classList.remove('is-invalid')
  }

  if (path === 'state' && value === 'processed') {
  }

  if (path === 'state' && value === 'failed') {
    const input = rssForm.querySelector('input[id="url-input"]')
    input.classList.add('is-invalid')
  }
}


const renderFeedback = (path, value, previousValue) => {
  console.log('------------- run renderFeedback -------------')
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

const renderRss = (path, value, previousValue) => {
  console.log('------------- run renderRss -------------')
};


export default (renderType) => (path, value, previousValue) => {
  console.log('------------- run default -------------')
  console.log('path          -', path)
  console.log('value         -', value)
  console.log('previousValue -', previousValue)

  const render = {
    state: (currentPath, newvValue, oldValue) => renderState(currentPath, newvValue, oldValue),
    feedback: (currentPath, newvValue, oldValue) => renderFeedback(currentPath, newvValue, oldValue),
    rss: (currentPath, newvValue, oldValue) => renderRss(currentPath, newvValue, oldValue),
  }

  render[renderType](path, value, previousValue)
}
export { renderFeedback, renderRss };
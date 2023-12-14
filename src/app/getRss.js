import axios from 'axios';

const addProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};

const getData = (url, waitingTiming) => axios.get(addProxy(url), { timeout: waitingTiming })
  .catch((error) => { throw error; });

export default getData;

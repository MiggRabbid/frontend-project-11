import * as yup from 'yup';

const urlValidator = (feeds, url) => {
  const schema = yup.string()
    .url()
    .required()
    .notOneOf(feeds.map((feed) => feed.link));
  return schema.validate(url)
    .then(() => true)
    .catch((error) => { throw error; });
};

export default urlValidator;

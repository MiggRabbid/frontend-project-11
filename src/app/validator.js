import * as yup from 'yup';

const urlValidator = (feeds, url) => {
  const schema = yup.string()
    .url()
    .required()
    .test({
      name: 'uniqueUrl',
      message: 'not unique url',
      test(value) {
        return !feeds.some((feed) => value.includes(feed.link));
      },
    });

  return schema.validate(url)
    .then(() => true)
    .catch((error) => { throw error; });
};

export default urlValidator;

import * as yup from 'yup';

export default (rssUrls, url) => {
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .test({
      name: 'unique',
      message: 'RSS уже существует',
      test(value) {
        return !rssUrls.some((rss) => rss.url === value);
      },
    });

  return schema.validate(url)
    .then(() => true)
    .catch((error) => { throw error; });
};

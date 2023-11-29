import * as yup from 'yup';

const setYupLocale = (lng, i18next) => {
  yup.setLocale({
    mixed: {
      default: i18next.t('errors.incorrectUrl'),
    },
    string: {
      url: i18next.t('errors.incorrectUrl'),
      matches: i18next.t('errors.incorrectRss'),
    },
  });
};

export default (rssUrls, url, i18next) => {
  const currentLanguage = i18next.language;
  setYupLocale(currentLanguage, i18next);

  const schema = yup.string()
    .url()
    .test({
      name: 'unique',
      message: i18next.t('errors.existsUrl'),
      test(value) {
        return !rssUrls.some((rss) => rss.url === value);
      },
    });

  return schema.validate(url)
    .then(() => true)
    .catch((error) => { throw error });
};

import * as yup from 'yup';

const setYupLocale = (lng, i18next) => {
  yup.setLocale({
    mixed: {
      default: i18next.t('errors.incorrectUrl'),
    },
    string: {
      url: i18next.t('errors.incorrectUrl'),
    },
  });
};

const urlValidator = (feeds, url, i18next) => {
  const currentLanguage = i18next.language;

  setYupLocale(currentLanguage, i18next);

  const schema = yup.string()
    .url()
    .test({
      name: 'unique',
      message: i18next.t('errors.existsUrl'),
      test(value) {
        return !feeds.some((feed) => value.includes(feed.link));
      },
    });

  return schema.validate(url)
    .then(() => true)
    .catch((error) => { throw error });
};

export default urlValidator;
import * as yup from 'yup';

const setYupLocale = (i18next) => {
  yup.setLocale({
    mixed: {
      required: i18next.t('errors.emptyUrl'),
    },
    string: {
      url: i18next.t('errors.incorrectUrl'),
      test: i18next.t('errors.existsUrl'),
    },
  });
};

export default setYupLocale;

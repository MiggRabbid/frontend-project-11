import * as yup from 'yup';

const setYupLocale = () => {
  yup.setLocale({
    mixed: {
      required: 'errors.emptyUrl',
      notOneOf: 'errors.existsUrl',
    },
    string: {
      url: 'errors.incorrectUrl',
    },
  });
};

export default setYupLocale;

// import { boot } from 'quasar/wrappers';
// import { createI18n } from 'vue-i18n/index';
// import messages from 'src/i18n';
//
// const i18n = createI18n({
//   locale: 'en-US',
//   fallbackLocale: 'en',
//   messages,
// });
//
// export default boot(({ app }) => {
//   // Set i18n instance on app
//   app.use(i18n);
// });
//
// export { i18n };

import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US',
    globalInjection: true,
    legacy: false,
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});

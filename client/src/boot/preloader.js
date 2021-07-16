import { boot } from 'quasar/wrappers';
import Preloader from 'components/Preloader';

export default boot(({ app }) => {
  app.component('preloader', Preloader);
});

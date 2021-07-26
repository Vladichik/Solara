import { boot } from 'quasar/wrappers';
import PlaceholderPanel from 'components/PlaceholderPanel';

export default boot(({ app }) => {
  app.component('placeholder', PlaceholderPanel);
});

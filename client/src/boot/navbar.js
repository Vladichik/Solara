import { boot } from 'quasar/wrappers';
import NavBar from 'components/NavBar';

export default boot(({ app }) => {
  app.component('navbar', NavBar);
});

import { boot } from 'quasar/wrappers';
import eventBus from 'vue3-eventbus';

export default boot(({ app }) => {
  app.use(eventBus);
});

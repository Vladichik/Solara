<template>
  <q-dialog
    v-model="show"
    class="bg-primary"
    persistent
    :maximized="true"
    transition-show="fade-in"
    transition-hide="fade-out"
  >
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'SplashScreen',
  setup() {
    const show = ref(true);

    const closeSplash = () => {
      setTimeout(() => {
        show.value = false;
      }, 1000);
    };

    onMounted(closeSplash);
    return {
      show,
    };
  },
});
</script>

<style scoped>

</style>

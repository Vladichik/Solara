<template>
  <q-dialog
    v-model="show"
    class="bg-white sol-splash-screen"
    persistent
    :maximized="true"
    transition-show="fade-in"
    transition-hide="fade-out"
  >
    <solara-logo width="300" />
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import SolaraLogo from 'components/icons/SolaraLogo';

export default defineComponent({
  name: 'SplashScreen',
  components: {
    SolaraLogo,
  },
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

<style lang="scss">
.sol-splash-screen {
  .q-dialog__backdrop {
    background: transparent;
  }
}
</style>

<template>
  Favorites
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  watch,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Favorites',
  setup() {
    const store = useStore();
    const myOrviboDevices = computed(() => store.state.Devices.myOrviboDevices);

    // const groupListsByEnvironments = () => {
    //   if (myDevicesOrvibo.value && myDevicesOrvibo.value.length && myDevices.value && myDevices.value.length) {
    //
    //   }
    // };

    watch(myOrviboDevices, () => {
      console.log(myOrviboDevices.value);
    });
  },
});
</script>

<style scoped>

</style>

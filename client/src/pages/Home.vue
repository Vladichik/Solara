<template>
  <q-tab-panels v-model="panel" animated>
    <q-tab-panel name="list" class="q-pa-none">
      <environments-list :enter-device="enterDevice" />
    </q-tab-panel>
    <q-tab-panel name="device" class="q-pa-none">
      {{selectedDevice}}
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import EnvironmentsList from 'components/home/EnvironmentsList';

export default defineComponent({
  name: 'Home',
  components: {
    EnvironmentsList,
  },
  setup() {
    const store = useStore();
    const panel = ref('list');
    const selectedDevice = reactive({});

    const enterDevice = (device) => {
      Object.assign(selectedDevice, device);
      panel.value = 'device';
    };
    return {
      panel,
      selectedDevice,
      enterDevice,
    };
  },
});
</script>

<style scoped>

</style>

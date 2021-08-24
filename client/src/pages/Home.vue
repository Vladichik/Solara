<template>
  <q-tab-panels v-model="panel" animated>
    <q-tab-panel name="list" class="q-pa-none">
      <environments-list :enter-device="enterDevice" />
    </q-tab-panel>
    <q-tab-panel name="device" class="q-pa-none">
      <device-control-panel :device="selectedDevice" :go-home="goHome" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import EnvironmentsList from 'components/home/EnvironmentsList';
import DeviceControlPanel from 'components/home/DeviceControlPanel';

export default defineComponent({
  name: 'Home',
  components: {
    EnvironmentsList,
    DeviceControlPanel,
  },
  setup() {
    const store = useStore();
    const panel = ref('list');
    const selectedDevice = reactive({});

    const enterDevice = (device) => {
      Object.assign(selectedDevice, device);
      panel.value = 'device';
    };

    const goHome = () => {
      panel.value = 'list';
      Object.assign(selectedDevice, {});
    };

    return {
      panel,
      selectedDevice,
      enterDevice,
      goHome,
    };
  },
});
</script>

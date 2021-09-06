<template>
  <q-tab-panels v-model="panel" animated>
    <q-tab-panel name="list" class="q-pa-none">
      <a :href="getOrviboAuthUrl()">authenticate</a>
<!--      <q-btn @click="operateDevice('TurnOn')">OPEN</q-btn>-->
<!--      <q-btn @click="operateDevice('TurnOff')">CLOSE</q-btn>-->
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
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';

export default defineComponent({
  name: 'Home',
  components: {
    EnvironmentsList,
    DeviceControlPanel,
  },
  setup() {
    const { getOrviboAuthUrl } = DataGettersCompositions();
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
      getOrviboAuthUrl,
    };
  },
});
</script>

<template>
  <q-tab-panels v-model="panel" animated>
    <q-tab-panel name="list" class="q-pa-none">
      <PleaseCreateDeviceMessage v-if='!myDevices.length' />
      <a :href="getOrviboAuthUrl()"
         class="sol-orvibo-auth-btn"
         id="orvibo-auth-btn" />
      <environments-list :enter-device="enterDevice" />
    </q-tab-panel>
    <q-tab-panel name="device" class="q-pa-none">
      <device-control-panel :device="selectedDevice" :go-home="goHome" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import {
  defineComponent, ref, reactive, computed,
} from 'vue';
import { useStore } from 'vuex';
import EnvironmentsList from 'components/home/EnvironmentsList';
import DeviceControlPanel from 'components/home/DeviceControlPanel';
import PleaseCreateDeviceMessage from 'components/home/PleaseCreateDeviceMessage';
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';
import bus from 'vue3-eventbus';

export default defineComponent({
  name: 'Home',
  components: {
    EnvironmentsList,
    DeviceControlPanel,
    PleaseCreateDeviceMessage,
  },
  setup() {
    const store = useStore();
    const { getOrviboAuthUrl } = DataGettersCompositions();
    const panel = ref('list');
    const selectedDevice = reactive({});
    const myDevices = computed(() => store.state.Devices.myDevices);

    const enterDevice = (device) => {
      Object.assign(selectedDevice, device);
      panel.value = 'device';
    };

    const goHome = () => {
      panel.value = 'list';
      Object.assign(selectedDevice, {});
    };

    bus.on('closeNav', () => {
      goHome();
    });

    return {
      myDevices,
      panel,
      selectedDevice,
      enterDevice,
      goHome,
      getOrviboAuthUrl,
    };
  },
});
</script>

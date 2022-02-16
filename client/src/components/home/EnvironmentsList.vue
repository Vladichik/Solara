<template>
  <q-expansion-item
    v-for="group in groupedDevices"
    :key="group.uid"
    expand-separator
    class="bg-primary sol-white-arrow"
    header-class="text-white sol-expansion-head"
    :label="group.deviceName"
  >
    <q-list separator>
      <q-item clickable
              v-ripple
              class="q-pt-lg q-pb-lg bg-white"
              v-for="device in group.devices"
              :key="device.id" @click="enterDevice(device)">
        <q-item-section>
          <q-item-label>{{ $t(device.assembly_type) }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="grey-5" name="arrow_forward_ios" size="xs" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
} from 'vue';
import { useStore } from 'vuex';
import OrviboAndSolaraDevicesCombiner from 'src/mixins/OrviboAndSolaraDevicesCombiner';

export default defineComponent({
  name: 'EnvironmentsList',
  props: ['enterDevice'],
  setup() {
    const { generateEnvironments } = OrviboAndSolaraDevicesCombiner();
    const store = useStore();
    const myDevices = computed(() => store.state.Devices.myDevices);
    const groupedDevices = reactive([]);
    const noDevicesYet = computed(() => store.state.Devices.noDevicesYet);

    /**
     * Function that groups environments
     * and populates environments with devices from Solara database
     * Vlad. 24/08/21
     */
    const groupListsByEnvironments = () => {
      const environments = generateEnvironments();
      Object.assign(groupedDevices, environments);
    };

    onBeforeMount(() => {
      groupListsByEnvironments();
    });

    return {
      noDevicesYet,
      myDevices,
      groupedDevices,
      groupListsByEnvironments,
    };
  },
  watch: {
    myDevices(dev) {
      this.groupListsByEnvironments(dev);
    },
    noDevicesYet(noDevicesAdded) {
      if (noDevicesAdded) {
        this.$router.push('/products-info');
      }
    },
  },
});
</script>

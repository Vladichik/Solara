<template>
  <q-select :model-value="selectedDevice"
            v-model="selectedDevice"
            map-options
            filled
            option-label="device_name"
            :label="$t('select_device')"
            :options="pickerOptions"
            v-if="!noAvailableDevices"
            @update:model-value="$emit('on-device-selected', selectedDevice)" />
  <q-banner rounded v-if="noAvailableDevices" class="bg-yellow-11">
    You have added details to all existing devices.
  </q-banner>
</template>

<script>
import {
  computed, defineComponent, ref, onBeforeMount, reactive,
} from 'vue';
import { useStore } from 'vuex';
import { Constants } from 'src/config/constants';

export default defineComponent({
  name: 'DevicePickerForDetails',
  setup() {
    const store = useStore();
    const selectedDevice = ref('');
    const noAvailableDevices = ref(false);

    const pickerOptions = reactive([]);
    const myDevices = computed(() => store.state.Devices.myDevices);
    const myOrviboDevices = computed(() => store.state.Devices.myOrviboDevices);

    const preparePickerData = () => {
      if (myOrviboDevices.value && myOrviboDevices.value.length) {
        const options = [];
        const groups = [];
        noAvailableDevices.value = false;
        const cloned = JSON.parse(JSON.stringify(myOrviboDevices.value));
        const filtered = cloned.filter((device) => !device.deviceTypeName.includes(Constants.HUB_MARK)
          && !myDevices.value.some((d) => d.orvibo_ids.includes(device.deviceId)));

        // Determining how many unique groups/hubs user has
        filtered.forEach((d) => {
          if (!groups.includes(d.uid)) {
            groups.push(d.uid);
          }
        });

        if (groups.length) {
          groups.forEach((g) => {
            const hub = cloned.find((dev) => dev.uid === g && dev.deviceTypeName.includes(Constants.HUB_MARK));
            options.push({
              device_name: `Patio - ${hub.deviceName}`,
              hub_id: hub.deviceId,
              assembly_type: 'patio',
              device_ids: filtered.filter((d) => d.uid === g && d.deviceTypeName === Constants.MOTOR_MARK).map((dev) => dev.deviceId),
            });
          });
        }
        // && !myDevices.value.some((d) => d.orvibo_id === device.deviceId));
        Object.assign(pickerOptions, options);
        if (!filtered.length) {
          noAvailableDevices.value = true;
        }
      }
    };

    onBeforeMount(() => {
      preparePickerData();
    });

    return {
      noAvailableDevices,
      selectedDevice,
      pickerOptions,
    };
  },
});
</script>

<style scoped>

</style>

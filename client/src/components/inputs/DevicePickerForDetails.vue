<template>
  <q-select :model-value="selectedDevice"
            v-model="selectedDevice"
            map-options
            emit-value
            filled
            option-value="deviceId"
            option-label="deviceName"
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
        noAvailableDevices.value = false;
        const cloned = JSON.parse(JSON.stringify(myOrviboDevices.value));
        const filtered = cloned.filter((device) => !device.deviceTypeName.includes('allone_pro')
        && !myDevices.value.some((d) => d.orvibo_id === device.deviceId));
        Object.assign(pickerOptions, filtered);
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

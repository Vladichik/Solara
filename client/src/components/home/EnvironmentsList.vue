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
              :key="device.id" @click="enterDevice(group)">
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

export default defineComponent({
  name: 'EnvironmentsList',
  props: ['enterDevice'],
  setup() {
    const store = useStore();
    const myDevicesOrvibo = computed(() => store.state.Devices.myOrviboDevices);
    const myDevices = computed(() => store.state.Devices.myDevices);
    const groupedDevices = reactive([]);

    /**
     * Function that groups environments
     * and populates environments with devices from Solara database
     * Vlad. 24/08/21
     */
    const groupListsByEnvironments = () => {
      if (myDevicesOrvibo.value && myDevicesOrvibo.value.length && myDevices.value && myDevices.value.length) {
        const cloned = JSON.parse(JSON.stringify(myDevicesOrvibo.value));
        const clonedMyDevices = JSON.parse(JSON.stringify(myDevices.value));

        const hubsOnly = cloned.filter((device) => device.deviceTypeName.includes('allone_pro'));
        const orviboRegisteredDevices = cloned.map((d) => d.deviceId);
        myDevicesOrvibo.value.forEach((device) => {
          if (device.subDeviceType.includes('allone_pro')) {
            const foundGroup = hubsOnly.find((g) => g.uid === device.uid);
            if (foundGroup) {
              foundGroup.devices = clonedMyDevices.filter((md) => md.hub_id === foundGroup.deviceId
              && md.orvibo_ids.some((oid) => orviboRegisteredDevices.includes(oid)));
            }
          }
        });
        Object.assign(groupedDevices, hubsOnly);
      }
    };

    onBeforeMount(() => {
      groupListsByEnvironments();
    });

    return {
      myDevices,
      groupedDevices,
      groupListsByEnvironments,
    };
  },
  watch: {
    myDevices(dev) {
      this.groupListsByEnvironments(dev);
    },
  },
});
</script>

<style scoped>

</style>

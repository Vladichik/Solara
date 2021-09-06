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
              :key="device.id" @click="enterDevice(device)" >
        <q-item-section>
          <q-item-label>{{ device.deviceName }}</q-item-label>
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
  defineComponent,
  computed,
  reactive,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'EnvironmentsList',
  props: ['enterDevice'],
  setup() {
    const store = useStore();
    const myDevices = computed(() => store.state.Devices.myOrviboDevices);
    const groupedDevices = reactive([]);

    /**
     * Function that groups devices by environments
     * Vlad. 24/08/21
     */
    const groupListsByEnvironments = () => {
      if (myDevices.value && myDevices.value.length) {
        const cloned = JSON.parse(JSON.stringify(myDevices.value));
        const onlyAllOnes = cloned.filter((device) => device.deviceTypeName.includes('allone_pro'));
        myDevices.value.forEach((device) => {
          if (!device.subDeviceType.includes('allone_pro')) {
            const foundGroup = onlyAllOnes.find((g) => g.uid === device.uid);
            if (foundGroup) {
              if (!foundGroup.devices) {
                foundGroup.devices = [];
              }
              foundGroup.devices.push(device);
            }
          }
        });
        Object.assign(groupedDevices, onlyAllOnes);
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

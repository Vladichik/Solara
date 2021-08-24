<template>
  <q-expansion-item
    v-for="group in groupedDevices"
    :key="group.name"
    expand-separator
    class="bg-primary sol-white-arrow"
    header-class="text-white sol-expansion-head"
    :label="group.name"
  >
    <q-list separator>
      <q-item clickable
              v-ripple
              class="q-pt-lg q-pb-lg bg-white"
              v-for="device in group.devices"
              :key="device.id" @click="enterDevice(device)" >
        <q-item-section>
          <q-item-label>{{ device.device_name }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="grey-5" name="arrow_forward_ios" size="xs" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script>
import { computed, reactive, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'EnvironmentsList',
  props: ['enterDevice'],
  setup() {
    const store = useStore();
    const myDevices = computed(() => store.state.Devices.myDevices);
    const groupedDevices = reactive([]);

    /**
     * Function that groups devices by environments
     * Vlad. 24/08/21
     */
    const groupListsByEnvironments = () => {
      if (myDevices.value && myDevices.value.length) {
        myDevices.value.forEach((device) => {
          const foundGroup = groupedDevices.find((g) => g.name === device.location_name);
          if (foundGroup) {
            foundGroup.devices.push(device);
          } else {
            const newGroup = {
              name: device.location_name,
              devices: [device],
            };
            groupedDevices.push(newGroup);
          }
        });
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
};
</script>

<style scoped>

</style>

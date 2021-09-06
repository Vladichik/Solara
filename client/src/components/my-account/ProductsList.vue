<template>
  <navbar :title="$tm('nav_bar.product_info')"
          :btn-label="$tm('nav_bar.my_account')"
          to="/my-account" />
  <div class="q-mb-md sol-new-device-btn-frame">
    <q-btn outline
           color="primary"
           :label="$t('add_device_det')"
           size="18px"
           @click="$refs.createDeviceDialog.showDialog = true" />
  </div>
  <div class="sol-devices-list-frame">
    <placeholder v-if="!myDevices || !myDevices.length" :text="$tm('placeholder.no_devices')" />
    <q-list separator v-if="myDevices && myDevices.length">
      <q-item clickable
              v-ripple
              class="q-pt-lg q-pb-lg"
              v-for="device in myDevices"
              :key="device.id"
              @click="viewDevice(device)">
        <q-item-section>
          <q-item-label>{{ getDeviceName(device.orvibo_id) }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="grey-5" name="arrow_forward_ios" size="xs" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <create-device-dialog ref="createDeviceDialog" />
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import CreateDeviceDialog from 'components/dialogs/CreateDeviceDialog';
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';

export default defineComponent({
  name: 'ProductsList',
  props: ['viewDevice'],
  components: { CreateDeviceDialog },
  setup() {
    const { getDeviceName } = DataGettersCompositions();
    const store = useStore();
    const myDevices = computed(() => store.state.Devices.myDevices);
    return {
      myDevices,
      getDeviceName,
    };
  },
});
</script>

<style lang="scss">
.sol-devices-list-frame {
  position: relative;
  min-height: 250px;
}

.sol-new-device-btn-frame {
  display: flex;
  justify-content: center;
}
</style>

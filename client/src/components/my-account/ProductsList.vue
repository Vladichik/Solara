<template>
  <q-btn outline
         class="full-width q-pa-none"
         color="primary"
         :label="$t('add_device')"
         size="18px"
         @click="$refs.createDeviceDialog.showDialog = true" />
  <div class="sol-devices-list-frame">
    <placeholder v-if="!devices || !devices.length" :text="$tm('placeholder.no_devices')" />
    <q-list separator v-if="devices && devices.length">
      <q-item>
        <q-btn flat @click="viewDevice" label="asdad" />
      </q-item>
    </q-list>
  </div>
  <create-device-dialog ref="createDeviceDialog" />
</template>

<script>
import { defineComponent } from 'vue';
import CreateDeviceDialog from 'components/dialogs/CreateDeviceDialog';

export default defineComponent({
  name: 'ProductsList',
  props: ['viewDevice'],
  components: { CreateDeviceDialog },
  data() {
    return {
      devices: null,
    };
  },
});
</script>

<style lang="scss">
.sol-devices-list-frame {
  position: relative;
  min-height: 250px;
}
</style>

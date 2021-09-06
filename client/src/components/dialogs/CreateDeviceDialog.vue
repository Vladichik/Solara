<template>
  <q-dialog persistent v-model="showDialog" @before-hide="resetForm()">
    <q-card class="sol-dialog-default overflow-hidden sol-add-device-dlg">
      <div class="text-h6">{{ $tm('add_device_det') }}</div>
      <q-form ref="newDeviceForm" class="sol-dialog-content sol-form-grid" @submit="createDevice()">
        <device-picker-for-details
          :model="deviceData"
          @on-device-selected="(deviceId) => deviceData.orvibo_id = deviceId" />
      </q-form>
      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated
               color="primary"
               @click="$refs.newDeviceForm.submit()">
          {{ $t('add') }}
        </q-btn>
      </div>
      <preloader v-if="processing" />
    </q-card>
  </q-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
} from 'vue';

import { useStore } from 'vuex';
import DevicesAPI from 'src/api/device';
import DevicePickerForDetails from 'components/inputs/DevicePickerForDetails';
import NotificationsMixins from 'src/mixins/NotificationsMixins';

export default defineComponent({
  name: 'CreateDeviceDialog',
  mixins: [NotificationsMixins],
  components: { DevicePickerForDetails },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const showDialog = ref(false);
    const processing = ref(false);

    const deviceData = reactive({
      user_id: null,
      orvibo_id: null,
    });

    const resetForm = () => {
      deviceData.orvibo_id = null;
      deviceData.user_id = null;
    };
    return {
      showDialog,
      deviceData,
      processing,
      user,
      resetForm,
    };
  },
  methods: {
    /**
     * Function that saves new or edited device data in database
     * Vlad. 27/07/21
     */
    async createDevice() {
      if (this.user && this.user.id) {
        this.processing = true;
        this.deviceData.user_id = this.user.id;
        const device = await DevicesAPI.createDevice(this.deviceData);
        this.processing = false;
        if (device && device.data.id) {
          await this.$store.dispatch('Devices/getMyDevices');
          this.showDialog = false;
          this.showInfoNotification(this.$tm('notifications.device_created'), 2000);
        } else {
          this.showWarningNotification(this.$tm('notifications.device_creation_fail'), 2000);
        }
      }
    },
  },
});
</script>

<style lang="scss">
.sol-add-device-dlg {
  width: 500px;
}
</style>

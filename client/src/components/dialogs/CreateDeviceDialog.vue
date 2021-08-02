<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden sol-add-device-dlg">
      <div class="text-h6">{{ $tm('add_device') }}</div>

      <q-form ref="deviceForm">

      </q-form>

      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated color="primary" @click="$refs.deviceForm.submit()">{{ $t('add') }}</q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'CreateDeviceDialog',
  setup() {
    const showDialog = ref(false);
    const formData = reactive({
      technician_name: null,
      technician_company: null,
      installation_date: null,
      device_image_url: null,
      address: null,
    });
    /**
     * Function that saves new or edited device data in database
     * Vlad. 27/07/21
     */
    const saveDevice = () => {
      console.log(formData);
    };
    return {
      showDialog,
      formData,
      saveDevice,
    };
  },
});
</script>

<style lang="scss">
.sol-add-device-dlg {
  width: 500px;
}
</style>

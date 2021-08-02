<template>
  <q-dialog persistent v-model="showDialog">
    <q-card class="sol-dialog-default overflow-hidden sol-add-device-dlg">
      <div class="text-h6">{{ $tm('add_device') }}</div>
      <q-form ref="newDeviceForm" class="sol-dialog-content sol-form-grid" @submit="createDevice()">
        <q-input filled
                 :label="$t('location_name')"
                 :hint="$t('location_ph')"
                 v-model="formData.location_name"
                 :model-value="formData.location_name"
                 :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
        <q-input filled
                 :label="$t('device_name')"
                 v-model="formData.device_name"
                 :model-value="formData.device_name"
                 :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
      </q-form>
      <div class="sol-dialog-footer">
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated
               color="primary"
               @click="$refs.newDeviceForm.submit()">
          {{ $t('add') }}
        </q-btn>
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
      location_name: null,
      device_name: null,
    });
    return {
      showDialog,
      formData,
    };
  },
  methods: {
    /**
     * Function that saves new or edited device data in database
     * Vlad. 27/07/21
     */
    async createDevice() {
      console.log(this.formData);
    },
  },
});
</script>

<style lang="scss">
.sol-add-device-dlg {
  width: 500px;
}
</style>

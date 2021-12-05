<template>
  <q-dialog persistent v-model='showDialog'>
    <q-card class='sol-dialog-default overflow-hidden sol-unlock-dlg'>
      <!--      <div class="text-h6">{{ $tm('confirm_logout') }}</div>-->
      <span class='q-pa-lg text-center sol-unlock-text'>{{ getMessage() }}</span>
      <div class='sol-dialog-footer'>
        <q-btn unelevated v-close-popup :label="$t('cancel')" />
        <q-btn unelevated color='primary' @click='unlockAndProceed()'>
          {{ $t('i_am_sure') }}
        </q-btn>
      </div>
      <preloader v-if='showLoader' />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import Preloader from 'components/Preloader';
import DevicesAPI from 'src/api/device';

export default defineComponent({
  name: 'ConfirmLogout',
  components: { Preloader },
  props: ['device', 'lockType', 'unlock'],
  setup(props) {
    const store = useStore();
    const { t } = useI18n();
    const showDialog = ref(false);
    const showLoader = ref(false);
    const lockTypes = {
      lock_snow: 'Snow',
      lock_rain: 'Rain',
      lock_wind: 'Wind',
    };

    const getMessage = () => t('device_locked').replace('$value$', lockTypes[props.lockType]);

    const unlockAndProceed = async () => {
      showLoader.value = true;
      const deviceUpdateFields = {
        id: props.device.id,
        lock_snow: null,
        lock_rain: null,
        lock_wind: null,
      };
      await DevicesAPI.updateDevice(deviceUpdateFields);
      await store.dispatch('Devices/getMyDevices');
      showLoader.value = true;
      window.location.reload();
    };

    return {
      showDialog,
      showLoader,
      getMessage,
      unlockAndProceed,
    };
  },
});
</script>

<style lang='scss'>
.sol-unlock-dlg {
  width: 400px;
}

.sol-unlock-text {
  font-size: 16px;
}
</style>

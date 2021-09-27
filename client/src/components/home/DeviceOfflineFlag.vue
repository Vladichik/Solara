<template>
  <div class="sol-device-offline-flag">
    <q-icon name="wifi_off" class="text-primary" style="font-size: 52px;" />
    <span class="text-primary" style="font-size: 17px;">{{$t('device_offline')}}</span>
  </div>
</template>

<script>
export default {
  name: 'DeviceOfflineFlag',
};
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-device-offline-flag {
  margin: 0 0 120px 0;
  width: 100%;
  justify-items: center;
  @include setGridAuto(auto, 10px, "rows");
}
</style>

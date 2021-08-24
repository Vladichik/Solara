<template>
  <section class="sol-device-control-panel">
    <navbar :absolute="true"
            :title="device.device_name"
            :btn-label="$tm('nav_bar.my_account')" :go-back="goHome" />
    <div class="sol-controls-ring-holder">
      <div class="sol-controls-ring shadow-5"></div>
    </div>
  </section>
</template>

<script>
import {
  defineComponent,
  computed,
  reactive,
  onBeforeMount,
} from 'vue';

export default defineComponent({
  name: 'DeviceControlPanel',
  props: ['device', 'goHome'],
});
</script>

<style lang="scss">
@import "src/css/mixins";
.sol-device-control-panel {
  height: calc(100vh - 130px);
  position: relative;
  background: yellow;
  @include setGrid(null, null, 1fr 200px, null, "rows");
}

.sol-controls-ring-holder {
  position: fixed;
  height: 500px;
  width: 100%;
  bottom: -250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sol-controls-ring {
  width: 100%;
  height: 100%;
  max-width: 500px;
  background: white;
  margin: 0 10px;
  border-radius: 50%;
}
</style>

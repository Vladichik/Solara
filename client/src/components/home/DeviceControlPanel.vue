<template>
  <section class="sol-device-control-panel">
    <navbar :absolute="true"
            :title="getDeviceName(device.deviceId)"
            :btn-label="$tm('nav_bar.my_account')" :go-back="goHome" />
    <div class="sol-controls-ring-holder">
      <div class="sol-controls-ring shadow-5">
        <div class="sol-ring-btn-base q-pl-md q-pr-md">
          <div class="sol-ctr-button-frame">
            <q-btn class="text-blue-grey-3"
                   round color="white"
                   icon="menu"
                   size="md"
                   @click="openDevice(device.deviceId)" />
            <span class="text-blue-grey-3">Open</span>
          </div>
          <div>
            <q-btn round color="primary"
                   icon="pause"
                   size="lg"
                   @click="stopProcess(device.deviceId)" />
          </div>
          <div class="sol-ctr-button-frame">
            <q-btn class="text-blue-grey-3"
                   round color="white"
                   icon="stop"
                   size="md"
                   @click="closeDevice(device.deviceId)" />
            <span class="text-blue-grey-3">Close</span>
          </div>
        </div>
      </div>
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
import DataGettersCompositions from 'src/mixins/DataGettersCompositions';
import DeviceCommander from 'src/mixins/DeviceCommander';
import OrviboAPI from 'src/api/orvibo';

export default defineComponent({
  name: 'DeviceControlPanel',
  props: ['device', 'goHome'],
  setup(props) {
    const { getDeviceName } = DataGettersCompositions();
    const { openDevice, closeDevice, stopProcess } = DeviceCommander();
    onBeforeMount(() => {
      console.log(props.device);
    });
    return {
      getDeviceName,
      openDevice,
      closeDevice,
      stopProcess,
    };
  },
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
  height: 300px;
  width: 100%;
  bottom: -150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sol-controls-ring {
  width: 100%;
  height: 100%;
  max-width: 300px;
  background: white;
  margin: 0 10px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
}

.sol-ring-btn-base {
  width: 100%;
  margin: 0 0 80px 0;
  justify-content: space-around;
  align-items: center;
  @include setGridAuto(auto, null, "columns");
}

.sol-ctr-button-frame {
  justify-items: center;
  @include setGridAuto(auto, 4px, "rows");

  span {
    font-size: 13px;
  }
}
</style>

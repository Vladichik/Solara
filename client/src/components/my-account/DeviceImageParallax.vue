<template>
  <q-parallax
    scroll-target="body"
    :height="400"
    class="q-mb-md"
    src="https://cdn.quasar.dev/img/parallax2.jpg"
  >
    <div class="absolute-top text-subtitle1 text-center sol-device-img-parallax">
      <q-btn flat
             class="absolute-left"
             color="white"
             label="back"
             @click="onBack"
             icon="arrow_back_ios_new" />
      <h6 class="text-white">{{ device.device_name }}</h6>
    </div>
  </q-parallax>
</template>

<script>
export default {
  name: 'DeviceImageParallax',
  props: ['onBack', 'device'],
};
</script>

<style lang="scss">
.sol-device-img-parallax {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>

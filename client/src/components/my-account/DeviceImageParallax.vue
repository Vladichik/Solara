<template>
  <div v-if="!device.image_url" class="sol-image-ph q-mb-md">
    <img :src="placeholder" alt="image placeholder" />
  </div>
  <q-parallax
    v-if="device.image_url"
    scroll-target="body"
    :height="400"
    class="q-mb-md"
    :src="device.image_url"
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
import Icon from 'assets/placeholder.png';

export default {
  name: 'DeviceImageParallax',
  props: ['onBack', 'device'],
  setup() {
    const placeholder = Icon;
    return {
      placeholder,
    };
  },
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

.sol-image-ph {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  img {
    height: 300px;
  }
}
</style>

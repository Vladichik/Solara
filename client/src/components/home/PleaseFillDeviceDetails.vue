<template>
  <section class='sol-fill-device-details-curtain'>
    <div class='sol-fill-device-content text-center'>
      <div>{{$t('must_fill_det')}}</div>
      <router-link :to='`/products-info/${device.id}`'>Go to Product Info</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PleaseFillDeviceDetails',
  props: ['device'],
};
</script>

<style lang='scss'>
.sol-fill-device-details-curtain {
  position: absolute;
  background: white;
  z-index: 220;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  .sol-fill-device-content {
    font-size: 16px;
  }
}
</style>

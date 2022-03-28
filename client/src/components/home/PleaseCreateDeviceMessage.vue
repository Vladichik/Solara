<template>
  <section class='sol-create-device-curtain'>
    <div class='sol-fill-device-content text-center'>
      <div>{{$t('please_create_device')}}</div>
      <router-link :to='`/products-info`'>{{$t('go_to_product')}}</router-link>
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
.sol-create-device-curtain {
  position: fixed;
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

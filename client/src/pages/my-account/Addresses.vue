<template>
  <navbar :title="$tm('nav_bar.address')"
          :btn-label="$tm('nav_bar.my_account')"
          to="/my-account" />
  <manual-address type="billing" :label="$t('bill_address')" />
</template>

<script>
import { defineComponent, reactive } from 'vue';
import ManualAddress from 'components/my-account/ManualAddress';

export default defineComponent({
  name: 'Address',
  components: {
    ManualAddress,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>

</style>

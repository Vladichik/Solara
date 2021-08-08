<template>
  <navbar :title="$tm('nav_bar.address')"
          :btn-label="$tm('nav_bar.my_account')"
          to="/my-account" />
  <billing-address />
</template>

<script>
import { defineComponent, reactive } from 'vue';
import BillingAddress from 'components/my-account/BillingAddress';

export default defineComponent({
  name: 'Address',
  components: {
    BillingAddress,
  },
  setup() {
    const billingAddress = reactive({});
    return {
      billingAddress,
    };
  },
});
</script>

<style scoped>

</style>

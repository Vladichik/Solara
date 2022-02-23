<template>
  <q-card flat>
    <q-card-section class='text-center'>
      <q-btn color='negative' to='/payment-info'>{{ $t('get_pro_account') }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'UpgradeButton',
};
</script>

<style scoped>

</style>

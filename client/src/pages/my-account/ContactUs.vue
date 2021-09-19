<template>
  <navbar :title="$tm('nav_bar.personal_info')"
          :btn-label="$t('nav_bar.my_account')"
          to="/my-account" />
  <section class="sol-contact-us-cont">
    ddd
  </section>
</template>

<script>
export default {
  name: 'ContactUs',
};
</script>

<style lang="scss">
.sol-contact-us-cont {
  margin: 50px 0 0 0;
  display: flex;
  justify-content: center;
}
</style>

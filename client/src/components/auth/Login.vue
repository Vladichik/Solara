<template>
  <q-form class="bg-transparent sol-auth-form-grid">
    <q-input filled :placeholder="$t('email')" />
    <q-input filled bottom-slots :placeholder="$t('pw')" type="password">
      <template v-slot:hint>
        <span @click="">Forgot password</span>
      </template>
    </q-input>
  </q-form>
</template>

<script>
export default {
  name: 'Login',
};
</script>

<style scoped>

</style>

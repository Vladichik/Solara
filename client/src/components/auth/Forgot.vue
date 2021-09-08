<template>
  <q-form @submit="sendForgotPassword()">
    <q-input filled
             :placeholder="$t('email')"
             v-model="userEmail"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    {{userEmail}}
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Forgot',
  setup() {
    const userEmail = ref('');
    const sendForgotPassword = () => {

    };

    return {
      userEmail,
      sendForgotPassword,
    };
  },
});
</script>

<style scoped>

</style>

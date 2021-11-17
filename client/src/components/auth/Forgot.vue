<template>
  <q-form @submit='sendForgotPassword()'>
    <q-input filled
             :placeholder="$t('email')"
             v-model='userEmail'
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
  </q-form>
  <q-btn :label="$t('remind_pw')" color='primary' class='q-mt-sm' @click='sendForgotPassword' />
</template>

<script>
import { defineComponent, ref } from 'vue';
import NotificationsMixins from 'src/mixins/NotificationsMixins';

export default defineComponent({
  name: 'Forgot',
  mixins: [NotificationsMixins],
  data() {
    return {
      userEmail: '',
    };
  },
  methods: {
    sendForgotPassword() {
      if (this.userEmail) {
        this.$store.dispatch('Auth/forgotPassword', { email: this.userEmail })
          .then((sent) => {
            if (sent === 200) {
              this.userEmail = '';
              this.showInfoNotification(this.$tm('notifications.forgot_pw_sent'), 5000, 'green');
            } else if (sent === 204) {
              this.showWarningNotification(this.$tm('notifications.forgot_pw_absent'), 5000);
            }
          });
      }
    },
  },
});
</script>

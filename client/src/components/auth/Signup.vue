<template>
  <q-form class="bg-transparent sol-auth-form-grid sol-login-form" @submit="signup()">
    <q-input filled
             :placeholder="$t('name')"
             v-model="formData.name"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-input filled
             :placeholder="$t('email')"
             v-model="formData.username"
             :rules="[ val => val && val.length > 0 || $t('mandatory_field')]" />
    <q-input filled bottom-slots
             :placeholder="$t('pw')"
             type="password"
             v-model="formData.password"
             model-value=""
             :rules="[ val => val && val.length > 5 || $t('pw_mandatory')]" />
    <q-input filled bottom-slots
             :placeholder="$t('rp_pw')"
             type="password"
             v-model="formData.rep_password"
             model-value=""
             :rules="[ val => val && val.length > 5 && val === formData.password
             || $t('rp_pw_field_warn')]" />
    <div class="sol-terms-block">
      <q-checkbox size="lg"
                  keep-color
                  v-model="formData.checked"
                  :label="$t('i_accept')"
                  color="primary" />
      <router-link
        to="/authenticate"
        class="sol-signup-text text-blue-7 text-bold">{{ $t('terms') }}
      </router-link>
    </div>
    <q-btn class="q-mt-lg" color="primary" :label="$t('signup')" type="submit" />
  </q-form>
</template>

<script>
import { defineComponent } from 'vue';
import AuthAPI from 'src/api/authentication';
import NotificationsMixins from 'src/mixins/NotificationsMixins';

export default defineComponent({
  name: 'Signup',
  props: ['setProcessing'],
  mixins: [NotificationsMixins],
  data() {
    return {
      formData: {
        name: '',
        username: '',
        password: '',
        rep_password: '',
        checked: false,
      },
    };
  },
  methods: {
    async signup() {
      if (this.formData.checked) {
        this.setProcessing(true);
        const onSignup = await AuthAPI.signUp({
          username: this.formData.username,
          password: this.formData.password,
          name: this.formData.name,
        });
        if (onSignup.status === 302) {
          this.showWarningNotification(this.$t('user_exists'));
        } else if (onSignup) {
          await this.$router.push('/');
        }
        this.setProcessing(false);
      } else {
        this.showWarningNotification(this.$t('policy_check'));
      }
    },
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-terms-block {
  align-items: center;
  justify-content: flex-start;
  @include setGridAuto(auto, 5px, "columns");
}
</style>

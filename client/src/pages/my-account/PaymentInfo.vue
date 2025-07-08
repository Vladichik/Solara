<template>
  <section class='q-pa-md sol-card-holder'>
    <q-card class='sol-card-form'>
      <q-card-section>
        <div id='rapyd-checkout'></div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>
import { onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import NotificationsComposition from 'src/mixins/NotificationsComposition';
import { useI18n } from 'vue-i18n';
import UserAPI from 'src/api/user';

export default {
  name: 'PaymentInfo',
  setup() {
    let checkout;
    const apiSrc = {
      sandbox: 'https://sandboxcheckouttoolkit.rapyd.net',
      prod: 'https://checkouttoolkit.rapyd.net',
    };
    const store = useStore();
    const { tm } = useI18n();
    const { showWarningNotification } = NotificationsComposition();
    const user = computed(() => store.state.User.user);

    const initCheckout = () => {
      checkout = new RapydCheckoutToolkit({
        pay_button_text: 'Make Payment',
        pay_button_color: 'red',
        id: 'checkout_8628935ece424d869c6b814b7b8f6f8a',
        close_on_complete: true,
        page_type: 'collection',
        width: 200,
      });
      checkout.displayCheckout();
    };

    const onPaymentPassedSuccessfully = async () => {
      const updatedUser = { ...user.value };
      updatedUser.is_pro = true;
      store.commit('General/setMainLoaderState', true);
      await UserAPI.updateUser(updatedUser);
      await store.dispatch('User/getLoggedInUser');
      store.commit('General/setMainLoaderState', false);
    };

    const onPaymentFailed = () => {
      showWarningNotification(tm('notifications.payment_failed'));
    };

    onMounted(() => {
      // window.addEventListener('onLoading', (event) => {
      //   console.error(event.detail);
      // });
      window.addEventListener('onCheckoutPaymentSuccess', onPaymentPassedSuccessfully);
      window.addEventListener('onCheckoutFailure', onPaymentFailed);

      const paymentScript = document.createElement('script');
      let paymentApi = apiSrc.prod;
      if (window.location.origin.includes('localhost')) {
        paymentApi = apiSrc.sandbox;
      }
      paymentScript.setAttribute('src', paymentApi);
      document.head.appendChild(paymentScript);
      setTimeout(() => {
        initCheckout();
      }, 1000);
    });

    onUnmounted(() => {
      window.removeEventListener('onCheckoutPaymentSuccess', onPaymentPassedSuccessfully);
      window.removeEventListener('onCheckoutFailure', onPaymentFailed);
    });
  },

};
</script>

<style lang='scss'>
.sol-card-holder {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <navbar :title="$tm('nav_bar.personal_info')"
          :btn-label="$t('nav_bar.my_account')"
          to="/my-account" />
  <section class="sol-contact-us-cont">
    <q-card flat v-if="contactData.email">
      <q-card-section class="sol-cont-line">
        <q-icon name="phone" size="md" />
        <a :href="`tel:${contactData.phone}`">{{contactData.phone}}</a>
      </q-card-section>
      <q-card-section class="sol-cont-line">
        <q-icon name="email" size="md" />
        <a :href="`mailto:${contactData.email}`">{{contactData.email}}</a>
      </q-card-section>
    </q-card>
  </section>
</template>

<script>
import { defineComponent, reactive, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import ContactUsAPI from 'src/api/contact-us';

export default defineComponent({
  name: 'ContactUs',
  setup() {
    const store = useStore();
    const contactData = reactive({});

    const getContactDetails = async () => {
      store.commit('General/setMainLoaderState', true);
      const res = await ContactUsAPI.getContactInfo();
      store.commit('General/setMainLoaderState', false);
      if (res.data && res.data.email) {
        Object.assign(contactData, res.data);
      }
    };

    onBeforeMount(() => {
      getContactDetails();
    });

    return {
      contactData,
    };
  },
});
</script>

<style lang="scss">
@import "src/css/mixins";

.sol-contact-us-cont {
  margin: 50px 0 0 0;
  display: flex;
  justify-content: center;
}

.sol-cont-line {
  font-size: 18px;
  align-items: center;
  @include setGrid(auto 1fr, 10px, null, null, "columns");
}
</style>

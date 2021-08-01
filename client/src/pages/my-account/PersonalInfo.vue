<template>
  <navbar :title="$tm('nav_bar.personal_info')"
          :btn-label="$t('nav_bar.my_account')"
          to="/my-account" />
  <q-form class="sol-form-grid q-pb-md q-pr-lg q-pl-lg">
    <q-input square
             filled
             :label="$tm('account_info.first_name')"
             :model-value="personalData.first_name"
             v-model="personalData.first_name" />
    <q-input square
             filled
             :label="$tm('account_info.last_name')"
             :model-value="personalData.last_name"
             v-model="personalData.last_name" />
    <q-input square
             filled
             :label="$tm('account_info.phone_num')"
             :model-value="personalData.phone"
             v-model="personalData.phone" />
    <q-input square
             filled
             :label="$tm('email')"
             :model-value="personalData.email"
             v-model="personalData.email" />
    <q-input square filled :label="$tm('account_info.birthday')"
             :model-value="personalData.birthday"
             v-model="personalData.birthday"
             mask="date">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date default-view="Years"
                    v-model="personalData.birthday"
                    :model-value="personalData.birthday">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-btn size="20px" color="primary" :label="$t('save')" @click="submit" />
  </q-form>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { mapState, useStore } from 'vuex';
import NotificationsMixins from 'src/mixins/NotificationsMixins';

export default {
  mixins: [NotificationsMixins],
  setup() {
    const store = useStore();
    const personalData = reactive({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      birthday: null,
    });

    /**
     * When the view loads form data populates with existing user details
     * Vlad. 01/08/21
     */
    const setPersonalInfoOnLoad = () => {
      const { user } = store.state.User;
      if (user) {
        personalData.first_name = user.first_name;
        personalData.last_name = user.last_name;
        personalData.phone = user.phone;
        personalData.email = user.email;
        personalData.birthday = user.birthday;
      }
    };

    onMounted(() => {
      setPersonalInfoOnLoad();
    });

    return {
      personalData,
      setPersonalInfoOnLoad,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.User.user,
    }),
  },
  methods: {
    /**
     * Function that triggers update of user details
     * @returns {Promise<void>}
     * Vlad. 01/08/21
     */
    async submit() {
      this.$store.commit('General/setMainLoaderState', true);
      const updated = await this.$store.dispatch('User/updateUser', this.personalData);
      if (updated) {
        await this.$store.dispatch('User/getLoggedInUser');
        this.showInfoNotification(this.$t('notifications.data_saved'), 2000);
      }
      this.$store.commit('General/setMainLoaderState', false);
    },
  },
  watch: {
    user() {
      this.setPersonalInfoOnLoad();
    },
  },
};
</script>

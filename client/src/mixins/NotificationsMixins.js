/**
 *
 * Written by vlad on 16/12/2020
 */

export default {
  methods: {
    showInfoNotification(message, timeout, color = 'positive') {
      this.fireNotification(message, color, timeout);
    },
    showWarningNotification(message, timeout) {
      this.fireNotification(message, 'primary', timeout);
    },
    fireNotification(message, color, timeout) {
      this.$q.notify({
        message,
        color,
        timeout,
      });
    },
  },
};

/**
 *
 * Written by vlad on 16/12/2020
 */

import { useQuasar } from 'quasar';

export default function () {
  const $q = useQuasar();

  const fireNotification = (message, color, timeout) => {
    $q.notify({
      message,
      color,
      timeout,
    });
  };

  const showInfoNotification = (message, timeout, color = 'positive') => {
    fireNotification(message, color, timeout);
  };

  const showWarningNotification = (message, timeout) => {
    fireNotification(message, 'negative', timeout);
  };

  return {
    showInfoNotification,
    showWarningNotification,
  };
}

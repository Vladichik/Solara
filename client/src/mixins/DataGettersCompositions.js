// import { ref, computed } from "vue";
import { Constants } from 'src/config/constants';

export default function () {
  /**
   * Function that generates url for authentication in Orvibo Cloud
   * @returns {`https://oauthcn.orvibo.com/oauth/auth?redirect_uri=${string}&client_id=solara&response type=code&state=user`}
   * Vlad. 29/08/21
   */
  const getOrviboAuthUrl = () => {
    const redirectTo = `${window.location.origin}/orvibo-oauth`;
    return `${Constants.ORVIBO_BASE_URL}auth?redirect_uri=${redirectTo}&client_id=${Constants.ORVIBO_CLIENT_ID}&response type=code&state=user`;
  };
  return {
    getOrviboAuthUrl,
  };
}

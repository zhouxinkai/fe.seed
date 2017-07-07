import { State } from './states';

export default {
  setServerError(state: State, error: {}) {
    state.serverErrorDetail = error;
  },

  silentServerError(state: State) {
    state.serverErrorDetail = null;
  }
};


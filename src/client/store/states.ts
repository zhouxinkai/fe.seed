import config from 'client/config';

const state = {
  serverErrorDetail: <null | ServerErrorDetail> null,
  config
};

export type State = typeof state;
export default state;

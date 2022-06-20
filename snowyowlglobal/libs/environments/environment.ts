const SHOUTGAME_PLAY_DOMAIN='https://snowl-srd-server--0--nc11-1.shoutgameplay.com';

export const environment = {
  // production: false,
  // mock: false,
  production: true,
  mock: false,
  srdURL: `${SHOUTGAME_PLAY_DOMAIN}/srd3.json`,
  wdsURL: SHOUTGAME_PLAY_DOMAIN,
  zukiURL: "https://localhost:8443", /*  "https://3.227.21.80:8443"  */
  snowyOwlAppId: 'snowyowl',
  androidFCMSenderId: '520768971782',
  botIconUrl: "assets/img/robot-24.png",
  intervalBetweenQuestions: 3000
};

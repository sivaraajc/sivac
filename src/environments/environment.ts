export const environment = {
  production: false,
  audience: {
    /** CountAPI namespace for global page-view total */
    countApiNamespace: 'sivaraajc-portfolio',
    /** Secret query key: /private/audience?key=YOUR_KEY */
    statsAccessKey: 'sivaraaj-stats',
    /** Optional Google Apps Script / API URL — stores viewers & can email you */
    webhookUrl: '',
    /** Email for webhook notifications & mailto reports */
    notifyEmail: 'csivaraaj@gmail.com',
  },
};

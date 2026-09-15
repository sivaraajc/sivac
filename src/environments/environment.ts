export const environment = {
  production: false,
  audience: {
    /** Global view counter key (countapi.mileshilliard.com — countapi.xyz is offline) */
    viewCounterKey: 'sivaraajc-portfolio-page-views',
    /** Secret query key: /private/audience?key=YOUR_KEY */
    statsAccessKey: 'sivaraaj-stats',
    /**
     * Free email alerts (FormSubmit). First visit may require confirming the link FormSubmit sends you.
     * For cloud log + private-page sync: deploy scripts/portfolio-audience-webhook.gs and paste that URL here.
     */
    webhookUrl: 'https://formsubmit.co/ajax/csivaraaj@gmail.com',
    /** Email for webhook notifications & mailto reports */
    notifyEmail: 'csivaraaj@gmail.com',
  },
};

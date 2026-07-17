import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const fadeUp = trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(24px)' }),
    animate('700ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.94)' }),
    animate('450ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('280ms ease-in', style({ opacity: 0, transform: 'scale(0.96)' })),
  ]),
]);

export const routeFade = trigger('routeFade', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', inset: 0, width: '100%' }), {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [style({ opacity: 1 }), animate('320ms ease', style({ opacity: 0, filter: 'blur(6px)' }))],
        { optional: true },
      ),
      query(
        ':enter',
        [style({ opacity: 0, filter: 'blur(8px)' }), animate('480ms 80ms ease', style({ opacity: 1, filter: 'blur(0)' }))],
        { optional: true },
      ),
    ]),
  ]),
]);

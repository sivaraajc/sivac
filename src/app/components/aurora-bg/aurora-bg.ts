import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-aurora-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="aurora a1"></div>
      <div class="aurora a2"></div>
      <div class="aurora a3"></div>
      <div class="aurora a4"></div>
      <div class="absolute inset-0 grid-fade opacity-50"></div>
      <div class="perspective-grid"></div>
      <div class="ray r1"></div>
      <div class="ray r2"></div>
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="blob b3"></div>
      <div class="stars"></div>
      @for (s of shooting; track s) {
        <span class="shoot" [style.top.%]="s.top" [style.left.%]="s.left" [style.animation-delay]="s.delay"></span>
      }
    </div>
  `,
  styles: `
    .aurora {
      position: absolute;
      width: 58vw;
      height: 58vw;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.38;
      animation: drift 20s ease-in-out infinite alternate;
      will-change: transform;
    }
    .a1 {
      top: -12%;
      left: -8%;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.55), transparent 70%);
    }
    .a2 {
      top: 10%;
      right: -18%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.42), transparent 70%);
      animation-delay: -7s;
    }
    .a3 {
      bottom: -22%;
      left: 20%;
      background: radial-gradient(circle, rgba(255, 77, 141, 0.28), transparent 70%);
      animation-delay: -12s;
    }
    .a4 {
      top: 40%;
      left: 40%;
      width: 40vw;
      height: 40vw;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent 70%);
      animation-delay: -4s;
    }
    .blob {
      position: absolute;
      border-radius: 40% 60% 55% 45%;
      filter: blur(42px);
      opacity: 0.22;
      animation: float 16s ease-in-out infinite;
    }
    .b1 {
      width: 280px;
      height: 280px;
      top: 38%;
      left: 8%;
      background: #7c3aed;
    }
    .b2 {
      width: 220px;
      height: 220px;
      top: 58%;
      right: 10%;
      background: #06b6d4;
      animation-delay: -5s;
    }
    .b3 {
      width: 180px;
      height: 180px;
      top: 18%;
      left: 55%;
      background: #ff4d8d;
      animation-delay: -9s;
    }
    .perspective-grid {
      position: absolute;
      inset: 55% -10% -20%;
      background-image:
        linear-gradient(rgba(124, 58, 237, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
      background-size: 60px 60px;
      transform: perspective(500px) rotateX(58deg);
      mask-image: linear-gradient(to top, black, transparent 85%);
      opacity: 0.35;
      animation: gridDrift 24s linear infinite;
    }
    .ray {
      position: absolute;
      width: 2px;
      height: 55vh;
      background: linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.35), transparent);
      filter: blur(1px);
      opacity: 0.4;
      animation: raySweep 14s ease-in-out infinite;
    }
    .r1 { left: 22%; top: -10%; transform: rotate(18deg); }
    .r2 { right: 28%; top: 0; transform: rotate(-22deg); animation-delay: -6s; }
    .stars {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(1.5px 1.5px at 12% 18%, rgba(248, 250, 252, 0.7), transparent),
        radial-gradient(1px 1px at 28% 42%, rgba(248, 250, 252, 0.5), transparent),
        radial-gradient(1.5px 1.5px at 46% 12%, rgba(168, 85, 247, 0.7), transparent),
        radial-gradient(1px 1px at 62% 58%, rgba(6, 182, 212, 0.6), transparent),
        radial-gradient(1.5px 1.5px at 78% 24%, rgba(248, 250, 252, 0.55), transparent),
        radial-gradient(1px 1px at 88% 72%, rgba(255, 77, 141, 0.5), transparent),
        radial-gradient(1px 1px at 8% 78%, rgba(248, 250, 252, 0.4), transparent),
        radial-gradient(1.5px 1.5px at 54% 86%, rgba(124, 58, 237, 0.55), transparent);
      animation: twinkle 6s ease-in-out infinite alternate;
    }
    .shoot {
      position: absolute;
      width: 90px;
      height: 1px;
      background: linear-gradient(90deg, rgba(248, 250, 252, 0.9), transparent);
      transform: rotate(-35deg);
      animation: shoot 7s linear infinite;
      opacity: 0;
    }
    @keyframes drift {
      from { transform: translate3d(0, 0, 0) scale(1); }
      to { transform: translate3d(50px, 70px, 0) scale(1.18); }
    }
    @keyframes float {
      0%, 100% { transform: translate3d(0, 0, 0); }
      50% { transform: translate3d(24px, -36px, 0); }
    }
    @keyframes gridDrift {
      from { background-position: 0 0; }
      to { background-position: 0 60px; }
    }
    @keyframes raySweep {
      0%, 100% { opacity: 0.15; transform: translateX(0) rotate(18deg); }
      50% { opacity: 0.45; transform: translateX(40px) rotate(18deg); }
    }
    @keyframes twinkle {
      from { opacity: 0.45; }
      to { opacity: 1; }
    }
    @keyframes shoot {
      0% { opacity: 0; transform: translateX(0) rotate(-35deg); }
      8% { opacity: 1; }
      28% { opacity: 0; transform: translateX(280px) translateY(180px) rotate(-35deg); }
      100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora, .blob, .ray, .stars, .shoot, .perspective-grid { animation: none; }
    }
  `,
})
export class AuroraBg {
  readonly shooting = [
    { top: 12, left: 18, delay: '0s' },
    { top: 28, left: 62, delay: '2.4s' },
    { top: 8, left: 74, delay: '4.8s' },
  ];
}

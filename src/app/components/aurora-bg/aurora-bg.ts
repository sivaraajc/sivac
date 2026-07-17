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
      <div class="absolute inset-0 grid-fade opacity-40"></div>
      <div class="blob b1"></div>
      <div class="blob b2"></div>
    </div>
  `,
  styles: `
    .aurora {
      position: absolute;
      width: 55vw;
      height: 55vw;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      animation: drift 18s ease-in-out infinite alternate;
    }
    .a1 {
      top: -10%;
      left: -5%;
      background: radial-gradient(circle, rgba(45, 212, 191, 0.45), transparent 70%);
    }
    .a2 {
      top: 20%;
      right: -15%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 70%);
      animation-delay: -6s;
    }
    .a3 {
      bottom: -20%;
      left: 25%;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.18), transparent 70%);
      animation-delay: -11s;
    }
    .blob {
      position: absolute;
      border-radius: 40% 60% 55% 45%;
      filter: blur(40px);
      opacity: 0.2;
      animation: float 14s ease-in-out infinite;
    }
    .b1 {
      width: 280px;
      height: 280px;
      top: 40%;
      left: 10%;
      background: #2dd4bf;
    }
    .b2 {
      width: 220px;
      height: 220px;
      top: 60%;
      right: 12%;
      background: #38bdf8;
      animation-delay: -4s;
    }
    @keyframes drift {
      from { transform: translate3d(0, 0, 0) scale(1); }
      to { transform: translate3d(40px, 60px, 0) scale(1.15); }
    }
    @keyframes float {
      0%, 100% { transform: translate3d(0, 0, 0); }
      50% { transform: translate3d(20px, -30px, 0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora, .blob { animation: none; }
    }
  `,
})
export class AuroraBg {}

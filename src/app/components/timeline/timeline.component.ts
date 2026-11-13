import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineData } from '../../models/wedding-data.model';
import { ImgFadeDirective } from "../../shared/img-fade.directive";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  styles: [`
    .ms-card { --frame-w: 60px; padding: 2.5rem 2.5rem 2.25rem; text-align: center; }
    /* Bảng ngày ép nhũ, đè lên mép dưới của ảnh */
    .ms-date {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: -1rem;
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      background: var(--card);
      box-shadow: 0 0 0 1px rgba(140, 114, 56, 0.45), 0 6px 14px -8px rgba(23, 36, 27, 0.35);
      font-family: var(--font-serif);
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      font-variant-numeric: lining-nums tabular-nums;
    }
    .ms-no {
      font-family: "PlayfairDisplay", "Prata", serif;
      font-style: italic;
      font-size: 0.9375rem;
      color: var(--gold-deep);
    }
  `],
  template: `
    <section class="section decor decor-grass paper-alt">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Hành trình yêu thương</p>
          <h2 class="script-title">{{ data.mainTitle }}</h2>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-md md:max-w-none mx-auto">
          <article
            *ngFor="let item of data.milestone; let idx = index"
            [ngClass]="'reveal delay-' + (idx * 100)"
            class="ms-card stationery stationery-framed flex flex-col items-center"
          >
            <div class="well w-full">
              <div class="matted aspect-[4/3]">
                <img
                  appImgFade
                  [src]="item.picture"
                  [alt]="item.title"
                  class="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <p class="ms-date"><span class="foil">{{ item.day }} · {{ item.month }} · {{ item.year }}</span></p>

            <p class="ms-no mt-4" aria-hidden="true">{{ roman[idx] }}</p>
            <h3 class="font-prata text-garden-900 text-[1.375rem] leading-snug tracking-[-0.005em]">
              {{ item.title }}
            </h3>
            <div class="orn-rule w-28 my-3" aria-hidden="true"><span class="foil-orn orn-hy w-4"></span></div>
            <p class="desc text-[0.9375rem] text-garden-900/75">
              {{ item.content }}
            </p>
          </article>
        </div>
      </div>
    </section>
  `
})
export class TimelineComponent {
  @Input({ required: true }) data!: TimelineData;
  readonly roman = ["I", "II", "III", "IV", "V", "VI"];
}

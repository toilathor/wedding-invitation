import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroData } from '../../models/wedding-data.model';
import { ImgFadeDirective } from "../../shared/img-fade.directive";

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  styles: [`
    /* Chân dung trong khung vòm, viền chỉ vàng chạy song song bên ngoài */
    .portrait { padding: 0.625rem 0.625rem 1.125rem; text-align: center; }
    .arch {
      position: relative;
      padding: 5px;
      border-radius: 999px 999px 14px 14px;
      box-shadow: inset 0 0 0 1px rgba(140, 114, 56, 0.5);
    }
    .arch-photo {
      position: relative;
      overflow: hidden;
      aspect-ratio: 3 / 4.2;
      border-radius: 999px 999px 10px 10px;
      background: var(--mist);
    }
    .portrait-name {
      margin-top: 0.125rem;
      font-family: var(--font-script);
      font-size: 2rem;
      line-height: 1.15;
      white-space: nowrap;
      color: var(--green);
    }
    .portrait .orn-sprig { width: 5.5rem; margin: 0.875rem auto 0.375rem; }
    @media (min-width: 640px) {
      .portrait { padding: 1.125rem 1.125rem 1.75rem; }
      .arch { padding: 7px; }
      .portrait-name { font-size: 3.25rem; }
      .portrait .orn-sprig { width: 7.5rem; margin-top: 1.25rem; }
    }
  `],
  template: `
    <section class="section decor decor-bloom-grass paper-alt">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Cô dâu &amp; Chú rể</p>
          <h2 class="script-title">{{ data.title }}</h2>
        </header>

        <!-- Hai chân dung luôn đứng cạnh nhau, kể cả trên điện thoại -->
        <div class="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 max-w-3xl mx-auto">
          <figure class="portrait stationery m-0 reveal">
            <div class="arch">
              <div class="arch-photo">
                <img
                  appImgFade
                  [src]="data.imageGroom"
                  alt="Chú rể"
                  class="w-full h-full object-cover"
                  style="object-position: center top;"
                />
              </div>
            </div>
            <figcaption>
              <span class="foil-orn orn-sprig" aria-hidden="true"></span>
              <p class="eyebrow">Chú rể</p>
              <p class="portrait-name select-none">{{ data.nameGroom }}</p>
            </figcaption>
          </figure>

          <figure class="portrait stationery m-0 reveal delay-100">
            <div class="arch">
              <div class="arch-photo">
                <img
                  appImgFade
                  [src]="data.imageBride"
                  alt="Cô dâu"
                  class="w-full h-full object-cover"
                  style="object-position: 50% 27.03%;"
                />
              </div>
            </div>
            <figcaption>
              <span class="foil-orn orn-sprig" aria-hidden="true"></span>
              <p class="eyebrow">Cô dâu</p>
              <p class="portrait-name select-none">{{ data.nameBride }}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  `
})
export class IntroductionComponent {
  @Input({ required: true }) data!: IntroData;
}

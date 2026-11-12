import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroData } from '../../models/wedding-data.model';
import { ImgFadeDirective } from "../../shared/img-fade.directive";

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  template: `
    <section class="section bg-white">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Cô dâu &amp; Chú rể</p>
          <h2 class="script-title">{{ data.title }}</h2>
        </header>

        <!-- Hai chân dung luôn đứng cạnh nhau, kể cả trên điện thoại -->
        <div class="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 max-w-3xl mx-auto">
          <figure class="m-0 text-center reveal">
            <div class="photo aspect-[3/4] shadow-card">
              <img
                appImgFade
                [src]="data.imageGroom"
                alt="Chú rể"
                class="w-full h-full object-cover"
                style="object-position: center top;"
              />
            </div>
            <figcaption class="mt-4 sm:mt-6">
              <p class="eyebrow">Chú rể</p>
              <p class="font-pinyonScript text-garden-700 text-[2.125rem] sm:text-5xl md:text-6xl leading-[1.1] mt-1 whitespace-nowrap select-none">
                {{ data.nameGroom }}
              </p>
            </figcaption>
          </figure>

          <figure class="m-0 text-center reveal delay-100">
            <div class="photo aspect-[3/4] shadow-card">
              <img
                appImgFade
                [src]="data.imageBride"
                alt="Cô dâu"
                class="w-full h-full object-cover"
                style="object-position: 50% 27.03%;"
              />
            </div>
            <figcaption class="mt-4 sm:mt-6">
              <p class="eyebrow">Cô dâu</p>
              <p class="font-pinyonScript text-garden-700 text-[2.125rem] sm:text-5xl md:text-6xl leading-[1.1] mt-1 whitespace-nowrap select-none">
                {{ data.nameBride }}
              </p>
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

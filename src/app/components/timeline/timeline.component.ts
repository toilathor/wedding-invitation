import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineData } from '../../models/wedding-data.model';
import { ImgFadeDirective } from "../../shared/img-fade.directive";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  template: `
    <section class="section bg-white">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Hành trình yêu thương</p>
          <h2 class="script-title">{{ data.mainTitle }}</h2>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-md md:max-w-none mx-auto">
          <article
            *ngFor="let item of data.milestone; let idx = index"
            [ngClass]="'reveal delay-' + (idx * 100)"
            class="flex flex-col overflow-hidden rounded-[28px] bg-ivory"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-garden-50">
              <img
                appImgFade
                [src]="item.picture"
                [alt]="item.title"
                class="w-full h-full object-cover object-center"
              />
            </div>

            <div class="flex flex-col gap-2 p-6 sm:p-7">
              <p class="eyebrow tabular-nums">{{ item.day }} · {{ item.month }} · {{ item.year }}</p>
              <h3 class="font-prata text-garden-900 text-[1.375rem] leading-snug tracking-[-0.005em]">
                {{ item.title }}
              </h3>
              <p class="text-[0.9375rem] leading-relaxed text-garden-900/70">
                {{ item.content }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `
})
export class TimelineComponent {
  @Input({ required: true }) data!: TimelineData;
}

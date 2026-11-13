import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { StoryData } from "../../models/wedding-data.model";
import { ImgFadeDirective } from "../../shared/img-fade.directive";

@Component({
  selector: "app-story",
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  template: `
    <section class="section decor decor-tl bg-ivory">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Love story</p>
          <h2 class="script-title">{{ data.title }}</h2>
          <div class="lead mt-2 text-justify" [innerHTML]="data.contentHtml"></div>
        </header>

        <!-- Ảnh giữ nguyên tỉ lệ gốc để không cắt mất dòng chữ in sẵn trên ảnh -->
        <div class="photo aspect-[10/7] max-w-5xl mx-auto shadow-float reveal delay-100">
          <img
            appImgFade
            [src]="data.image"
            alt="Chuyện chúng mình"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  `,
})
export class StoryComponent {
  @Input({ required: true }) data!: StoryData;
}

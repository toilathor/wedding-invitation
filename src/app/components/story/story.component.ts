import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { StoryData } from "../../models/wedding-data.model";
import { ImgFadeDirective } from "../../shared/img-fade.directive";

@Component({
  selector: "app-story",
  standalone: true,
  imports: [CommonModule, ImgFadeDirective],
  template: `
    <section class="section decor decor-leaf-vine paper">
      <div class="section-inner">
        <header class="section-head reveal">
          <p class="eyebrow">Love story</p>
          <h2 class="script-title">{{ data.title }}</h2>
          <div class="lead mt-2 text-justify" [innerHTML]="data.contentHtml"></div>
        </header>

        <!-- Ảnh giữ nguyên tỉ lệ gốc để không cắt mất dòng chữ in sẵn trên ảnh -->
        <!-- Ảnh lồng trong một tấm thiệp có khung, cùng kiểu với các card khác -->
        <div class="story-card stationery stationery-framed max-w-5xl mx-auto p-10 sm:p-12 reveal delay-100">
          <div class="well">
            <div class="matted aspect-[10/7]">
              <img
                appImgFade
                [src]="data.image"
                alt="Chuyện chúng mình"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StoryComponent {
  @Input({ required: true }) data!: StoryData;
}

import { Pipe, PipeTransform, inject } from "@angular/core";
import { GuestService } from "../services/guest.service";

/** {{ 'Sự hiện diện của {you} ...' | personalize }} — thay token xưng hô theo khách của link. */
@Pipe({ name: "personalize", standalone: true })
export class PersonalizePipe implements PipeTransform {
  private guests = inject(GuestService);
  transform(text: string | null | undefined): string {
    return text ? this.guests.fmt(text) : "";
  }
}

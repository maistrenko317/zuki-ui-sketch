import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseEditMeDetailsComponent } from '@snowl/base-app/user';
import { Subject } from 'rxjs';
import {BaseDialogService} from "@snowl/base-app/shared";
import {ResizeImageComponent} from "../resize-image/resize-image.component";

@Component({
  selector: 'sh-edit-me-detail',
  templateUrl: './edit-me-detail.component.html',
  styleUrls: ['./edit-me-detail.component.scss']
})
export class EditMeDetailComponent extends BaseEditMeDetailsComponent {
  @Output() imageChange = new EventEmitter<Blob>();

  constructor(private dialog: BaseDialogService) {
    super();
  }

  uploadImage(image?: File): void {
    if (image) {
      this.dialog.openComponent(ResizeImageComponent, image).onClose.subscribe(resized => {
        if (resized)
          this.imageChange.emit(resized);
      })
    }
  }
}

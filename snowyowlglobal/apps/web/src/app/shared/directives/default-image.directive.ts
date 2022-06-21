import { Directive, ElementRef, Input } from '@angular/core';
import { BaseImageStoreService } from '@snowl/base-app/shared';

@Directive({
  selector: '[shImage], [shBackgroundImage]'
})
export class DefaultImageDirective {
  @Input() default: string;

  constructor(private el: ElementRef, private imageStore: BaseImageStoreService<boolean>) {}

  @Input()
  set shImage(img: string) {
    // Timeout to allow the other inputs to be set
    setTimeout(() => this.ensureImage(img, 'src'));
  }

  @Input()
  set shBackgroundImage(img: string) {
    // Timeout to allow the other inputs to be set
    setTimeout(() => this.ensureImage(img, 'background'));
  }

  private ensureImage(img: string, type: ImageType): void {
    const stored = this.imageStore.getStoredImage(img);
    if (!img || stored === false) {
      return this.setNativeImage(this.default, type);
    }
    if (stored === true) {
      return this.setNativeImage(img, type);
    }

    const image = document.createElement('img') as HTMLImageElement;
    image.onload = () => {
      this.setNativeImage(img, type);
      this.imageStore.setStoredImage(img, true);
    };

    image.onerror = () => {
      this.setNativeImage(this.default, type);
      this.imageStore.setStoredImage(img, false);
    };
    image.src = img;
  }

  private setNativeImage(img: string, type: ImageType): void {
    const el = this.el.nativeElement as HTMLImageElement;
    if (type === 'src') {
      el.src = img;
    } else {
      el.style.backgroundImage = `url('${img}')`;
    }
  }
}

type ImageType = 'background' | 'src';

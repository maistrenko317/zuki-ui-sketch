import {AfterViewInit, Component, ElementRef, HostBinding, HostListener, ViewChild} from "@angular/core";
import {DomSanitizer, SafeStyle, SafeUrl} from "@angular/platform-browser";
import {boundNumber} from "@snowl/base-app/util";
import {VxDialogDef, VxDialogRef} from 'vx-components';

@Component({
  templateUrl: './resize-image.component.html',
  styleUrls: ['./resize-image.component.scss']
})
export class ResizeImageComponent extends VxDialogDef<File, Blob | null> {

  @ViewChild('img', {static: false}) img: ElementRef<HTMLImageElement>;

  url: SafeUrl;
  containerSize: number;

  imageWidth = 0;
  imageHeight = 0;

  originX = 0;
  originY = 0;

  scale = 1;

  translateX = 0;
  translateY = 0;

  lastTouchX = 0;
  lastTouchY = 0;

  get transfom(): SafeStyle {
    const string = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    return this.sanitizer.bypassSecurityTrustStyle(string);
  }

  private touching = false;
  constructor(private sanitizer: DomSanitizer, private dialog: VxDialogRef<ResizeImageComponent>) {
    super();
    this.containerSize = this.calcContainerSize();
    this.dialog = dialog;
    this.url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(dialog.data));
  }

  onImageLoad(img: HTMLImageElement): void {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (width < height) {
      this.imageWidth = this.containerSize;
      this.imageHeight = this.containerSize / width * height;
    } else {
      this.imageHeight = this.containerSize;
      this.imageWidth = this.containerSize / height * width;
    }
    const halfContainer = this.containerSize / 2;
    this.originX = halfContainer / this.imageWidth;
    this.originY = halfContainer / this.imageHeight;
  }

  handleTouchStart(event: TouchEvent | MouseEvent): boolean {
    const {clientX, clientY} = event instanceof TouchEvent ? event.touches[0] : event;
    this.lastTouchX = clientX;
    this.lastTouchY = clientY;

    this.touching = true;
    return false;
  }

  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  handleTouchMove(event: TouchEvent | MouseEvent): boolean {
    if (this.touching) {
      const {clientX, clientY} = event instanceof TouchEvent ? event.touches[0] : event;
      const bounds = this.calculateBounds();
      const diffX = clientX - this.lastTouchX;
      const diffY = clientY - this.lastTouchY;
      this.translateX = this.boundTranslateX(this.translateX + diffX, bounds);
      this.translateY = this.boundTranslateY(this.translateY + diffY, bounds);
      this.lastTouchX = clientX;
      this.lastTouchY = clientY;
    }

    return this.touching;
  }

  @HostListener('window:touchend')
  @HostListener('window:mouseup')
  handleTouchEnd(): void {
    this.touching = false;
  }

  handleZoom(zoom: number): void {
    let bounds = this.calculateBounds();

    const newOriginX = (bounds.overlapLeft - this.translateX + this.containerSize / 2) / this.scale;
    const newOriginY = (bounds.overlapTop - this.translateY + this.containerSize / 2) / this.scale;

    const oldOriginX = this.originX * this.imageWidth;
    const oldOriginY = this.originY * this.imageHeight;


    this.originX = newOriginX / this.imageWidth;
    this.originY = newOriginY / this.imageHeight;

    this.scale = zoom;

    bounds = this.calculateBounds();

    this.translateX = this.boundTranslateX(this.translateX + (oldOriginX - newOriginX) * (1 - this.scale), bounds);
    this.translateY = this.boundTranslateY(this.translateY + (oldOriginY - newOriginY) * (1 - this.scale), bounds);

  }

  upload(): void {
    const {visibleLeftPct, visibleTopPct, visibleWidthPct} = this.calculateBounds();
    const image = this.img.nativeElement;
    const canvas = document.createElement('canvas');

    const sourceLeft = visibleLeftPct * image.naturalWidth;
    const sourceTop = visibleTopPct * image.naturalHeight;
    const sourceSize = visibleWidthPct * image.naturalWidth;
    let destinationSize = 500;

    if (sourceSize < destinationSize)
      destinationSize = sourceSize;

    canvas.width = destinationSize;
    canvas.height = destinationSize;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(image, sourceLeft, sourceTop, sourceSize, sourceSize, 0, 0, destinationSize, destinationSize);

    canvas.toBlob((blob) => {
      this.dialog.close(blob as Blob);
    }, 'image/jpeg');
  }

  close(): void {
    this.dialog.close(null);
  }

  private calcContainerSize(): number {
    const width = window.innerWidth;
    if (width <= 320) {
      return 225;
    } else {
      return 300;
    }
  }

  private calculateBounds(): Bounds {
    const {imageWidth, imageHeight, scale, translateX, translateY, originX, originY, containerSize} = this;
    const overlapX = imageWidth * scale - imageWidth;
    const overlapLeft = originX * overlapX;
    const overlapRight = overlapX - overlapLeft + imageWidth - containerSize;

    const visibleLeftPct = (overlapLeft - translateX) / scale / imageWidth;

    const overlapY = imageHeight * scale - imageHeight;
    const overlapTop = originY * overlapY;
    const overlapBottom = overlapY - overlapTop + imageHeight - containerSize;

    const visibleTopPct = (overlapTop - translateY) / scale / imageHeight;

    const visibleWidthPct = this.containerSize / (imageWidth * scale);
    const visibleHeightPct = this.containerSize / (imageHeight * scale);

    return {
      overlapX,
      overlapLeft,
      overlapRight,
      overlapY,
      overlapTop,
      overlapBottom,
      visibleLeftPct,
      visibleTopPct,
      visibleWidthPct,
      visibleHeightPct
    }
  }

  private boundTranslateX(amount: number, {overlapLeft, overlapRight}: Bounds): number {
    if (overlapLeft > 0 || overlapRight > 0) {
      return boundNumber(amount, -overlapRight, overlapLeft);
    } else {
      return 0;
    }
  }

  private boundTranslateY(amount: number, {overlapTop, overlapBottom}: Bounds): number {
    if (overlapTop > 0 || overlapBottom > 0) {
      return boundNumber(amount, -overlapBottom, overlapTop);
    } else {
      return 0;
    }
  }
}

export interface Bounds {
  overlapX: number;
  overlapLeft: number;
  overlapRight: number;
  overlapY: number;
  overlapTop: number;
  overlapBottom: number;
  visibleLeftPct: number;
  visibleTopPct: number;
  visibleWidthPct: number;
  visibleHeightPct: number;
}

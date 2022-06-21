import { AfterViewInit, ContentChild, Directive, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { debounceTime, startWith, throttleTime } from 'rxjs/operators';
import * as textMaskCore from 'text-mask-core';
import { VxFormFieldDirective } from 'vx-components';

@Directive({selector: '[shMask][vxFormField]'})
export class MaskDirective implements AfterViewInit, OnDestroy {

  @ContentChild(VxFormFieldDirective, {static: false}) formField!: VxFormFieldDirective;

  @Input('shMask') mask: any;

  private lastUpdateTime = 0;

  maskedInputController: any;
  subscription?: Subscription;
  constructor(private el: ElementRef, private control: NgControl) {

  }

  ngAfterViewInit(): void {
    this.maskedInputController = textMaskCore.createTextMaskInputElement({
      inputElement: this.el.nativeElement,
      ...this.mask
    });

    // Must be in timeout for the first render.
    setTimeout(() => {
      // Make sure to capture anything that can possibly cause a value change
      this.subscription = merge(
        this.formField.valueChange,
        this.control.valueChanges!
      ).pipe(startWith(null)).subscribe(() => {
        const time = Date.now();
        // Keep from parsing multiple times.
        if (time - this.lastUpdateTime < 10) {
          return;
        }
        this.lastUpdateTime = time;
        this.maskedInputController.update();
        this.formField.value = this.el.nativeElement.value;
      });
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

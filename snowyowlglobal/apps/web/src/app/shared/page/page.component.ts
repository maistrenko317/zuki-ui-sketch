import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { Subject ,  fromEvent ,  zip ,  timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { EasingFunctions } from '@snowl/base-app/animations';
import {environment} from '@snowl/environments/environment';

@Directive({
  selector: '[shHeaderRight]'
})
export class NavHeaderRightDirective {}

@Directive({
  selector: '[shHeaderLeft]'
})
export class NavHeaderLeftDirective {}

@Directive({
  selector: '[shHeaderContent]',
  host: {
    '[class.headerTitle]': 'true'
  }
})
export class NavHeaderContentDirective {}

@Directive({
  selector: '[shNavItem]'
})
export class NavItemDirective {}

@Directive({
  selector: '[shPageBody]'
})
export class PageBodyDirective {}

const PULL_DISTANCE = 60;
const MIN_PULL_TIME = 1000;

@Component({
  selector: 'sh-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(NavItemDirective) navItems: QueryList<ElementRef>;
  @ContentChild(NavHeaderContentDirective, {static: false}) headerContent: NavHeaderContentDirective;

  @ViewChild('puller', {static: false}) puller: ElementRef<HTMLDivElement>;
  @ViewChild('body', {static: false}) body: ElementRef<HTMLDivElement>;

  @Input() headerShadow = true;

  lastTouchY?: number;
  currentTransform = 0;
  fingerDistance = 0;
  pullState: PullState = 'default';

  @Input() noRefresh = false;
  @Input() clickable = false;

  @Output() refresh = new EventEmitter<Subject<void>>();
  @Output() titleClicked = new EventEmitter();

  private ngUnsubscribe = new Subject();

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  onTouchMove(event: TouchEvent): boolean | void {
    let returnValue = true;
    if (this.noRefresh || this.pullState === 'refreshing') {
      return;
    }

    const scrollTop = document.scrollingElement!.scrollTop;
    const canPull = scrollTop === 0;
    const newLocation = event.touches[0].screenY;

    if (canPull && this.lastTouchY) {
      this.fingerDistance += newLocation - this.lastTouchY;
      const animationAmount = Math.min(this.fingerDistance / PULL_DISTANCE / 4, 1);
      this.currentTransform = EasingFunctions.easeOutQuad(animationAmount) * PULL_DISTANCE;

      returnValue = false;
    }
    if (!canPull || !this.lastTouchY || this.currentTransform <= 0) {
      this.clearPulling(false);
      returnValue = true;
    }
    const toMove = this.currentTransform;
    this.puller.nativeElement.style.transform = `translateY(${toMove}px)`;

    let newPullState = this.pullState;
    if (this.currentTransform >= PULL_DISTANCE || scrollTop <= -PULL_DISTANCE) {
      newPullState = 'pulled';
    } else if (this.pullState === 'pulled') {
      newPullState = 'default';
    }

    if (this.pullState !== newPullState) {
      this.pullState = newPullState;
      this.cdr.detectChanges();
    }

    if (canPull) this.lastTouchY = newLocation;

    if (!returnValue) {
      event.preventDefault();
    }
    return returnValue;
  }

  onTouchEnd(): void {
    if (this.pullState === 'pulled') {
      this.pullState = 'refreshing';
      this.cdr.detectChanges();

      this.animateTopToNumber(PULL_DISTANCE);

      const refreshDoneSubject = new Subject<void>();
      zip(refreshDoneSubject, timer(MIN_PULL_TIME))
        .pipe(take(1))
        .subscribe(() => {
          refreshDoneSubject.complete();
          this.clearPulling(true);
          setTimeout(() => {
            this.pullState = 'default';
            this.cdr.detectChanges();
          }, 100);
        });

      this.refresh.next(refreshDoneSubject);
    } else if (this.pullState === 'default') {
      this.clearPulling(true);
    }
  }

  onTitleClick(): void {
    //if (this.clickable) this.titleClicked.emit();
    const documentElement:any  = document.documentElement;
    if(document.fullscreenElement === documentElement) {
      document.exitFullscreen();
    } else {
      documentElement.requestFullscreen();
    }
  }

  ngAfterViewInit(): void {
    const body = this.body.nativeElement;
    this.zone.runOutsideAngular(() => {
      fromEvent(body, 'touchmove')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(event => {
          this.onTouchMove(event as TouchEvent);
        });

      fromEvent(body, 'touchend')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => this.onTouchEnd());
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private clearPulling(resetTransform = true): void {
    this.currentTransform = 0;
    this.fingerDistance = 0;
    this.lastTouchY = undefined;
    if (resetTransform) {
      this.animateTopToNumber(0);
    }
  }

  private animateTopToNumber(num: number): void {
    this.puller.nativeElement.style.transition = 'transform 100ms';
    this.puller.nativeElement.style.transform = `translateY(${num}px)`;
    setTimeout(() => {
      this.puller.nativeElement.style.transition = '';
    }, 100);
  }
}

type PullState = 'default' | 'refreshing' | 'pulled';

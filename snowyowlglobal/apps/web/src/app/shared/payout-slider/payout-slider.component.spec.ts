import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutSliderComponent } from './payout-slider.component';

describe('JoinGameDialogComponent', () => {
  let component: PayoutSliderComponent;
  let fixture: ComponentFixture<PayoutSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

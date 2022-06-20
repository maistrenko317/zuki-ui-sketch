import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoneyStepperComponent } from './add-money-stepper.component';

describe('AddMoneyStepperComponent', () => {
  let component: AddMoneyStepperComponent;
  let fixture: ComponentFixture<AddMoneyStepperComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AddMoneyStepperComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoneyStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

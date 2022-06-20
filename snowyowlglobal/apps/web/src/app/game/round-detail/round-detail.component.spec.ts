import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundDetailComponent } from './round-detail.component';

describe('RoundDetailComponent', () => {
  let component: RoundDetailComponent;
  let fixture: ComponentFixture<RoundDetailComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [RoundDetailComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

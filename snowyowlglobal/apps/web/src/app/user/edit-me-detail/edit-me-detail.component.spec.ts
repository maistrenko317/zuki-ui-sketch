import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeDetailComponent } from './edit-me-detail.component';

describe('EditMeDetailComponent', () => {
  let component: EditMeDetailComponent;
  let fixture: ComponentFixture<EditMeDetailComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [EditMeDetailComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

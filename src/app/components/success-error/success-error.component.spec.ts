import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessErrorComponent } from './success-error.component';

describe('SuccessErrorComponent', () => {
  let component: SuccessErrorComponent;
  let fixture: ComponentFixture<SuccessErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessErrorComponent]
    });
    fixture = TestBed.createComponent(SuccessErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

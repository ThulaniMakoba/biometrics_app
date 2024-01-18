import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedOutComponent } from './locked-out.component';

describe('LockedOutComponent', () => {
  let component: LockedOutComponent;
  let fixture: ComponentFixture<LockedOutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LockedOutComponent]
    });
    fixture = TestBed.createComponent(LockedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPacketsComponent } from './assign-packets.component';

describe('AssignPacketsComponent', () => {
  let component: AssignPacketsComponent;
  let fixture: ComponentFixture<AssignPacketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignPacketsComponent]
    });
    fixture = TestBed.createComponent(AssignPacketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

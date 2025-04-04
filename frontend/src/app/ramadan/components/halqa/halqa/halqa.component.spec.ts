import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalqaComponent } from './halqa.component';

describe('HalqaComponent', () => {
  let component: HalqaComponent;
  let fixture: ComponentFixture<HalqaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HalqaComponent]
    });
    fixture = TestBed.createComponent(HalqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalqaDetailsComponent } from './halqa-details.component';

describe('HalqaDetailsComponent', () => {
  let component: HalqaDetailsComponent;
  let fixture: ComponentFixture<HalqaDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HalqaDetailsComponent]
    });
    fixture = TestBed.createComponent(HalqaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

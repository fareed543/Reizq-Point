import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamadanDashboardComponent } from './ramadan-dashboard.component';

describe('RamadanDashboardComponent', () => {
  let component: RamadanDashboardComponent;
  let fixture: ComponentFixture<RamadanDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RamadanDashboardComponent]
    });
    fixture = TestBed.createComponent(RamadanDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

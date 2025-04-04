import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamadanBarChartComponent } from './ramadan-bar-chart.component';

describe('RamadanBarChartComponent', () => {
  let component: RamadanBarChartComponent;
  let fixture: ComponentFixture<RamadanBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RamadanBarChartComponent]
    });
    fixture = TestBed.createComponent(RamadanBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

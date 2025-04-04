import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketsBarChartComponent } from './packets-bar-chart.component';

describe('PacketsBarChartComponent', () => {
  let component: PacketsBarChartComponent;
  let fixture: ComponentFixture<PacketsBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacketsBarChartComponent]
    });
    fixture = TestBed.createComponent(PacketsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

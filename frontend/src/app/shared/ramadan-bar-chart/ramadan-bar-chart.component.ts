import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-ramadan-bar-chart',
  templateUrl: './ramadan-bar-chart.component.html',
  styleUrls: ['./ramadan-bar-chart.component.scss']
})
export class RamadanBarChartComponent {
  @Input() memberList: any[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Registrations Over Time' },
    xAxis: { categories: [], title: { text: 'Date of Registration' } },
    yAxis: { min: 0, title: { text: 'Number of Registrations' } },
    series: [{
      name: 'Registrations',
      type: 'column',
      data: [],
      dataLabels: {
        enabled: true, // Show count above bars
        format: '{y}', // Display the value
        style: { fontSize: '12px', fontWeight: 'bold' }
      }
    }],
    plotOptions: {
      column: {
        dataLabels: { enabled: true } // Ensure data labels are enabled
      }
    }
  };

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['memberList'] && this.memberList) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.memberList || this.memberList.length === 0) {
      this.resetChart();
      return;
    }

    // Process the data
    const dateCounts: Record<string, number> = {};
    this.memberList.forEach(member => {
      const date = member.date_created?.split(' ')[0]; // Extract YYYY-MM-DD
      if (date) {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    // Prepare chart data
    const sortedDates = Object.keys(dateCounts).sort(); // Sort dates
    const counts = sortedDates.map(date => dateCounts[date]);

    // Update chart options
    this.chartOptions.xAxis = { categories: sortedDates, title: { text: 'Date of Registration' } };
    this.chartOptions.series = [{
      name: 'Registrations',
      type: 'column',
      data: counts,
      dataLabels: {
        enabled: true, // Show count above bars
        format: '{y}', // Display the value
        style: { fontSize: '12px', fontWeight: 'bold' }
      }
    }];

    this.cd.detectChanges();
  }

  private resetChart(): void {
    this.chartOptions.xAxis = { categories: [], title: { text: 'Date of Registration' } };
    this.chartOptions.series = [{
      name: 'Registrations',
      type: 'column',
      data: [],
      dataLabels: { enabled: true, format: '{y}', style: { fontSize: '12px', fontWeight: 'bold' } }
    }];
    this.cd.detectChanges();
  }
}

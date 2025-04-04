import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-packets-bar-chart',
  templateUrl: './packets-bar-chart.component.html',
  styleUrls: ['./packets-bar-chart.component.scss']
})
export class PacketsBarChartComponent implements OnChanges {
  @Input() packetsData: any[] = [];
  
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Packets and People Count Per Day' },
    xAxis: { categories: [], title: { text: 'Date' } },
    yAxis: { min: 0, title: { text: 'Count' } },
    series: [],
    plotOptions: {
      column: {
        dataLabels: { enabled: true } // Show values on top of bars
      }
    }
  };

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['packetsData'] && this.packetsData) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.packetsData || this.packetsData.length === 0) {
      this.resetChart();
      return;
    }

    // Prepare data structure
    const dateData: Record<string, { totalPackets: number; totalRecords: number }> = {};

    this.packetsData.forEach(item => {
      const date = item.date.split(' ')[0]; // Extract YYYY-MM-DD
      if (!dateData[date]) {
        dateData[date] = { totalPackets: 0, totalRecords: 0 };
      }
      dateData[date].totalPackets += parseInt(item.total_packets, 10) || 0;
      dateData[date].totalRecords += parseInt(item.total_records, 10) || 0;
    });

    // Sort dates
    const sortedDates = Object.keys(dateData).sort();
    const packetsData = sortedDates.map(date => dateData[date].totalPackets);
    const recordsData = sortedDates.map(date => dateData[date].totalRecords);

    // Update chart options
    this.chartOptions.xAxis = { categories: sortedDates, title: { text: 'Date' } };
    this.chartOptions.series = [
      {
        name: 'Total Packets',
        type: 'column',
        data: packetsData,
        color: 'rgba(54, 162, 235, 0.8)',
        dataLabels: { enabled: true, format: '{y}' }
      },
      {
        name: 'Total Records (People Count)',
        type: 'column',
        data: recordsData,
        color: 'rgba(255, 99, 132, 0.8)',
        dataLabels: { enabled: true, format: '{y}' }
      }
    ];

    this.cd.detectChanges();
  }

  private resetChart(): void {
    this.chartOptions.xAxis = { categories: [], title: { text: 'Date' } };
    this.chartOptions.series = [];
    this.cd.detectChanges();
  }
}

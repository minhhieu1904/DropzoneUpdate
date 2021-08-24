import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-ng2-chart',
  templateUrl: './ng2-chart.component.html',
  styleUrls: ['./ng2-chart.component.scss']
})
export class Ng2ChartComponent implements OnInit {
  stitchingData: number[] = [18, 20, 21, 38, 99, 60, 23, 20, 20, 23, 23, 18, 21, 22, 16, 21, 25];
  taktTimeData: number[] = [22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22];
  employeeQtyData: number[] = [1, 1, 1, 2, 4, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  lables: string[] = ['16A-2 + 16B-2', '16A-3 + 16B-3', '2 + 18A-2', '3', '4', '5', '6', '7', '8', '9', '18A3A-2', '18A-3', '18A-4', '18A-5 + 18A-6', '18A-7', '18A-8', '5A-2'];

  chart: any;

  constructor() { }

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {
    this.chart = {
      datasets: [
        {
          data: this.stitchingData,
          label: "Stitching"
        },
        {
          data: this.taktTimeData,
          label: "Takt Time",
          type: "line"
        },
        {
          data: this.employeeQtyData,
          label: "Employee Qty",
          type: "bubble"
        }
      ],
      labels: this.lables,
      options: {
        responsive: true,
        lineTension: 1,
        animations: {
          tension: {
            duration: 5000,
            // easing: 'linear',
            // from: 1,
            // to: 0,
            // loop: true
          }
        },
        legend: {
          text: "You awesome chart with average line",
          display: true,
        },
        scales: {
          yAxes: [{
            id: "Employee Qty",
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              // "min": "Monday",
              // "max": "Sunday",
            }
          }],
        }
      }
    };
  }
}

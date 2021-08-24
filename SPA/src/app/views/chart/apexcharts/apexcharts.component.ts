import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-apexcharts',
  templateUrl: './apexcharts.component.html',
  styleUrls: ['./apexcharts.component.scss']
})
export class ApexchartsComponent implements OnInit {
  stitchingData: number[] = [18, 20, 21, 38, 99, 60, 23, 20, 20, 23, 23, 18, 21, 22, 16, 21, 25];
  taktTimeData: number[] = [22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22];
  employeeQtyData: number[] = [1, 1, 1, 2, 4, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  lables: string[] = ['16A-2 + 16B-2', '16A-3 + 16B-3', '2 + 18A-2', '3', '4', '5', '6', '7', '8', '9', '18A3A-2', '18A-3', '18A-4', '18A-5 + 18A-6', '18A-7', '18A-8', '5A-2'];

  constructor() { }

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {
    // const employeeQtyData = this.employeeQtyData;
    var options = {
      chart: {
        height: 450,
        type: "line",
        stacked: false,
        background: '#fff'
      },
      dataLabels: {
        enabled: true,
        // formatter: function (val, opt) {
        //   let test: number[] = employeeQtyData;
        //   let a = opt.w.globals.labels[opt.dataPointIndex];
        //   return "" + test[a - 1];
        // },
        offsetY: -5,
        distributed: false,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        background: {
          enabled: true,
          foreColor: '#000',
          borderRadius: 2,
          padding: 4,
          opacity: 1,
          borderWidth: 1,
          borderColor: '#fff'
        },
        enabledOnSeries: [2],
        textAnchor: "middle"
      },
      colors: ['rgb(0, 143, 251)', 'rgb(254, 176, 25)', '#000'],
      series: [
        {
          name: 'Stitching',
          type: 'column',
          data: this.stitchingData
        },
        {
          name: "Takt Time",
          type: 'line',
          data: this.taktTimeData
        },
        {
          name: "Employee Qty",
          type: 'bubble',
          data: this.employeeQtyData
        },
      ],
      stroke: {
        width: [4, 4, 4]
      },
      plotOptions: {
        bar: {
          columnWidth: "20%",
        },
        bubble: {
          minBubbleRadius: undefined,
          maxBubbleRadius: undefined
        }
      },
      xaxis: {
        categories: this.lables
      },
      yaxis: [
        {
          seriesName: 'Stitching',
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
          }
        },
        {
          seriesName: 'Stitching',
          show: false
        },
        {
          seriesName: 'Employee Qty',
          show: false,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true
          },
        }
      ],
      tooltip: {
        shared: false,
        intersect: true,
        x: {
          show: false
        }
      },
      legend: {
        horizontalAlign: "center",
        offsetX: 40
      }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
  }
}

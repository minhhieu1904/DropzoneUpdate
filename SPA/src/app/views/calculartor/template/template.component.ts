import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  current: number = 0;
  result: number = 0;
  calculator: string;
  text: string = "";
  constructor() { }

  ngOnInit() {
  }
  input(i: number) {
    if (this.text == '' && i == 0) return;
    this.text = this.text + i.toString();
  }
  changeCalculator(i: string) {
    if (i == '.') {
      this.text = this.text + '.';
    }
    if (this.text == '') return;
    if (i == '1') {
      this.text = this.text + '+';
    } else if (i == '2') {
      this.text = this.text + '-';
    } else if (i == '3') {
      this.text = this.text + '*';
    } else if (i == '4') {
      this.text = this.text + '/';
    }

  }
  changeCurrentResult() {
    // if (this.text.charAt(0) == '0') this.text = this.text.substring(0, 1);
    this.result = eval(this.text);
    this.text = this.result.toString();
  }
  removeAll() {
    this.text = '';
    this.result = 0;
  }
  remove() {
    this.text = this.text.substring(0, this.text.length - 1);
  }
}

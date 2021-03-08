import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-404-1',
  templateUrl: './page-404-1.component.html',
  styleUrls: ['./page-404-1.component.scss']
})
export class Page_404_1_Component implements OnInit {
  time: number;
  time$: Subscription;
  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
    this.time$ = interval(1000).pipe(map(data => data = 30 - data), take(31)).subscribe((res: number) => {
      this.time = res;
      if(this.time === 0) {
        this.router.navigate(['/dashboard']);
      }
    })
  }

  back(): void {
    this.location.back();
  }
}

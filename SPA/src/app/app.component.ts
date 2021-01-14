import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    // Select2 Bootstrap Theme
    (function ($) {
      $(document).ready(function () {
        $.fn.select2.defaults.set('theme', 'bootstrap');
      });
    })(jQuery);
  }
}

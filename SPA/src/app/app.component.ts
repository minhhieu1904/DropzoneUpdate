import { Component, OnInit } from '@angular/core';
import { SignalRService } from './_core/_services/signal-r.service';
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    // Select2 Bootstrap Theme
    (function ($) {
      $(document).ready(function () {
        $.fn.select2.defaults.set('theme', 'bootstrap');
      });
    })(jQuery);
  }
}

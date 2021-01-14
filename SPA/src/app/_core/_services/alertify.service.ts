import { Injectable } from '@angular/core';
declare let alertify: any;
alertify.set('notifier', 'position', 'top-right');
alertify.defaults.theme.ok = 'btn btn-primary';
alertify.defaults.theme.cancel = 'btn btn-danger';

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {

  constructor() { }

  confirm(title: string, message: string, okCallback: () => any) {
    alertify.confirm(message, function (e) {
      if (e) {
        okCallback();
      } else { }
    }).setHeader(title);
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }

}

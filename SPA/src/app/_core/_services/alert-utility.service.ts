import { Injectable } from '@angular/core';
import { SnotifyPosition, SnotifyService, SnotifyToastConfig } from 'ng-snotify';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertUtilityService {
  style = 'material';
  timeout = 3000;
  progressBar = true;
  closeClick = true;
  newTop = true;
  filterDuplicates = false;
  backdrop = -1;
  dockMax = 8;
  blockMax = 8;
  pauseHover = true;
  titleMaxLength = 50;
  bodyMaxLength = 100;
  constructor(
    private snotifyService: SnotifyService
  ) { }

  getConfig(position: SnotifyPosition): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  success(body: string, title: string) {
    this.snotifyService.success(body, title, this.getConfig(SnotifyPosition.rightTop));
  }

  info(body: string, title: string) {
    this.snotifyService.info(body, title, this.getConfig(SnotifyPosition.rightTop));
  }

  error(body: string, title: string) {
    this.snotifyService.error(body, title, this.getConfig(SnotifyPosition.rightTop));
  }

  warning(body: string, title: string) {
    this.snotifyService.warning(body, title, this.getConfig(SnotifyPosition.centerTop));
  }

  simple(body: string, title: string) {
    // const icon = `assets/custom-svg.svg`;
    const icon = `https://placehold.it/48x100`;

    this.snotifyService.simple(body, title, {
      ...this.getConfig(SnotifyPosition.rightTop),
      icon
    });
  }

  message(body: string) {
    this.snotifyService.success(body, this.getConfig(SnotifyPosition.rightTop));
  }

  confirmDelete(body: string, okCallback: () => any) {
    const { timeout, closeOnClick, ...config } = this.getConfig(SnotifyPosition.centerCenter); // Omit props what i don't need
    this.snotifyService.confirm(body, {
      ...config,
      buttons: [
        {
          text: 'Yes',
          action: (toast) => {
            this.snotifyService.remove(toast.id);
            okCallback();
          }
        },
        {
          text: 'Cancle',
          action: toast => {
            this.snotifyService.remove(toast.id);
          },
          bold: true
        }
      ]
    });
  }

  html() {
    const html = `<div class="snotifyToast__title"><b>Html Bold Title</b></div>
    <div class="snotifyToast__body"><i>Html</i> <b>toast</b> <u>content</u></div>`;
    this.snotifyService.html(html, this.getConfig(SnotifyPosition.rightTop));
  }

  clear() {
    this.snotifyService.clear();
  }
}

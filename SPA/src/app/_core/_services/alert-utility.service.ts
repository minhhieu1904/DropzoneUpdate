import { Injectable } from '@angular/core';
import { SnotifyPosition, SnotifyService, SnotifyToastConfig } from 'ng-snotify';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertUtilityService {
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

  success(body: string, title: string, position: SnotifyPosition) {
    this.snotifyService.success(body, title, this.getConfig(position));
  }

  info(body: string, title: string, position: SnotifyPosition) {
    this.snotifyService.info(body, title, this.getConfig(position));
  }

  error(body: string, title: string, position: SnotifyPosition) {
    this.snotifyService.error(body, title, this.getConfig(position));
  }

  warning(body: string, title: string, position: SnotifyPosition) {
    this.snotifyService.warning(body, title, this.getConfig(position));
  }

  simple(body: string, title: string, position: SnotifyPosition) {
    // Custom icon
    const icon = `https://placehold.it/48x100`;

    this.snotifyService.simple(body, title, {
      ...this.getConfig(position),
      icon
    });
  }

  message(body: string, position: SnotifyPosition) {
    this.snotifyService.success(body, this.getConfig(position));
  }

  confirmDelete(body: string, position: SnotifyPosition, okCallback: () => any) {
    const { timeout, closeOnClick, ...config } = this.getConfig(position);
    this.snotifyService.confirm(body, {
      ...config,
      buttons: [
        {
          text: 'Yes',
          action: (toast) => {
            this.snotifyService.remove(toast.id);
            okCallback();
          },
          bold: true
        },
        {
          text: 'Cancle',
          action: toast => {
            this.snotifyService.remove(toast.id);
          }
        }
      ]
    });
  }

  html(position: SnotifyPosition) {
    const html = `<div class="snotifyToast__title"><b>Html Bold Title</b></div>
    <div class="snotifyToast__body"><i>Html</i> <b>toast</b> <u>content</u></div>`;
    this.snotifyService.html(html, this.getConfig(position));
  }

  clear() {
    this.snotifyService.clear();
  }

  asyncLoadingSuccess(body: string, success: string, position: SnotifyPosition) {
    const successAction = new Observable(observer => {
      setTimeout(() => {
        observer.next({
          body: 'Still loading.....'
        });
      }, 2000);

      setTimeout(() => {
        observer.next({
          title: success,
          body: 'Success',
          config: {
            closeOnClick: true,
            timeout: 3000,
            showProgressBar: true
          }
        });
        observer.complete();
      }, 3000);
    });

    const { timeout, ...config } = this.getConfig(position);
    this.snotifyService.async(body, successAction, config);
  }

  asyncLoadingError(body: string, error: string, position: SnotifyPosition) {
    const errorAction = new Observable(observer => {
      setTimeout(() => {
        observer.error({
          title: error,
          body: 'Error'
        });
      }, 2000);
    });

    const { timeout, ...config } = this.getConfig(position);
    this.snotifyService.async(body, errorAction, config);
  }
}

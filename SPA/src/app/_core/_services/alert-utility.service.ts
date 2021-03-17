import { Injectable } from '@angular/core';
import { SnotifyAnimate, SnotifyPosition, SnotifyService, SnotifyToastConfig, SnotifyType } from 'ng-snotify';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertUtilityService {
  constructor(
    private snotifyService: SnotifyService
  ) { }

  getConfig(position: SnotifyPosition): SnotifyToastConfig {
    if(position === undefined) {
      position = null;
    }
    this.snotifyService.setDefaults({
      global: {
        newOnTop: true,
        maxAtPosition: 8,
        maxOnScreen: 8,
        filterDuplicates: false
      }
    });
    return {
      bodyMaxLength: 50,
      titleMaxLength: 50,
      backdrop: -1,
      position: position === null ? SnotifyPosition.rightTop : position,
      timeout: 3000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    };
  }

  success(body: string, title: string, position?: SnotifyPosition) {
    this.snotifyService.success(body, title, this.getConfig(position));
  }

  info(body: string, title: string, position?: SnotifyPosition) {
    this.snotifyService.info(body, title, this.getConfig(position));
  }

  error(body: string, title: string, position?: SnotifyPosition) {
    this.snotifyService.error(body, title, this.getConfig(position));
  }

  warning(body: string, title: string, position?: SnotifyPosition) {
    this.snotifyService.warning(body, title, this.getConfig(position));
  }

  simple(body: string, title: string, position?: SnotifyPosition) {
    // Custom icon
    const icon = `https://placehold.it/48x100`;

    this.snotifyService.simple(body, title, {
      ...this.getConfig(position),
      icon
    });
  }

  message(body: string, position?: SnotifyPosition) {
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

  html(body: string, title: string, position?: SnotifyPosition, icon?: string) {
    const html = `<div class="snotifyToast__title"><b>${title}</b></div>
                  <div class="snotifyToast__body"><b>${body}</b></div>
                  <div class="snotify-icon ng-star-inserted">
                    <img src="${icon}" width='48px' heght='48px'/>
                  </div>`;
    this.snotifyService.html(html, this.getConfig(position));
  }

  htmlAnimation(body: string, title: string, position: SnotifyPosition, type: SnotifyType, animation: SnotifyAnimate, icon?: string) {
    if (icon === undefined || icon === null) {
      icon = '';
    }
    const html = `<div class="snotifyToast__title"><b>${title}</b></div>
                  <div class="snotifyToast__body"><b>${body}</b></div>
                  <div class="snotify-icon ng-star-inserted">
                    <img src="${icon}" width='48px' heght='48px'/>
                  </div>`;
    this.snotifyService.html(html, { ...this.getConfig(position), type, animation });
  }

  clear() {
    this.snotifyService.clear();
  }

  asyncLoadingSuccess(body: string, success: string, position?: SnotifyPosition) {
    const successAction = new Observable(observer => {
      setTimeout(() => {
        observer.next({
          body: 'Wating for love.....'
        });
      }, 2000);

      setTimeout(() => {
        observer.next({
          title: success,
          body: body,
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
    this.snotifyService.async('Still loading.....', successAction, config);
  }

  asyncLoadingError(body: string, error: string, position?: SnotifyPosition) {
    const errorAction = new Observable(observer => {
      setTimeout(() => {
        observer.next({
          body: 'Wating for love.....'
        });
      }, 2000);

      setTimeout(() => {
        observer.error({
          title: error,
          body: body,
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
    this.snotifyService.async('Still loading.....', errorAction, config);
  }
}
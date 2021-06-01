import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { commonPerFactory } from '../_utility/common-fer-factory';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: signalR.HubConnection;
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect([0, 10000, 20000, 30000])
      .withUrl(commonPerFactory.urlSignalR + '/loadData')
      .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        return true;
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        return false;
      });
  }
}

import { Injectable } from '@angular/core';
import * as io from "socket.io-client/dist/socket.io";
import {Router} from '@angular/router';

// import io from 'socket.io';


@Injectable()
//   providedIn: 'root'
// })
export class CorekService {
  socketHost: string = "https://v1.corek.io:8096";
  socket: any;
  server: any;
  constructor(private router:Router) { }

  public ConnectCorek(){
    this.socket = io.connect(this.socketHost,{'reconnection':false});
  }

  public ConnectCorekconfig(nf){
    this.socket = io.connect(this.socketHost,{'reconnection':true});
   
    this.socket.on('connection', (data)=>{
      this.socket.emit('conf', { 'project': 'http://wintowin.com','event':nf});
    });
  }
  
  public ipServer (){
    this.server = 'http://159.203.82.152/uploads/';
    return this.server;
  }

  public ConnectCorekconfig2(nf){
    this.socket = io.connect(this.socketHost,{'reconnection':true});// esto hace que se conecte al servidor (como cable directo)
    this.socket.on('connection', (data)=>{
      this.socket.emit('conf', { 'project': 'http://wintowinClient.com','event':nf});
    });
  }
}
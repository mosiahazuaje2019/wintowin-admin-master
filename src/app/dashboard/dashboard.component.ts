import { Component, OnInit, ViewChild } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { Chart } from 'chart.js';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  public bandera = 0;
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  users;
  trips;
  public heros: any;
constructor(public conf: AppComponent, public corek: CorekService) {
    // var intw = setInterval(() => {
    //   this.bandera = this.conf.returnedB();
    //   if (this.bandera == 1) {
    //     clearInterval(intw);
    //     this.process();
    //   }
    // }, 2000);
    this.process();
  }

  process(){
    console.log('proceso')
    const time = Date.now().toString()+"alkiw";
    this.conf.corek.socket.emit('query',{ querystring:"SELECT ID FROM `wp_users` WHERE `user_status` = 3" , key: time});
    this.conf.corek.socket.on("query", (data1 , key) => {
      console.log(data1);
      if(time == key){
        this.users = data1.length;
        console.log(data1);
        if(data1.error){
          this.reconectar();
        } else {
          this.conf.corek.socket.emit('get_users', { "condition": {'user_status':1}, 'event': time + 'get_user' });
          this.conf.corek.socket.on(time + 'get_user', (data2, key) => {
            this.heros = data2.length;
            this.conf.corek.socket.emit('query',{'event':time +"trips", 'querystring':"SELECT ID FROM `wp_posts` WHERE `post_type` = 'trips'"});
            this.conf.corek.socket.on(time + 'trips', (data3, key) => {
              console.log(data3)
              this.trips = data3.length;
              this.generateChart();
            });
          });
        }
      }
     
    });
  }

  ngOnInit() {
  }

  generateChart(){
    console.log('aqui');
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Hero", "Usuarios", "Viajes"],
        datasets: [{
          label: 'Número de usuarios',
          data: [this.heros,this.users,this.trips],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {display: false}, 
        title: {display: true, text:'Usuarios activados y viajes creados'},
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }  

  reconectar(){
    let time = Date.now().toString();
    this.corek.ConnectCorekconfig(time + "cone");
    this.corek.socket.on(time + "cone" , (d)=>{
        console.log(d);
        this.process();
    });
  }
}
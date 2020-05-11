import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  public bandera = 0;
  public items = [];
  public flag: any;
  public name : any;
  public lastName: any;
  public amount: any;
  public datePay: any;
  public dateFinish: any;
  public flag1: any;

  constructor(public router: Router, public conf: AppComponent, public corek: CorekService) {
    // var intw = setInterval(() => {
    //   this.bandera = this.conf.returnedB();
    //   if (this.bandera == 1) {
    //     clearInterval(intw);
    //     this.process();
    //   }
    // }, 2000);
    this.process();
  }
  
  ngOnInit() {
    // this.flag1 = 0;//loading
    console.log('loading');
  }

  process(){
    this.flag = 0;
    const time = Date.now().toString();
    this.corek.socket.emit('query',{'event':time + 'query', 'querystring':"SELECT * FROM `wp_posts` WHERE `post_type` LIKE 'transaction'",  key: time});
    this.corek.socket.on(time + "query",(data,key)=> {
      console.log(data);
      if(time == key){
        if (data.error){
          this.reconectar();
        } else {
          if(data.length > 0){
            for (let i in data){
              this.corek.socket.emit('query',{'event':time + 'queryInner' + i, 'querystring':"SELECT * FROM `wp_users` WHERE `ID` = "+data[i].post_author});
              this.corek.socket.on(time + "queryInner" + i,(result,key)=> {
                console.log(result);
                if(result.length > 0){
                  this.flag = true; // show if they paid
                  this.name = result[0].user_url;
                  this.lastName = result[0].user_nicename;
                  let idUser = result[0].ID;
                  let idTrans = data[i].ID; 
                  this.amount = data[i].post_content;
                  this.datePay = data[i].post_date;
                  this.dateFinish = data[i].post_date_gmt 
                  this.items.push({'idUser':idUser,'idTrans':idTrans,'name':this.name,'lastName':this.lastName, 'amount':this.amount,'datePay':this.datePay,'dateFinish':this.dateFinish}); 
                  
                }else{
                  console.log("nohay")
                  this.flag = false;
                }
                this.flag1 = 1; //loading no hace nada
                  // this.flag = 1; // show if not they paid
                  this.flag1 = 1;
                  this.bandera = 1;
              });
            }
          }else{
            this.flag = 1; // show if not they paid
            this.flag1 = 1;
            this.bandera = 1;
          }
        }
      }
    });
  }

  deleteTrasn(idTrans){
    let d = confirm("Al borrar este registro no podra ser recuperado. ¿Desea continuar?");
    if (d == true){
      const time = Date.now().toString();                                                                                
      this.corek.socket.emit('query',{'event':time +"deteletrans", 'querystring':"DELETE FROM `zadmin_wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+idTrans});
      alert('Eliminado');
      this.process();
    }
  }

  userDetails(idUser){
    this.router.navigate(['/detalles-usuario',idUser]);
  }

  reconectar(){
    let cf = Date.now().toString()+"halamadrid";
    this.corek.ConnectCorekconfig(cf);
    this.corek.socket.on(cf , (d)=>{
      console.log(d);
      this.bandera = 1;
      this.flag = 1;
      this.process();
    });
  }


  reconectar2(){
    let cf = Date.now().toString()+"halamadrid";
    this.corek.ConnectCorekconfig(cf);
    this.corek.socket.on(cf , (d)=>{
      console.log(d);
      this.bandera = 1;
      this.flag = 1;
    });
  }
}

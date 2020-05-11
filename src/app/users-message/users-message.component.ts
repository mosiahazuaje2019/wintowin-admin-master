import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { ChatComponent } from '../dialogs/chat/chat.component';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import { PagerService } from '../services/pager.service';

@Component({
  selector: 'app-users-message',
  templateUrl: './users-message.component.html',
  styleUrls: ['./users-message.component.scss']
})
export class UsersMessageComponent implements OnInit {
public bandera = 0;
pager: any = {};
private allItems: any[];
pagedItems: any[];
public flag: any;
constructor(public corek : CorekService, public conf: AppComponent, public dialog: MatDialog,  private pagerService: PagerService) {
  this.flag = 0;  
  // var intw = setInterval(() => { 
  //     this.bandera = this.conf.returnedB();
  //     console.log(this.bandera);
  //     if(this.bandera == 1){
  //       clearInterval(intw);
  //       this.prosess();
  //     }
  //    }, 2000);
  this.prosess();
   }
public items = [];

   prosess() {
    const time = Date.now().toString();
    this.corek.socket.emit('query',{'event':time + 'query1', 'querystring':"SELECT * FROM `wp_posts` WHERE `post_type` LIKE 'listMessage'",  key: time});
    this.corek.socket.on(time + "query1",(data1,key)=> {
      console.log(data1);
      if(time == key){
        if (data1.error){
          this.reconectar();
        } else {
          let array  = [];
          let dataDb;
          let x;
          let aux = [];
          for (let i in data1){
            let hour = new Date(data1[i].post_date);
            x = new Date(hour.setHours(hour.getHours() + 5))
            data1[i].post_date = x;
          }
          this.allItems = data1; 
          this.bandera = 1;
          this.setPage(1);
        }
      }
    });
    this.flag = 1;
   }

  ngOnInit() {
  }

  showDetails(id){
    console.log(id);
    const dialogRef = this.dialog.open(ChatComponent, {data:id});
    dialogRef.afterClosed().subscribe(result => {});
  }

  deleteMessage(data){
    let time = Date.now().toString();
    let d = confirm("Al borrar esta conversacion no podra ser recuperada. ¿Desea continuar?");
    if (d == true){
      this.corek.socket.emit('query',{'event':time + "del", 'querystring':"DELETE FROM `zadmin_wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+data.ID});
      this.prosess();
    }
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);
    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  reconectar(){
    let cf = Date.now().toString()+"halamadrid";
    this.corek.ConnectCorekconfig(cf);
    this.corek.socket.on(cf , (d)=>{
      console.log(d);
      this.bandera = 1;
      this.flag = 1;
      this.prosess();
    });
  }
}

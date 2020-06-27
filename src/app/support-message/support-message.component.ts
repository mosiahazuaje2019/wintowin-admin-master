import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { PagerService } from '../services/pager.service';

@Component({
  selector: 'app-support-message',
  templateUrl: './support-message.component.html',
  styleUrls: ['./support-message.component.scss']
})
export class SupportMessageComponent implements OnInit {
public items : any;
public bandera: any;
pager: any = {};
private allItems: any[];
pagedItems: any[];
flag=0;
  constructor(public conf: AppComponent, public router: Router, public corek : CorekService, private pagerService: PagerService) { 
    // let intw = setInterval(() => { 
    //   this.bandera = this.conf.returnedB();
    //   if(this.bandera == 1){
    //     clearInterval(intw);
    //     this.process();
    //   }
    //  }, 2000);
    this.process();
  }

  ngOnInit() {
  }
  
  process() {
    const time = Date.now().toString();
    this.conf.corek.socket.emit('query',{'event':time + 'query', 'querystring':"SELECT * FROM `wp_posts` WHERE `post_type` LIKE 'support'",key: time});
    this.conf.corek.socket.on(time + "query",(data,key)=> {
      if(time == key){
        if (data.error){
          this.reconectar();
        } else {
          this.items = data;
          this.allItems = this.items;
          console.log(this.allItems);
          this.setPage(1);
          this.bandera = 1;
        }
      }
    });
  }

  message(idUser){
    this.router.navigate(['/messages',idUser]);
  }
  
  delete(idPost){
    let d = confirm("Al borrar este mensaje no podra ser recuperado. ¿Desea continuar?");
    if (d == true){
      const time = Date.now().toString();                                                                              
      this.conf.corek.socket.emit('query',{'event':time +"detele_user", 'querystring':"DELETE FROM `wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+idPost});
      alert('eliminado');
      this.process();
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
      this.process();
    });
  }
}

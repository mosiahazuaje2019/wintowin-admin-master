import { Component, OnInit , ViewChild } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import {Router} from '@angular/router';
import { AppComponent } from '../app.component';
import { PagerService } from '../services/pager.service';
import { MatTableDataSource , MatPaginator , MatSort } from '@angular/material';
@Component({
  selector: 'app-history-travels',
  templateUrl: './history-travels.component.html',
  styleUrls: ['./history-travels.component.scss']
})
export class HistoryTravelsComponent implements OnInit {
  displayedColumns: string[] = ['ID','hero','fecha', 'origen', 'destino','usuarios','wins','option' ];
  dataSource;
  @ViewChild('pager') paginator: MatPaginator;
  public allTrips: any[];
  public id: any;
  public bandera = 0;
  public flag=0;
  private allItems: any[];
  private aux : any[];
  public wins : any[];
  public heros: any[];
  public cars : any[];
  public details_data;
pager: any = {};
// paged items
pagedItems: any[];
  constructor(public conf: AppComponent, public router: Router,public corek : CorekService ,  private pagerService: PagerService) { 
    this.id = localStorage.getItem('ID');
    this.flag = 0;  

    // var intw = setInterval(() => { 
    //   this.bandera = this.conf.returnedB();
    //   console.log(this.bandera);
    //   if(this.bandera == 1){
    //     clearInterval(intw);
    //     this.proceso();
    //   }
    //  }, 2000);
    this.proceso();
  }

  ngOnInit() {
  }

  proceso() {
    // this.bandera = 1;
    // this.flag = 1;
    const time  = Date.now().toString()+"via"+Math.random();
    console.log(time);
    this.corek.socket.emit('query',{'querystring':"SELECT `wp_posts`.`ID`, `wp_posts`.`post_title`, `wp_posts`.`post_author`, `wp_posts`.`post_date`, `wp_posts`.`post_content`, `wp_posts`.`post_password`, `wp_posts`.`post_name`, `wp_posts`.`to_ping`, `wp_posts`.`post_content_filtered`, `wp_posts`.`guid`, `wp_users`.`user_url`, `wp_users`.`user_nicename`, `wp_users`.`code_car`, `wp_users`.`display_name` FROM `wp_posts` INNER JOIN `wp_users` ON `wp_users`.`ID` = `wp_posts`.`post_author` WHERE `wp_posts`.`post_type` LIKE 'trips' ORDER BY ID DESC", key: time});
    this.corek.socket.on('query', (trips,key)=>{
      console.log(trips);
      let aux =[];
      if(time == key){
        if (trips.error){
          this.reconectar();
        } else {
          for (let trip of trips){
            // Origen/Destino
            if (trip.post_content) trip.post_content = JSON.parse(trip.post_content).name; 
            if (trip.post_password) trip.post_password = JSON.parse(trip.post_password).name;
            // Wins
            let wins = 0;
            if (trip.post_name) wins = wins + Math.round(JSON.parse(trip.post_name).distance);
            if (trip.post_content_filtered) wins = wins + Math.round(JSON.parse(trip.post_content_filtered).distance);
            if (trip.guid) wins = wins + Math.round(JSON.parse(trip.guid).distance);
            if (wins == 0) wins = trip.to_ping = Math.round(trip.to_ping);
            // Usuarios
            if (trip.post_name) trip.post_name = JSON.parse(trip.post_name).name;
            if (trip.post_content_filtered ) trip.post_content_filtered =  JSON.parse(trip.post_content_filtered).name;
            if (trip.guid) trip.guid = JSON.parse(trip.guid).name;
            // Carro
            if (trip.post_title) trip.post_title = JSON.parse(trip.post_title);
            aux.push({ID:trip.ID, fecha:trip.post_date, hero: trip.user_url + " "+trip.user_nicename, origen: trip.post_content , destino: trip.post_password , usuarios:[trip.post_name ,  trip.post_content_filtered , trip.guid ] , wins: wins,option:true});
          }
          console.log(trips)
          this.dataSource = new MatTableDataSource(aux);
          this.dataSource.paginator = this.paginator;
        }
      }
    });
    this.bandera = 1;
    this.flag = 1;
  }

  travelsDetails(trip){
    trip.post_title = trip.post_title.Modelo;
    this.router.navigate(['/detalles-viajes', trip]);
  }

  deleteTravel(trip){
    let d = confirm("Al borrar este viaje no podra ser recuperado. ¿Desea continuar?");
    if (d == true){
      let nf1 = Date.now().toString()+"delete_post"
      this.corek.socket.emit('query',{'event':nf1, 'querystring':"DELETE FROM wp_posts WHERE wp_posts.ID="+trip.ID});
      this.corek.socket.on(nf1, (dele)=>{
        this.proceso();
      });
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
      this.proceso();
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

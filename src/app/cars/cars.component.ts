import { Component, OnInit , ViewChild } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import {Router} from '@angular/router';
import { AppComponent } from '../app.component';
import { Pipe } from '@angular/core';
// import { PagerService } from '../services/pager.service';
import { MatTableDataSource , MatPaginator , MatSort } from '@angular/material';
@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})

export class CarsComponent implements OnInit {
  @ViewChild('pager') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public allCars: any[];
  public id: any;
  public flag = 0;
  public bandera = 0;
  private allItems: any[];
  public show:boolean = false;
  pager: any = {};
  // paged items
  pagedItems: any[];
  displayedColumns: string[] = ['position','ID','marca','linea', 'modelo', 'usuario','placa','estado','option' ];
  dataSource;
  
  
  constructor(public conf: AppComponent, public router: Router,public corek : CorekService ) {
    console.log(this.paginator)
    this.id = localStorage.getItem('ID');

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
  ngOnInit(){
  }

  proceso() {
    console.log("search cars");
    let aux =[];
    const time  = Date.now().toString()+"searchCars"+Math.random();
    this.corek.socket.emit("query_post" ,{condition:{'post_type':'cars'}, key: time});;
    this.corek.socket.on("query_post", (data,key)=>{
      console.log(data);
      if(time == key){
        if (data.error){
          this.reconectar();
        } else if (data.length > 0){
          this.allItems = data;
          let p = 1;
          for(let i of data){//avoid showing the administrator
            let gu =  Date.now().toString()+i.guid+"get_user";  
            this.corek.socket.emit("get_users" , {condition:{"ID":i.guid}, columns:"ID,user_url,user_nicename,user_activation_key", event: gu});
            this.corek.socket.on(gu, (dat)=>{
              if (dat.length > 0){
                switch (i.post_parent) {
                  case 0:
                    i.post_parent = 'Desactivado';
                  break;
                  case 1: 
                    i.post_parent = 'Activado';
                  break;
                }
                console.log(dat);
                aux.push({position:p, ID:i.ID,marca:i.pinged,linea:i.to_ping,modelo:i.post_excerpt,usuario:dat[0].user_url+' '+dat[0].user_nicename, idUser: dat[0].ID, placa:i.post_content_filtered,estado:i.post_parent, opciones:true, lugar: i.post_title, fecha:i.post_modified_gmt, grupo: i.post_status, soat:i.post_content, soat_back:i.ping_status, soat_date: i.post_date, propiedad:i.post_mime_type, propiedadB:i.property_back, rtm: i.post_password, rtm_date:i.post_date_gmt, poliza: i.post_name, poliza_date: i.post_modified});
                this.dataSource = new MatTableDataSource(aux);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                console.log(p, data.length)
                if (p == data.length){
                  this.show = true
                }
                p++;
              }
            });
          }
          this.flag = 1;
          this.bandera = 1;
          // this.setPage(1);
        }else{
          this.flag = 1;
          this.bandera = 1;
          this.show = true;
        }
      } else {
        console.log('a');
      }
    });
  }

  changeStatus(idUser){
    const time = Date.now().toString();
    this.corek.socket.emit('query_post',{"condition":{'ID':idUser},'event':time + 'get_post'});
    this.corek.socket.on(time + 'get_post', (data,key)=>{
      console.log(data);
      let carStatus = data[0].post_parent;
      let statusChange = this.checkStatus(carStatus);
      this.updateStatus(statusChange,idUser);
    });
  }

  updateStatus(status, idUser){
    const time = Date.now().toString();
    this.corek.socket.emit("update_post",{"set":{"post_parent":status},"condition":{"ID":idUser}, 'event':time + 'update_status'});
    this.proceso();
  }

  checkStatus(status){
    if(status == 1){
      status = 0;
    }else if (status == 0){
      status = 1;
    }
    return status;
  }

  activate(idUser){
    alert ('Carro Desactivado');
    this.changeStatus(idUser);
  }

  desactivate(idUser){
    alert ('Carro Activado');
    this.changeStatus(idUser);
  }
  
  deleteCar(idCar){
    let d = confirm("Al borrar este vehiculo no podra ser recuperado. ¿Desea continuar?");
    if (d == true){
      console.log(idCar);
      const time = Date.now().toString();                                                                                   
      this.corek.socket.emit('query',{'event':time +"detele_user", 'querystring':"DELETE FROM `wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+idCar});
      alert('eliminado');
      this.proceso();
    }
  }
  
  carDetails(car, hero){
    console.log(car);
    let data={id:car.ID,
    marca:car.marca, 
    linea:car.linea,
    modelo:car.modelo,
    placa: car.placa,
    usuario: car.idUser,
    lugar_matricula:car.lugar,
    fecha: car.fecha,
    grupo: car.grupo,
    soat:car.soat,
    soat_back:car.soat_back,
    soat_date: car.soat_date,
    propiedad:car.propiedad,
    propiedadB:car.propiedadB,
    rtm: car.rtm,
    rtm_date:car.rtm_date,
    poliza: car.poliza,
    poliza_date: car.poliza_date
    }
    console.log(data)
    this.router.navigate(['/detalles-carro', data]);
  }

  // setPage(page: number) {
  //   // get pager object from service
  //   this.pager = this.pagerService.getPager(this.allItems.length, page);
  //   // get current page of items
  //   this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  // }

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

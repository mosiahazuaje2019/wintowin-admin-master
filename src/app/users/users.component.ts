import { Component, OnInit , ViewChild} from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import {Router} from '@angular/router';
import { AppComponent } from '../app.component';
import { DialogComponent } from '../dialogs/create-user/dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
// import { Pipe } from '@angular/core';
import {MatTableDataSource , MatPaginator , MatDialog, MatSort } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
// @Pipe({name: 'safeHtml'})
export class UsersComponent implements OnInit {
  @ViewChild('pager') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  public allUser: any[];
  public id: any;
  public flag = 0;
  public status: any;
  public bandera = 0;
  private allItems: any[];
  pager: any = {};
  // paged items
  pagedItems: any[];
  displayedColumns: string[] = ['position','name', 'email', 'tlf', 'rol','option'];
  dataSource;
  constructor(public dialog: MatDialog, public conf: AppComponent , public router: Router, public corek : CorekService, private sanitizer:DomSanitizer) { 
    console.log(this.paginator);

    // let intw = setInterval(() => { 
    //   this.bandera = this.conf.returnedB();
    //   if(this.bandera == 1){
    //     clearInterval(intw);
    //     // this.proceso();
    //   }
    //  }, 2000);
    // this.dataSource.paginator = this.paginator;
    this.id = localStorage.getItem('ID');
    this.proceso();
  }

  ngOnInit() {
    console.log("loaded");
  }
  proceso(){
    this.flag = 0;
      console.log(this.id);
    const time = Date.now().toString() +'get_user';
    this.corek.socket.emit('get_users',{condition:{},columns : "user_url,ID,user_email,user_login,user_status" ,'event':time + 'get_user'});
    this.corek.socket.on(time + 'get_user', (data,key)=>{
      let aux =[];
      console.log(data);
      if(data.error){
        this.reconectar();
      }else{
        this.allItems = data;
        this.flag = 1;
        this.bandera =1;
        let j = 1;
        for(let i of data){//avoid showing the administrator
          if(i.ID != this.id){
            console.log(i);
            switch (i.user_status) {
              case 0:
                i.user_status = 'Usuario oferente desactivado';
              break;
              case 1:
                i.user_status = 'Oferente';
              break;
              case 2:
                i.user_status = 'Usuario cliente desactivado';
              break;
              case 3:
                i.user_status = 'Cliente';
              break;
              case 4:
                i.user_status = 'Oferente y cliente';
              break;
              case 6:
                i.user_status = 'Usuario ha espera de calificación';
              break;
            } 
            aux.push({ID:i.ID,position:j,name:i.user_url,email:i.user_email,tlf:i.user_login,rol:i.user_status});
            j++;
            console.log(this.paginator);
            console.log(this.sort)
            this.dataSource = new MatTableDataSource(aux);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
        this.flag = 1;
        
      }
    });
  }
  createUser(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  activate(idUser){
    alert('Usuario activado');
    this.changeStatus(idUser);
  }

  desactivate(idUser){
    alert ('Usuario desactivado')
    this.changeStatus(idUser);
  }

  checkStatus(status){
    if(status == 1 || status == 3){
      if(status == 1){
        status = 0;
      }else if(status == 3){
        status = 2;
      }
    }else if (status == 0 || status == 2){
      if(status == 0){
        status = 1;
      }else if(status == 2){
        status = 3;
      }
    }
    return status;
  }

  changeStatus(idUser){
    console.log("change"+idUser)
    const time = Date.now().toString() +'get_user';
    this.corek.socket.emit('get_users',{"condition":{'ID':idUser},'event':time + 'get_user'});
    this.corek.socket.on(time + 'get_user', (data,key)=>{
      console.log(data);
      let userStatus = data[0].user_status;
      let name = data[0].user_url;
      let mail = data[0].user_email;
      let statusChange = this.checkStatus(userStatus);
      this.updateStatus(statusChange,idUser, name,mail);
      this.proceso();
    });
  }

  updateStatus(status, idUser, name, mail){
    const time = Date.now().toString();
    this.corek.socket.emit("update_user",{"set":{"user_status":status},"condition":{"ID":idUser}, 'event':time + 'update_user'});
    this.corek.socket.emit('newpost',{'condition': {"ID":idUser, "status":status} , event:'close' + idUser, 'key':'close'});
    this.sendMail(name, mail);
  }

  userDetails(idUser){
    this.router.navigate(['/detalles-usuario',idUser]);
  }

  sendMail(name, email){
    console.log('sendMail');
    const time = Date.now().toString();
    let mail = '<div style="position:relative;min-width:320px;">'+
    '<div class="clearfix borderbox" style="z-index:1;min-height:535px;background-image:none;border-width:0px;border-color:#000000;background-color:transparent;padding-bottom:62px;width:100%;max-width:800px;margin-left:auto;margin-right:auto;">'+
    '<div class="clearfix colelem" style="z-index:2;background-color:#000000;position:relative;margin-right:-10000px;width:100%;">'+
    '<div class="grpelem"><div></div></div>'+
    '<div class="clearfix grpelem" style="z-index:4;min-height:17px;background-color:transparent;line-height:18px;color:#FFFFFF;font-size:15px;font-family:roboto, sans-serif;font-weight:300;position:relative;margin-right:-10000px;width:19.25%;left:7.13%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
    '<p>¡Hola '+name+'!</p></div></div>'+
    '<div class="colelem" style="z-index:3;height:133px;opacity:1;filter:alpha(opacity=100);margin-top:91px;position:relative;width:18.13%;margin-left:40.13%; background-size: contain;">'+
    '<img src="http://159.203.82.152/assets/logo.png" alt=""></div>'+
    '<div class="clearfix colelem" style="z-index:13;min-height:17px;background-color:transparent;line-height:22px;color:#000000;font-size:18px;font-family:roboto, sans-serif;font-weight:700;margin-top:78px;position:relative;width:46.13%;margin-left:26.13%;">'+
    '<p>¡FELICIDADES, HAS SIDO ACEPTADO!</p></div>'+
    '<div class="clearfix colelem" style="z-index:17;min-height:17px;background-color:transparent;line-height:22px;color:#000000;font-size:18px;font-family:roboto, sans-serif;font-weight:700;margin-top:77px;position:relative;width:46.13%;margin-left:26.13%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
    '<p>Ya puedes utilizar nuestra plataforma desde este momento… ¡Te esperamos!.</p></div>'+
    '<div class="clearfix colelem" style="background-color:#000000; height:48px; z-index:8;margin-top:111px;width:100%;">'+
    '<div class="grpelem" style="display:inline;float:left; z-index:8;background-color:#000000;position:relative;margin-right:-10000px;width:100%;">'+
    '<div class="fluid_height_spacer"></div></div><div class="clearfix grpelem" style="height: 17px; display:inline;float:left;z-index:9;min-height:17px;background-color:transparent;line-height:18px;color:#FFFFFF;font-size:15px;font-family:roboto, sans-serif;font-weight:300;position:relative;margin-right:-10000px;width:10%;left:43%; ">'+
    '<p>WIN to WIN</p></div></div>'+
    '<div class="clearfix colelem" style="z-index:21;min-height:17px;background-color:transparent;line-height:14px;color:#000000;font-size:12px;font-family:roboto, sans-serif;font-weight:300;margin-top:9px;position:relative;width:45.88%;margin-left:28.38%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
    '<p>¿Tienes dudas? Envíanos un mensaje a soporte@wintowin.co</p></div><div class="verticalspacer" data-offset-top="600" data-content-above-spacer="599" data-content-below-spacer="61" data-sizePolicy="fixed" data-pintopage="page_fixedLeft"></div>'
    +'</div></div>';
    this.corek.socket.emit('confsmtp',{'key':'confsmtp','token':8,'event':time + 'conf'});
    this.corek.socket.on(time + 'conf', (data, key)=>{
      if(key == 'confsmtp'){
        this.corek.socket.emit('sendemail',{'event':event,'key':'sendemail',
        'from':'"WinToWin" <info@dappvipaccess.com>',
        'to':email,
        'subject':'Activación de usuario.',
        'html':mail
        });    
      }
    });
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

  deleteUser(idUser){
    let d = confirm("Al borrar este usuario no podra ser recuperado. ¿Desea continuar?");
    if (d == true){ 
      const time = Date.now().toString();                                                                                
      this.conf.corek.socket.emit('query',{'event':time +"detele_user", 'querystring':"DELETE FROM `wintowin`.`wp_users` WHERE `wp_users`.`ID` = "+idUser});
      this.conf.corek.socket.emit('query',{'event':time +"detele_user_meta", 'querystring':"DELETE FROM wp_usermeta WHERE wp_usermeta.user_id = "+idUser});
      this.conf.corek.socket.emit('query',{'event':time +"delete_car", 'querystring':"DELETE FROM `wp_posts` WHERE `guid` = "+idUser});
      this.conf.corek.socket.on(time +"detele_user_meta", (response)=>{
        console.log(response);
        alert('usuario eliminado');
        this.proceso();
      });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // ngAfterViewInit() {
  //   console.log("after");
  //   console.log(this.paginator);
  //   this.paginator =

  //   this.dataSource.paginator = this.paginator;
  //   // this.dataSource.sort = this.sort;
  //   console.log(this.paginator);
  // }
}
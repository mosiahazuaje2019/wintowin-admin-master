import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { SoatComponent } from '../dialogs/photos-cars/soat/soat.component';
import {MatDialog} from '@angular/material/dialog';
import { PhotosSecurityComponent } from '../dialogs/photos-cars/photos-security/photos-security.component';
import { TecnomecanicaComponent } from '../dialogs/photos-cars/tecnomecanica/tecnomecanica.component';
import { PropiedadComponent } from '../dialogs/photos-cars/propiedad/propiedad.component';
import { SoatBackComponent } from '../dialogs/photos-cars/soat-back/soat-back.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-details-car',
  templateUrl: './details-car.component.html',
  styleUrls: ['./details-car.component.scss']
})
export class DetailsCarComponent implements OnInit {
public car_id:any;
public estado: any;
public marca: any;
public linea: any;
public modelo: any;
public placa: any;
public lugar_matricula: any;
public fecha: any;
public id_usuario: any;
public usuario: any;
public wins: any;
public code_grupo: any;
public grupo: any;
public soat: any;
public soat_back: any;
public soat_date: any;
public poliza: any;
public poliza_date: any;
public rtm: any;
public rmt_date: any;
public propieda: any;
public propiedadB: any;
public bandera = 0;
public form: FormGroup;
public flag=0;
public server;

  constructor(public router: Router, public dialog: MatDialog,private formBuilder: FormBuilder, public conf: AppComponent, public corek : CorekService, private route: ActivatedRoute) { 
    this.car_id = this.route.snapshot.paramMap.get('id');
    this.marca =this.route.snapshot.paramMap.get('marca');
    this.linea =this.route.snapshot.paramMap.get('linea');
    this.modelo =this.route.snapshot.paramMap.get('modelo');
    this.placa =this.route.snapshot.paramMap.get('placa');
    this.lugar_matricula = this.route.snapshot.paramMap.get('lugar_matricula');
    this.fecha = this.route.snapshot.paramMap.get('fecha');
    this.id_usuario =this.route.snapshot.paramMap.get('usuario');
    this.code_grupo =this.route.snapshot.paramMap.get('grupo');
    this.soat = this.route.snapshot.paramMap.get('soat');
    this.soat_back = this.route.snapshot.paramMap.get('soat_back');
    this.soat_date = this.route.snapshot.paramMap.get('soat_date');
    console.log(this.route.snapshot.paramMap.get('soat_date'), this.route.snapshot.paramMap.get('rtm_date'), this.route.snapshot.paramMap.get('poliza_date'))
    this.propieda = this.route.snapshot.paramMap.get('propiedad');
    this.propiedadB = this.route.snapshot.paramMap.get('propiedadB');
    this.rtm = this.route.snapshot.paramMap.get('rtm');
    this.rmt_date = this.route.snapshot.paramMap.get('rtm_date');
    this.poliza = this.route.snapshot.paramMap.get('poliza');
    this.poliza_date = this.route.snapshot.paramMap.get('poliza_date');
    this.estado = "Espere"
    this.form = formBuilder.group({
      newMarca: [this.marca, [Validators.required]],
      newLinea: [this.linea, [Validators.required]],
      newModelo: [this.modelo, [Validators.required]],
      newPlaca: [this.placa, [Validators.required]],
      newLugar: [this.lugar_matricula, [Validators.required]]
     });
    
    var intw = setInterval(() => { 
      this.bandera = this.conf.returnedB();
      if(this.bandera == 1){
        clearInterval(intw);
        this.process();
      } 
     }, 2000);
  }

  ngOnInit() {
    
  }

  process(){
    this.server = this.corek.ipServer();
    this.grupo = [];
    let gc = Date.now().toString()+"get_cars"+Math.random();
    this.conf.corek.socket.emit("query_post", {condition:{'post_type':'cars', "ID":this.car_id}, columns: 'post_parent',event : gc});
    this.conf.corek.socket.on(gc, (car)=>{
      if (car[0].post_parent == 1){
        this.estado = 'Activado';
      }else{
        this.estado = 'Desactivado';
      }
    });
    let gu =  Date.now().toString()+"get_user";  
    this.conf.corek.socket.emit("get_users", {condition:{"ID":this.id_usuario}, columns:"user_url,user_nicename,wallet", event: gu});
    this.conf.corek.socket.on(gu, (user)=>{
      this.usuario = user[0].user_url+" "+user[0].user_nicename;
      this.wins = user[0].wallet;
      let group=  Date.now().toString()+"get_group";
      this.conf.corek.socket.emit("get_users", {condition:{"user_activation_key":this.code_grupo}, columns:"user_url,user_nicename", event: group});
      this.conf.corek.socket.on(group, (grupo)=>{
        for (let gr of grupo){
          this.grupo.push(gr.user_url+" "+gr.user_nicename);
        }
      });
    });
  }

  // *********** Dialogs ***************

  photoSoat(){
    console.log(this.soat_date, this.poliza_date, this.rmt_date)
    const dialogRef = this.dialog.open(SoatBackComponent, {data:{'photo':this.soat, 'date':this.soat_date}});
  
    dialogRef.afterClosed().subscribe(result => {});
  }

  photoSoatBack(){
    const dialogRef = this.dialog.open(SoatBackComponent, {data:{'photo':this.soat_back, 'date':this.soat_date}});
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  photoSecurity(){
    const dialogRef = this.dialog.open(SoatBackComponent, {data:{'photo':this.poliza, 'date':this.poliza_date}});
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  tenomecanica(){
    const dialogRef = this.dialog.open(SoatBackComponent, {data:{'photo':this.rtm, 'date':this.rmt_date}});
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  propiedad(){
    const dialogRef = this.dialog.open(SoatBackComponent, {data:{'photo':this.propieda}});
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  propiedadBack(){
    const dialogRef = this.dialog.open(SoatBackComponent, {data:{'photo':this.propiedadB}});
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  // *********** end Dialogs ***************

  updateCar(){
    if (this.placa == this.form.value.newPlaca){
      let update_car = {
        'post_title': this.form.value.newLugar,
        'post_excerpt': this.form.value.newModelo,
        'to_ping': this.form.value.newLinea,
        'pinged': this.form.value.newMarca, 
        'post_content_filtered': this.form.value.newPlaca,
      }
  
      const update= Date.now().toString()+"updateCar";
      this.conf.corek.socket.emit("update_post",{"set":update_car,"condition":{'post_type':'cars','ID':this.car_id}, 'event':update}); 
      this.conf.corek.socket.on(update, (insert,key)=>{
        alert('Vehiculo actualizado');
        this.router.navigate(['/cars']);
      });
    }else{
      const time = Date.now().toString()+"searchCars";
      this.conf.corek.socket.emit("query_post" ,{condition:{'post_type':'cars', 'post_content_filtered':this.form.value.newPlaca}, columns: "ID", event : time});;
      this.conf.corek.socket.on(time, (data,key)=>{
        if (data.length > 0){
          alert('La placa '+this.form.value.newPlaca+' ya existe');
        }else{
          let update_car = {
            'post_title': this.form.value.newLugar,
            'post_excerpt': this.form.value.newModelo,
            'to_ping': this.form.value.newLinea,
            'pinged': this.form.value.newMarca, 
            'post_content_filtered': this.form.value.newPlaca,
          }
          const update= Date.now().toString()+"updateCar";
          this.conf.corek.socket.emit("update_post",{"set":update_car,"condition":{'post_type':'cars','ID':this.car_id}, 'event':update}); 
          this.conf.corek.socket.on(update, (insert,key)=>{
            alert('Vehiculo actualizado');
            this.router.navigate(['/cars']);
          });
        }
      });
    }

  }

  updateSatatus(){
    let update= Date.now().toString()+"updateStatus"+Math.random();
    if (this.estado == 'Activado'){
      this.estado = 'Desactivado';
      this.conf.corek.socket.emit("update_post",{"set":{'post_parent':0}, "condition":{'post_type':'cars','ID':this.car_id}, 'event':update}); 
    }else{
      this.estado = 'Activado';
      this.conf.corek.socket.emit("update_post",{"set":{'post_parent':1}, "condition":{'post_type':'cars','ID':this.car_id}, 'event':update});
    }
  }

  // changeStatus(){ 
  //   if(this.status == 1 || this.status == 3){
  //    this.contentSts = 'Desactivado';
  //    if(this.status == 1){
  //     this.status = 0;
  //    }else if(this.status == 3){
  //     this.status = 2;
  //    }
  //   }else if (this.status == 0 || this.status == 2){
  //    this.contentSts = 'Activado';
  //    if(this.status == 0){
  //     this.status = 1;
  //    }else if(this.status == 2){
  //     this.status = 3;
  //    }
  //   }
  //   return this.status;
  // }

  // checkStatus(){
  //   if(this.status == 1 || this.status == 3) {
  //    this.contentSts = 'Activado';
  //   }else{
  //    this.contentSts = 'Desactivado';
  //   }
  //   return this.status;
  //  }

  // getUser(){
  //   const time = Date.now().toString() +'get_user';
  //   this.conf.corek.socket.emit('get_users',{"condition":{'code_car':this.idCar},'event':time + 'get_user'});
  //   this.conf.corek.socket.on(time + 'get_user', (data,key)=>{
  //     console.log(data[0]);
  //     this.nameOwn = data[0].user_nicename;
  //     this.lastNameOwn = data[0].user_url;
  //     this.flag = 1;
  //   });
  // }

  // updatePost(){
  //   const time = Date.now().toString();
  //   this.conf.corek.socket.emit('query_post', { 'condition': { 'comment_status':this.idCar}, 'event':time + 'get_car'} );
  //   this.conf.corek.socket.on(time + 'get_car' , (data)=>{
  //     let idPost = data[0].ID;
  //     this.corek.socket.emit("update_post",{"set":{"to_ping":this.form.value.newLine},"condition":{'ID':idPost}, 'event':time + 'updatePost'});
  //   });
  // }

  // updateStatus(x){
  //   const time = Date.now().toString();
  //   this.conf.corek.socket.emit('query_post', { 'condition': { 'comment_status':this.idCar}, 'event':time + 'get_car'} );
  //   this.conf.corek.socket.on(time + 'get_car' , (data)=>{
  //     let idPost = data[0].ID;
  //     this.corek.socket.emit("update_post",{"set":{"post_parent":x},"condition":{'ID':idPost}, 'event':time + 'update'});
  //   });
  // }

  // keyDownFunction(event) {
  //   if(event.keyCode == 13) {
  //    this.save();
  //   }
  // }

  // save(){
  //   let status = this.checkStatus();
  //   console.log(status);
  //   this.updateStatus(status);
  //   this.updatePost();
  //   alert ('Datos guardados');
  // }
}

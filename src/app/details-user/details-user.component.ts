import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CorekService } from '../services/corek/corek.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { AppComponent } from '../app.component';
import {MatDialog} from '@angular/material/dialog';
import { PhotosUsersComponent } from '../dialogs/photos-users/photos-users.component';
import { PhotoLicComponent } from '../dialogs/photo-lic/photo-lic.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';


@Component({
 selector: 'app-details-user',
 templateUrl: './details-user.component.html',
 styleUrls: ['./details-user.component.scss']
})
export class DetailsUserComponent implements OnInit {
 public idUser: any;
 public img: any;
 public name: any;
 public lastName: any;
 public status: any;
 public numDocument: any;
 public photo_identification: any;
 public photo_identificationBack: any;
 public photo_license: any;
 public photo_licenseBack: any;
 public mail: any;
 public emailCorp1: any;
 public emailCorp2: any;
 public fechaRecor: any;
 public dateRecord: any;
 public phone: any;
 public contentSts: any;
 public flag=0;
 public statusLicence: any;
 public getJ: any;
 public getJ1: any;
 public contentLic: any;
 public bandera = 0;
 public form: FormGroup;
 public showLic = 0;
 public wallet: any;
 public codeGroup: any;
 public listBene =[];
 public server;
 public rol: string;
 public flag5: boolean = false;
 horizontalPosition: MatSnackBarHorizontalPosition = 'center';
 verticalPosition: MatSnackBarVerticalPosition = 'bottom';
 constructor(public snackBar: MatSnackBar, public dialog: MatDialog, public conf: AppComponent, public router: Router,private formBuilder: FormBuilder,public corek : CorekService, private route: ActivatedRoute) { 
  this.idUser=this.route.snapshot.paramMap.get('id');

  var intw = setInterval(() => { 
    this.bandera = this.conf.returnedB();
    if(this.bandera == 1){
      clearInterval(intw);
      this.process();
    }
   }, 2000);
  
  this.form = formBuilder.group({
   email: ['', [Validators.email]],
   emailCorp1: ['', [Validators.email]],
   emailCorp2: ['', [Validators.email]],
   phone: [''],
   wallet: ['']
  });
 }
 
 ngOnInit(){

 }

 process() {
  this.server = this.corek.ipServer();
  sessionStorage.setItem('idU', this.idUser);
  const time = Date.now().toString();
  this.conf.corek.socket.emit('get_users',{"condition":{'ID':this.idUser},'event':time + 'get_user'});
  this.conf.corek.socket.on(time + 'get_user', (data,key)=>{
   this.codeGroup = data[0].user_activation_key;
   this.img = data[0].display_name;
   this.lastName = data[0].user_nicename;
   this.name = data[0].user_url;
   this.status = data[0].user_status;
   this.mail = data[0].user_email;
   this.phone = data[0].user_login;
   this.dateRecord =data[0].user_registered;
   this.wallet = data[0].wallet;
   let aux = data[0].user_status;
   if ( aux == 1 ) {
    this.rol = "Oferente";
   } else {
    this.rol = "Cliente"
   }
  
   if (data[0].user_status == 1 || data[0].user_status == 3){
    this.contentSts = 'Activado';
  }else{
    this.contentSts = 'Desactivado';
  }
   this.showPhotoLic();
   this.getMeta();   
   this.groupBene();
  });
 }

 showPhotoLic(){
  if(this.status == 1 || this.status == 0){
     this.showLic = 1;
  }else{
    this.showLic = 0;
  }
}

 getMeta(){
  let getJson;
  const time = Date.now().toString();
  this.conf.corek.socket.emit('get_user_meta',{"condition":{"user_id":this.idUser}, 'event':time + "getMeta"});
  this.conf.corek.socket.on(time + "getMeta",(data,key)=> {
    console.log(data);
   for(let i of data){
    if(i.meta_key == "identification"){
     getJson = JSON.parse(i.meta_value);
     console.log(getJson)
     this.numDocument = getJson.number;
     this.photo_identification = getJson.photo;
     this.photo_identificationBack = getJson.photoB;
    }

    if(i.meta_key == "emails"){
     getJson = JSON.parse(i.meta_value);
     this.getJ1 = JSON.parse(i.meta_value);
     this.emailCorp1 = getJson.mail1;
     this.emailCorp2 = getJson.mail2;
    }

    if ( i.meta_key == "status" ) {
      this.statusLicence = parseInt(i.meta_value);
      this.getJ = this.statusLicence;
      this.checkStatusLicense(this.statusLicence);
    }

    if(i.meta_key == "license"){
     getJson = JSON.parse(i.meta_value);
     this.statusLicence = getJson.status;
     this.getJ = JSON.parse(i.meta_value);
     this.photo_license = getJson.photo_lice;
     this.photo_licenseBack = getJson.photo_liceBack
     this.checkStatusLicense(this.statusLicence);
    }
   }

   this.flag = 1;
  });
 }

 checkStatusLicense(statusLic){
  if(statusLic == 1) {
  this.contentLic = 'Aprobado';
  }else{
  this.contentLic = 'Desaprobado';
  }
  return this.contentLic;
}

  changeStatusLicences(){
    let time = Date.now().toString()+"get_licence"+Math.random();
    if (typeof this.getJ == 'object'){
      if(this.getJ.status == 1){
        this.contentLic = 'Desaprobado';
        this.getJ.status = 0;
      }else {
        this.getJ.status = 1;
        this.contentLic = 'Aprobado';
      }
      this.conf.corek.socket.emit('query',{'event':time + 'query', 'querystring':"UPDATE wp_usermeta SET meta_value= '"+JSON.stringify(this.getJ)+"' WHERE meta_key="+'"license"'+' AND user_id="'+this.idUser+'"'});
    }else {
      if(this.getJ == 1){
        this.getJ = 0;
        this.contentLic = 'Desaprobado';
      }else{
        this.getJ = 1;
        this.contentLic = 'Aprobado';
      }
      this.conf.corek.socket.emit('query',{'event':time + 'query', 'querystring':"UPDATE wp_usermeta SET meta_value= '"+this.getJ+"' WHERE meta_key="+'"status"'+' AND user_id="'+this.idUser+'"'});
    }
  }

 groupBene(){
  const time = Date.now().toString();
  this.conf.corek.socket.emit('get_users',{"condition":{'user_activation_key':this.codeGroup},'event':time + 'getGroup1'});
  this.conf.corek.socket.on(time + 'getGroup1', (dt,key)=>{
    console.log(dt);
    console.log(this.idUser)
    for(let i in dt){
      if (this.idUser != dt[i].ID){
        this.listBene.push({'idUser':dt[i].ID,'name':dt[i].user_url, 'lastName':dt[i].user_nicename});
      }
    }
  });
 }

  photoDocId(data: any): void {
    let dialogRef;
    if (data == true){
      dialogRef = this.dialog.open(PhotosUsersComponent, {data:this.photo_identification});
    }else{
      dialogRef = this.dialog.open(PhotosUsersComponent, {data:this.photo_identificationBack});
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  photoLic(data: any): void {
    let dialogRef;
    if (data == true){
      dialogRef = this.dialog.open(PhotoLicComponent, {data:this.photo_license});
    }else{
      console.log()
      dialogRef = this.dialog.open(PhotoLicComponent, {data:this.photo_licenseBack});
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

 //changes
 
  changeStatus(){
    let update= Date.now().toString()+"updateStatus"+Math.random();
    if (this.contentSts == 'Activado'){
      this.contentSts = 'Desactivado';
      if (this.status == 1){
        this.conf.corek.socket.emit("update_user",{"set":{"user_status":0},"condition":{"ID":this.idUser}, 'event':update});
      }else if(this.status == 3){
        this.conf.corek.socket.emit("update_user",{"set":{"user_status":2},"condition":{"ID":this.idUser}, 'event':update});
      }
    }else{
      this.contentSts = 'Activado';
      if (this.status == 0){
        this.conf.corek.socket.emit("update_user",{"set":{"user_status":1},"condition":{"ID":this.idUser}, 'event':update});
      }else if(this.status == 2){
        this.conf.corek.socket.emit("update_user",{"set":{"user_status":3},"condition":{"ID":this.idUser}, 'event':update});
      }
    }
  }

  updateEmail(){
    const time = Date.now().toString();
    if(this.form.value.email == '' || this.form.value.email == undefined || this.form.value.email == null){    
    }else{
      this.corek.socket.emit('get_users', {'event': time + 'getUser','key':'validemail','condition':{'user_email': this.form.value.email}}); 
      this.corek.socket.on(time + 'getUser', (data, key)=>{
        if(data.length > 0){
          
        }else{
          this.conf.corek.socket.emit("update_user",{"set":{"user_email":this.form.value.email},"condition":{"ID":this.idUser}, 'event':time + 'update_user0'});
        }
      });
    }
  }
  
  changeDataUser(){
    const time = Date.now().toString();
    this.updateEmail();
    if(this.form.value.phone != '' && this.form.value.phone != undefined && this.form.value.phone != null){
    this.conf.corek.socket.emit("update_user",{"set":{"user_login":this.form.value.phone},"condition":{"ID":this.idUser}, 'event':time + 'update_user'});
    }
    if(this.form.value.wallet != '' && this.form.value.wallet != undefined && this.form.value.wallet != null){
      this.conf.corek.socket.emit('query',{'event':time + 'update_userWalle', 'querystring':"UPDATE `wintowin`.`wp_users` SET `wallet` = "+this.form.value.wallet+" WHERE `wp_users`.`user_activation_key` LIKE '"+this.codeGroup+"'"});
    }
    if(this.form.value.emailCorp1 != '' && this.form.value.emailCorp1 != undefined && this.form.value.emailCorp1 != null){
      this.getJ1.mail1 = this.form.value.emailCorp1;
      this.conf.corek.socket.emit('query',{'event':time + 'queryE1', 'querystring':"UPDATE wp_usermeta SET meta_value= '"+JSON.stringify(this.getJ1)+"' WHERE meta_key="+'"emails"'+' AND user_id="'+this.idUser+'"'});
    }
    if(this.form.value.emailCorp2 != '' && this.form.value.emailCorp2 != undefined && this.form.value.emailCorp2 != null){
      this.getJ1.mail2 = this.form.value.emailCorp2;
      this.conf.corek.socket.emit('query',{'event':time + 'queryE2', 'querystring':"UPDATE wp_usermeta SET meta_value= '"+JSON.stringify(this.getJ1)+"' WHERE meta_key="+'"emails"'+' AND user_id="'+this.idUser+'"'});
    }
  }

 keyDownFunction(event) {
  if(event.keyCode == 13) {
   this.save();
  }
 }

 detail(idUser){
  console.log(idUser);
  this.router.navigate(['/detalles-usuario',idUser]);
  this.process();
 }

 //End other functions
 save(){
  const time = Date.now().toString();
  this.corek.socket.emit('get_users', {'event': time + 'getUser','key':'validemail','condition':{'user_email': this.form.value.email}}); 
  this.corek.socket.on(time + 'getUser', (data, key)=>{
    if(data.length > 0){
      alert('El correo ya existe')
    } else {
      this.changeDataUser();//update data user
      alert('Datos guardados.');
      this.router.navigate(['/users']);
    }
  });
 }
}
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CorekService } from '../services/corek/corek.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialogs/create-user/dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { UpimagesService } from '../services/upimages-web/upimages.service';

@Component({
  selector: 'app-register-hero',
  templateUrl: './register-hero.component.html',
  styleUrls: ['./register-hero.component.scss']
})
export class RegisterHeroComponent implements OnInit {
  form: FormGroup;
  formEmails: FormGroup;
  public type: any;
  flag90;
  public NumDoc: any;
  public hide = true;
  public flag = false;
  public profilePhoto = "";
  public photoFront = "";
  public photoBack = "";
  public lic = "";
  public date : any;
  public flag1 = false;
  public flag3 : any;
  public flag4 : any;
  public file: any;
  public respuestaImagenEnviada;
  public adressPhoto = [];
  public message = [];
  public cont = 0;
  aux1;aux2;aux3;aux4
  constructor(private upImage: UpimagesService, public dialog: MatDialog,public router: Router, public corek : CorekService,fb: FormBuilder,public dialogRef: MatDialogRef<RegisterHeroComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    const time = Date.now().toString;
    this.corek.ConnectCorekconfig(time + 'cone');
    this.corek.socket.on(time + 'cone', (data, key) => {
      
    });
    this.form = fb.group({
      name: ['', [Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/)]],
      lastName: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/)]], 
      email: ['', [Validators.required, Validators.email]],
      pwd: ['',[Validators.required,Validators.minLength(8)]],
      phone: ['', [Validators.required]], 
    });

    this.formEmails = fb.group({
      mail1: ['', [Validators.email]],
      mail2: ['', [Validators.email]],
    });
  }
  ngOnInit() {
  }
  
  createUser(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(DialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }  
  
  save(){
    if( !this.validate_email(this.form.value.email) ){
      alert('Correo ingresado es incorrecto');
    }else{
      this.flag3 = 0;
      this.flag90 = 0;
      const time = Date.now().toString();
      this.corek.socket.emit('query',{'event':time + 'idens', 'querystring':"SELECT * FROM `wp_usermeta` WHERE `meta_key` LIKE 'identification'"});
      this.corek.socket.on(time + 'idens',(data,key)=> {
        console.log(data);
        for (let i in data){
          if(data[i].meta_value!="" && JSON.parse(data[i].meta_value).number == this.NumDoc){
            this.flag90 = 1;
          }
        }
        if ( this.flag90 == 1 ) {
          alert('El documento que intentas agregar ya existe.');
          this.dialogRef.close();
        } else {
      this.corek.socket.emit('get_users',{"condition":{'user_email':this.form.value.email},'event':time + 'get_user'});
      this.corek.socket.on(time + 'get_user', (data,key)=>{
        if(data.length > 0){
          this.flag3 = 1;
          alert('Usuario ya existe');
          this.dialogRef.close();
        }else{
          this.flag1 = true;
          let newDateFinish = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();
          const tomorrow = new Date();
          let xd =  tomorrow.getDate();
          let xm =  tomorrow.getUTCMonth();
          let xy =  tomorrow.getFullYear();
          xm = xm + 1
          let formatDate = xy + "-" + xm +"-"+ xd;

          
          let code_user = this.uuidv4();
          this.corek.socket.emit('get_users',{"condition":{}, 'event':time + 'gusr'});
          this.corek.socket.on(time + 'gusr', (data2,key)=>{
            for (let i in data2){
              if(data2[i].user_activation_key == code_user){
                code_user = this.uuidv4();
              }
            }
            this.flag3 = 0;

            let dataUser = {'insert' : {
              'user_email': this.form.value.email,
              'user_pass': this.form.value.pwd,
              'user_url': this.form.value.name,
              'user_nicename': this.form.value.lastName,
              'user_login': this.form.value.phone,
              'user_registered':formatDate,
              'display_name':this.adressPhoto[0],
              'user_status': 0,
              'user_activation_key':code_user,
              'wallet':100
              },
              'event':time + 'insert'
            }
            
            let identity = {'type': this.type, 'number': this.NumDoc, 'photo': this.adressPhoto[1], 'photoB':this.adressPhoto[2]};
            let license = {'date': newDateFinish, 'photo_lice': this.adressPhoto[3], 'photo_liceBack': this.adressPhoto[4],'status':0};
            let metaEmails = {'mail1':this.formEmails.value.mail1, 'mail2': this.formEmails.value.mail2};                                      
            console.log(identity);
            console.log(license);
            console.log(metaEmails);  
            this.corek.socket.emit('insert_user',dataUser);
            this.corek.socket.on(time + 'insert' ,(d)=>{
              console.log(d.insertId);
              let user_id = d.insertId;
              this.corek.socket.emit('activate_user', {'iduser': user_id, 'key': 'activar','event':time + 'ac'});
              this.corek.socket.on(time + 'ac', (data, key) =>{
                if(key == "activar"){
                  this.corek.socket.emit('add_user_meta',{'insert':{'user_id':user_id, 'meta_key':'md5', 'meta_value':data.md5}, 'event':time+'md5'});
                  this.corek.socket.emit('add_user_meta',{'insert':{'user_id':user_id, 'meta_key':'identification', 'meta_value':JSON.stringify(identity)}, 'key':'tel', 'event':time + 'identification'});
                  this.corek.socket.emit('add_user_meta',{'insert':{'user_id':user_id, 'meta_key':'license', 'meta_value':JSON.stringify(license)}, 'key':'tel', 'event':time + 'license'});
                  this.corek.socket.emit('add_user_meta',{'insert':{'user_id':user_id, 'meta_key':'emails', 'meta_value':JSON.stringify(metaEmails)}, 'key':'tel', 'event':time + 'emails'});                
                  this.corek.socket.emit('add_user_meta',{'insert':{'user_id':user_id, 'meta_key':'community', 'meta_value':'[""]'}, 'key':'tel', 'event':time+'comu'});

                }
              });
            });
            alert('Usuario creado con exito.');
            this.flag3 = 1;
            this.dialogRef.close();
            this.router.navigate(["/"]);
          });
        }
      });
      }
    });
    }
  }

  uuidv4() {
    return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  validate_email( email ) {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  close(){
    this.dialogRef.close();
  }

  test(){
    this.flag = true;
  }

  upImg(files: FileList,x){
    console.log(this.cont);
    this.file = files[0];
    setTimeout(()=>{ 
      console.log(files[0]);
      this.upImage.postFileImagen(this.file).subscribe(
        response => {
          console.log(response);
          this.respuestaImagenEnviada = response; 
          if(this.respuestaImagenEnviada <= 1){
            console.log("Error en el servidor"); 
          }else{
            console.log(this.respuestaImagenEnviada);
            console.log(this.respuestaImagenEnviada.code);
            if(this.respuestaImagenEnviada.code == 200 && this.respuestaImagenEnviada.status == "success"){
              this.cont++; // esto no esta haciendo nada, se supone que era una validacion para el booton de guardar en la vista
              this.adressPhoto[x] = this.respuestaImagenEnviada.msj;            
              this.flag4 = 0;
            }else{
              this.message[x] = this.respuestaImagenEnviada.msj;
              this.flag4 = 1;
              this.file = '';
              this.cont--; // esto no esta haciendo nada, se supone que era una validacion para el booton de guardar en la vista
            }
          }
          console.log(this.cont);
        },
        error => {
          console.log(<any>error);
        }
      );//FIN DE METODO SUBSCRIBE
     }, 1000);
  }
  
  photoProfile(files: FileList){
    this.upImg(files, 0);
  } // esto no esta haciendo nada, se supone que era una validacion para el booton de guardar en la vista

  identiFront(files: FileList){
    this.aux2 = 1;
    this.upImg(files, 1);
  }

  identiBack(files: FileList){
    this.aux3 = 1;
    this.upImg(files, 2);
  }

  licen(files: FileList){
    this.aux4 = 1;
    this.upImg(files, 3);
  }

  licenBack(files: FileList){
    this.aux1 = 1;
    this.upImg(files, 4);
  }
}

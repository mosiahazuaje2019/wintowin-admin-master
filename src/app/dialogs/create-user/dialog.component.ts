import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, ErrorStateMatcher } from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { CorekService } from '../../services/corek/corek.service';
import {Router} from '@angular/router';
import { RegisterHeroComponent } from '../../register-hero/register-hero.component';
import { UpimagesService } from '../../services/upimages-web/upimages.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public respuestaImagenEnviada;
  form: FormGroup;
  formEmails: FormGroup;

  public type: any;
  public NumDoc: any;
  public user_id: any;
  public hide = true;
  public flag1 = false;
  public flag : any;
  public flag3 : any;
  public dataPhoto: any;
  public photoUp: any;
  public adressPhoto = [];
  public banderin: boolean;
  public file: any;
  public validate: any;
  public message: any;
  public cont = 0;
  public flag4 : any;
  aux1;
  aux2;
  email;
  matcher;
  constructor(private upImage: UpimagesService, public dialog: MatDialog,public router: Router, public corek : CorekService,fb: FormBuilder,public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    
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
      code: ['', [Validators.required]], 
    });
    
    this.formEmails = fb.group({
      mail1: ['', [Validators.email]],
      mail2: ['', [Validators.email]],
    });
    
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  ngOnInit() {
  }

  save(){
    const time = Date.now().toString();
    if( !this.validate_email(this.form.value.email) ){
      alert('Correo ingresado es incorrecto');
    }else{
      this.flag = 0;
      this.flag1 = true;
      this.corek.socket.emit('query',{'event':time + 'idens', 'querystring':"SELECT * FROM `wp_usermeta` WHERE `meta_key` LIKE 'identification'"});
      this.corek.socket.on(time + 'idens',(data,key)=> {
        console.log(data);
        for (let i in data){
          if(data[i].meta_value!="" && JSON.parse(data[i].meta_value).number == this.NumDoc){
            this.flag = 1;
          }
        }
        if ( this.flag == 1 ) {
          alert('El documento que intentas agregar ya existe.');
          this.dialogRef.close();
        } else {
          this.corek.socket.emit('get_users',{"condition":{'user_email':this.form.value.email},'event':time + 'get_user'});
          this.corek.socket.on(time + 'get_user', (data,key)=>{
            if(data.length > 0){
              this.flag = 1;
              alert('El correo ingresado ya existe');
              this.dialogRef.close();
            }else{
              this.corek.socket.emit('get_users', { 'condition': {"user_activation_key":this.form.value.code} , 'key': 'getCodeOfere', 'event': time + 'getCodeOfe'});
              this.corek.socket.on(time + 'getCodeOfe', (data1, key) => {
                if(data1.length == 0){
                  this.flag = 1;
                  this.dialogRef.close();
                  alert('El código ingresado no existe.');            
                }else{
                  let wallet = data1[0].wallet;
                  if(this.file == '' || this.file == null || this.file == undefined){
                    alert('Debe subir la imagen de la licencia.');
                    this.dialogRef.close();
                    this.flag = 1;
                  }else{
                    this.flag = 0;
                    // tomorrow.setDate();
                    const tomorrow = new Date();
                    let xd =  tomorrow.getDate();
                    let xm =  tomorrow.getUTCMonth();
                    let xy =  tomorrow.getFullYear();
                    xm = xm + 1
                    let formatDate = xy + "-" + xm +"-"+ xd; 
                    let dataUser = {'insert' : {
                      'user_email': this.form.value.email,
                      'user_pass': this.form.value.pwd,
                      'user_url': this.form.value.name,
                    'user_nicename': this.form.value.lastName,
                    'user_login': this.form.value.phone,
                    'user_registered':formatDate,
                    // 'display_name':this.dataPhoto,
                    'user_activation_key':this.form.value.code,
                    'user_status': 2,
                    'wallet':wallet
                  },
                  'event':time + 'insert'
                }
                let metaEmails = {'mail1':this.formEmails.value.mail1, 'mail2': this.formEmails.value.mail2};
                let metaIdentity = {'type': this.type, 'number': this.NumDoc, 'photo': this.adressPhoto[0], 'photoB':this.adressPhoto[1]};
                this.corek.socket.emit('insert_user',dataUser);
                this.corek.socket.on(time + 'insert', (result,key)=>{
                  this.user_id = result.insertId;
                  console.log(this.adressPhoto);                  
                    console.log(metaIdentity);
                    this.corek.socket.emit('add_user_meta',{'insert':{'user_id':this.user_id, 'meta_key':'identification', 'meta_value':JSON.stringify(metaIdentity)}, 'key':'iden', 'event':time + 'iden'});
                    this.corek.socket.emit('add_user_meta',{'insert':{'user_id':this.user_id, 'meta_key':'emails', 'meta_value':JSON.stringify(metaEmails)}, 'key':'ema', 'event':time + 'emails'}); 
                    this.corek.socket.emit('add_user_meta',{'insert':{'user_id':this.user_id, 'meta_key':'community', 'meta_value':'[""]'}, 'key':'tel', 'event':time+'comu'});
                    this.flag = 1;
                    alert('Datos guardados correctamente');
                    this.dialogRef.close();
                    this.router.navigate(["/"]);                  
                });                                                             
              }
            }
          });
            }
      });
        }
    });
    }
  }

  validate_email( email ) {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  close(){
    this.dialogRef.close();
  }

  createHero(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(RegisterHeroComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
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
              this.cont++;
              this.adressPhoto[x] = this.respuestaImagenEnviada.msj;            
              this.flag4 = 0;
            }else{
              this.message[x] = this.respuestaImagenEnviada.msj;
              this.flag4 = 1;
              this.file = '';
              this.cont--;
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

  identiFront(files: FileList){
    this.aux1 = 1;
    this.upImg(files, 0);
  }

  identiBack(files: FileList){
    this.aux2 = 1;
    this.upImg(files, 1);
  }

  // upImg(files: FileList){
  //   this.file = files[0];
  //   setTimeout(()=>{ 
  //     console.log(files[0]);
  //     this.upImage.postFileImagen(this.file).subscribe(
  //       response => {
  //         console.log(response);
  //         this.respuestaImagenEnviada = response; 
  //         if(this.respuestaImagenEnviada <= 1){
  //           console.log("Error en el servidor"); 
  //         }else{
  //           console.log(this.respuestaImagenEnviada);
  //           console.log(this.respuestaImagenEnviada.code);
  //           if(this.respuestaImagenEnviada.code == 200 && this.respuestaImagenEnviada.status == "success"){
  //             this.adressPhoto = this.respuestaImagenEnviada.msj;
  //             this.respuestaImagenEnviada.dir;
  //             console.log(this.adressPhoto);
  //             this.flag3 = 0;
  //           }else{
  //             this.message = this.respuestaImagenEnviada.msj;
  //             this.flag3 = 1;
  //             this.file = '';
  //           }
  //         }
  //       },
  //       error => {
  //         console.log(<any>error);
  //       }
  
  //     );//FIN DE METODO SUBSCRIBE
  //    }, 1000);
	// }
}

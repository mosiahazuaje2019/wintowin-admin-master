import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../services/corek/corek.service';
import {Router} from '@angular/router';
import { UpimagesService } from '../../services/upimages-web/upimages.service';

@Component({
  selector: 'app-change-photo',
  templateUrl: './change-photo.component.html',
  styleUrls: ['./change-photo.component.scss']
})
export class ChangePhotoComponent implements OnInit {
public id : any;
file;
server;
img;
wait;
public adressPhoto = [];
respuestaImagenEnviada;
message = [];
  constructor(private upImage: UpimagesService,public router: Router, public corek : CorekService,public dialogRef: MatDialogRef<ChangePhotoComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.id = localStorage.getItem("ID");
    this.server = this.corek.ipServer();

  }
  ngOnInit() {
    const time = Date.now().toString;
    this.corek.ConnectCorekconfig(time + 'cone');
    this.corek.socket.on(time + 'cone', (data, key) => {
      this.corek.socket.emit('get_users',{"condition":{'ID':this.id},'event':time + 'get_user'});
      this.corek.socket.on (time + 'get_user',(data)=>{
        console.log(data);
        this.img = data[0].display_name;
        console.log(this.img);
      });
    });
  }

  upImg(files: FileList){
    this.wait = "Espere ...";
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
              this.adressPhoto[0] = this.respuestaImagenEnviada.msj;  
              console.log(this.respuestaImagenEnviada.msj);
              console.log(this.id);
              const time = Date.now().toString();
              this.corek.socket.emit('query',{'querystring':"UPDATE `wintowin`.`wp_users` SET `display_name` = '"+this.respuestaImagenEnviada.msj+"' WHERE `wp_users`.`ID` = "+this.id});            
              this.corek.socket.on('query',(data)=>{
                console.log(data);
              })
              alert ('Imagen subida exitosamente');  
              this.dialogRef.close({url:this.server+this.img,img:this.img});
            }else{
              this.message[0] = this.respuestaImagenEnviada.msj;
              this.file = '';
            }
          }
        },
        error => {
          console.log(<any>error);
        }
      );//FIN DE METODO SUBSCRIBE
     }, 1000);
    // console.log(this.file);
}
    // this.file = event.target.files[0];
}

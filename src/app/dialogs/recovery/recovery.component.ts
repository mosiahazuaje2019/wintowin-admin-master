import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../services/corek/corek.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'Ingresa un correo.' :
        this.email.hasError('email') ? 'Ingresa un correo valido.' :
        '';
  }
  constructor(public corek : CorekService, public dialogRef: MatDialogRef<RecoveryComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
  
  }

  ngOnInit() {
  }
  
  send(){
    if( !this.validate_email(this.email.value) ){
      alert('Ingresa un correo valido.');
    }else{
      if(this.email.value == 'admin@pk.com'){
        alert('Enviamos un correo al administrador para recuperar la clave.');
        const time = Date.now().toString();
        this.corek.socket.emit('get_users', {'event': time + 'reco','key':'validemail','condition':{'user_email': this.email.value}}); 
        this.corek.socket.on(time + 'reco', (r , k)=>{
          console.log(r)
          let evt1 = Date.now().toString() + 'jdfgv';
          this.corek.socket.emit('get_user_meta', {'event': time + 'gu' ,'key':'validesfmail','condition':{'user_id': r[0].ID, 'meta_key':'md5'}}); 
          this.corek.socket.on(time + 'gu', (s , k)=>{
            let token = s[0].meta_value;  
            let mail = '<div style="position:relative;min-width:320px;">'+
            '<div class="clearfix borderbox" style="z-index:1;min-height:535px;background-image:none;border-width:0px;border-color:#000000;background-color:transparent;padding-bottom:62px;width:100%;max-width:800px;margin-left:auto;margin-right:auto;">'+
            '<div class="clearfix colelem" style="z-index:2;background-color:#000000;position:relative;margin-right:-10000px;width:100%;">'+
            '<div class="grpelem"><div></div></div>'+
            '<div class="clearfix grpelem" style="z-index:4;min-height:17px;background-color:transparent;line-height:18px;color:#FFFFFF;font-size:15px;font-family:roboto, sans-serif;font-weight:300;position:relative;margin-right:-10000px;width:19.25%;left:7.13%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
            '<p>¡Hola!</p></div></div>'+
            '<div class="colelem" style="z-index:3;height:133px;opacity:1;filter:alpha(opacity=100);margin-top:91px;position:relative;width:18.13%;margin-left:40.13%; background-size: contain;">'+
            '<img src="http://159.203.82.152/assets/logo.png" alt=""></div>'+
            '<div class="clearfix colelem" style="z-index:13;min-height:17px;background-color:transparent;line-height:22px;color:#000000;font-size:18px;font-family:roboto, sans-serif;font-weight:700;margin-top:78px;position:relative;width:46.13%;margin-left:26.13%;">'+
            '<p>Presiona el siguiente link para restablecer la clave del administrador wintowin.</p></div>'+
            '<a href="https://corek.io/app/Recover?token='+token+'&amp;p=http://wintowin.com">http://159.203.82.152/recovery.php?token='+token+'</a>'
            '<div class="clearfix colelem" style="z-index:17;min-height:17px;background-color:transparent;line-height:22px;color:#000000;font-size:18px;font-family:roboto, sans-serif;font-weight:700;margin-top:77px;position:relative;width:46.13%;margin-left:26.13%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
            '</div>'+
            '<div class="clearfix colelem" style="background-color:#000000; height:48px; z-index:8;margin-top:111px;width:100%;">'+
            '<div class="grpelem" style="display:inline;float:left; z-index:8;background-color:#000000;position:relative;margin-right:-10000px;width:100%;">'+
            '<div class="fluid_height_spacer"></div></div><div class="clearfix grpelem" style="height: 17px; display:inline;float:left;z-index:9;min-height:17px;background-color:transparent;line-height:18px;color:#FFFFFF;font-size:15px;font-family:roboto, sans-serif;font-weight:300;position:relative;margin-right:-10000px;width:10%;left:43%; ">'+
            '<p>WIN to WIN</p></div></div>'+
            '<div class="clearfix colelem" style="z-index:21;min-height:17px;background-color:transparent;line-height:14px;color:#000000;font-size:12px;font-family:roboto, sans-serif;font-weight:300;margin-top:9px;position:relative;width:45.88%;margin-left:28.38%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
            '<p>¿Tienes dudas? Envíanos un mensaje a soporte@wintowin.co</p></div><div class="verticalspacer" data-offset-top="600" data-content-above-spacer="599" data-content-below-spacer="61" data-sizePolicy="fixed" data-pintopage="page_fixedLeft"></div>'
            +'</div></div>';
  
            console.log(token);
            if(this.email.value == 'admin@pk.com'){
              let datarequest= {
                'email':'javc2804@gmail.com',
                'token':8,
              }
              const time = Date.now().toString();
                this.corek.socket.emit('confsmtp',{'event':time + 'i','key':'confsmtp','token':datarequest.token});
                this.corek.socket.on(time + 'i', (data, key)=>{
                  console.log(data);
                  if(key == "confsmtp"){
                    // console.log(this.x);
                    this.corek.socket.emit('sendemail',{'event':time + 'send','key':'sendemail',
                    'from':'"Source " <postmaster@mg.dappvipaccess.com>',
                    'to':'javc2804@gmail.com',
                    'subject':'Source : Password Recover',
                    'html':mail
                    });    
                      this.corek.socket.on(time + 'send', (data1 , key)=>{
                        console.log(data1);
                    }); 
                  } 
                });
            }
          });
        });
      }else{
        alert('el correo que escribio no corresponde al del administrador');
      }
    }
  }

  validate_email( email ) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }
}

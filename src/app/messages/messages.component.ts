import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
public bandera : any;
public messageR : any;
public name : any;
public email : any;
public idUser : any;
public message: any;
public myId: any;
  constructor(private route: ActivatedRoute, public conf: AppComponent, public router: Router, public corek : CorekService) { 
    this.idUser=this.route.snapshot.paramMap.get('id');
    this.myId = localStorage.getItem("ID");

    let intw = setInterval(() => { 
      this.bandera = this.conf.returnedB();
      if(this.bandera == 1){
        clearInterval(intw);
        this.ngOnInit();
      }
     }, 2000);
  }

  ngOnInit() {
    const time = Date.now().toString();
    this.conf.corek.socket.emit('query',{'event':time + 'query', 'querystring':"SELECT * FROM `wp_posts` WHERE `post_author` = "+this.idUser+" AND `post_type` LIKE 'support'"});
    this.conf.corek.socket.on(time + "query",(data,key)=> {
      this.messageR = data[0].post_content;
      this.email = data[0].post_title;
      this.name = data[0].post_name;
    });
  }

  sendMessage(){
    if(this.message == '' || this.message == undefined){
      alert('No puedes enviar un mensaje vacio.');
    }else{
      alert('Mensaje enviado');
      let time = Date.now().toString();
      this.sendMail(this.message);
      this.sendNotification(this.message);
      this.corek.socket.emit('insert_post',{'condition':{'post_date': new Date() , 'post_type':'supportAnswer','post_status':'publish','post_excerpt':this.idUser,'post_author':this.myId,'post_content':this.message},'event':time +'inserListMedssage'});    
      this.message = '';
    } 
  }

  sendMail(msj){
    const time = Date.now().toString();
    let mail = '<div style="position:relative;min-width:320px;">'+
    '<div class="clearfix borderbox" style="z-index:1;min-height:535px;background-image:none;border-width:0px;border-color:#000000;background-color:transparent;padding-bottom:62px;width:100%;max-width:800px;margin-left:auto;margin-right:auto;">'+
    '<div class="clearfix colelem" style="z-index:2;background-color:#000000;position:relative;margin-right:-10000px;width:100%;">'+
    '<div class="grpelem"><div></div></div>'+
    '<div class="clearfix grpelem" style="z-index:4;min-height:17px;background-color:transparent;line-height:18px;color:#FFFFFF;font-size:15px;font-family:roboto, sans-serif;font-weight:300;position:relative;margin-right:-10000px;width:19.25%;left:7.13%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
    '<p>¡Hola!</p></div></div>'+
    '<div class="colelem" style="z-index:3;height:133px;opacity:1;filter:alpha(opacity=100);margin-top:91px;position:relative;width:18.13%;margin-left:40.13%; background-size: contain;">'+
    '<img src="http://159.203.82.152/assets/logo.png" alt=""></div>'+
    '<div class="clearfix colelem" style="z-index:13;min-height:17px;background-color:transparent;line-height:22px;color:#000000;font-size:18px;font-family:roboto, sans-serif;font-weight:700;margin-top:78px;position:relative;width:46.13%;margin-left:26.13%;">'+
    '<p>¡Has recibido un mensaje!, revisalo en tu cuenta de la aplicación</p></div>'+
    '<p>Contenido del mensaje recibido: '+msj+'</p>'
    '<div class="clearfix colelem" style="z-index:17;min-height:17px;background-color:transparent;line-height:22px;color:#000000;font-size:18px;font-family:roboto, sans-serif;font-weight:700;margin-top:77px;position:relative;width:46.13%;margin-left:26.13%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
    '</div>'+
    '<div class="clearfix colelem" style="background-color:#000000; height:48px; z-index:8;margin-top:111px;width:100%;">'+
    '<div class="grpelem" style="display:inline;float:left; z-index:8;background-color:#000000;position:relative;margin-right:-10000px;width:100%;">'+
    '<div class="fluid_height_spacer"></div></div><div class="clearfix grpelem" style="height: 17px; display:inline;float:left;z-index:9;min-height:17px;background-color:transparent;line-height:18px;color:#FFFFFF;font-size:15px;font-family:roboto, sans-serif;font-weight:300;position:relative;margin-right:-10000px;width:10%;left:43%; ">'+
    '<p>WIN to WIN</p></div></div>'+
    '<div class="clearfix colelem" style="z-index:21;min-height:17px;background-color:transparent;line-height:14px;color:#000000;font-size:12px;font-family:roboto, sans-serif;font-weight:300;margin-top:9px;position:relative;width:45.88%;margin-left:28.38%;" data-muse-temp-textContainer-sizePolicy="true" data-muse-temp-textContainer-pinning="true">'+
    '<p>¿Tienes dudas? Envíanos un mensaje a soporte@wintowin.co</p></div><div class="verticalspacer" data-offset-top="600" data-content-above-spacer="599" data-content-below-spacer="61" data-sizePolicy="fixed" data-pintopage="page_fixedLeft"></div>'
    +'</div></div>';

    // this.corek.socket.emit('query',{'event':time + 'queryUs', 'querystring':"SELECT * FROM `wp_users` WHERE `ID` = "+this.idUser});
    // this.corek.socket.on(time + 'queryUs', (dat, key)=>{  
      this.corek.socket.emit('confsmtp',{'key':'confsmtp','token':8,'event':time + 'conf'});
      this.corek.socket.on(time + 'conf', (data, key)=>{
        // console.log(data);
        if(key == 'confsmtp'){
          this.corek.socket.emit('sendemail',{'event':time + 'ema','key':'sendemail',
          'from':'"WinToWin" <info@dappvipaccess.com>',
          'to': this.email,
          'subject':'Mensaje recibido.',
          'html':mail
        });    
        this.corek.socket.on(time + 'ema', (datf)=>{
          // console.log(datf);
        });
      }
    });
  // });
    // console.log('hol');
  }

  sendNotification(msj){
    const time = Date.now().toString();
    this.conf.corek.socket.emit('query',{'event':time + 'queryUse', 'querystring':"SELECT * FROM `wp_users` WHERE `ID` = "+this.idUser});
    this.conf.corek.socket.on(time + "queryUse",(data,key)=> {
      if(data[0].user_status == 1){
        let nf = Date.now().toString()+'coneH';
        this.corek.ConnectCorekconfig(nf);
        this.corek.socket.on(nf, (data, key) => {
          if(data.conf == true){
            var not = {
              notification: {
                title: 'Has recibido un mensaje del soporte.', 
                body:msj,
              },
              android: {
                notification: {
                  color: '#ebc041',
                  sound:'default',
                },
              },
              'topic':'notification'+this.idUser,
            };
            this.corek.socket.emit('.corek.', {notification:not});
          }
        });
      }else if(data[0].user_status == 3){
        let nf = Date.now().toString()+'coneC';
        this.corek.ConnectCorekconfig2(nf);

        this.corek.socket.on(nf, (data1, key) => {
          if(data1.conf == true){
            var not = {
              notification: {
                title: 'Has recibido un mensaje del soporte.', 
                body:msj,
              },
              android: {
                notification: {
                  color: '#ebc041',
                  sound:'default',
                },
              },
              'topic':'notification'+this.idUser,
            };
            this.corek.socket.emit('.corek.', {notification:not});
          }
        });
      }
    });
  }
}
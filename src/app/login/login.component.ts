import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { RecoveryComponent } from '../dialogs/recovery/recovery.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public flag: any;
  public form: FormGroup;

  constructor(public dialog: MatDialog,public router: Router, private formBuilder: FormBuilder, public corek : CorekService) { 
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', Validators.required],
    });

    let nf = Date.now().toString()+'conectlogin';
    this.corek.ConnectCorekconfig(nf);
    this.corek.socket.on(nf, (data, key) => {
      
    });
  }

  ngOnInit() {

  }

  login(){
    this.flag = 0;
    const time =  Date.now().toString();
    this.corek.ConnectCorekconfig(time + 'conectlogin');
    this.corek.socket.on(time + 'conectlogin', (data, key) => {
      console.log(data);
      if(data.conf == true){
        let datarequest= {
          'email':this.form.value.email,
          'password':this.form.value.pwd
        }
         let tim3 =  Date.now().toString();
        this.corek.socket.emit('get_users', {
          event: tim3 + 'getUser',
          'key':'validemail',
          'condition':{
            'user_email': datarequest.email,
          }
        }); 
        this.corek.socket.on(tim3 + 'getUser', (data, key)=>{
          console.log(data);
          if(data[0].user_status != 5){
            this.flag = 2;
          }else{
            let userdata = data[0];
            this.corek.socket.emit('signon' , {log:datarequest.email, pwd: datarequest.password,'event':time + 'initLogin', 'key':{'key':'login', 'datauser':userdata}});
            this.corek.socket.on(time + 'initLogin', (data1,key)=>{
              if(data1.token){
                this.router.navigate(["dashboard"]);
                localStorage.setItem("ID",userdata.ID);
                localStorage.setItem("photo",userdata.display_name);
                let x = localStorage.setItem("photo",userdata.display_name);
              }else{
                this.flag = 2;
              }
            });
          }
        });
      }else{
        this.flag = 1;
      }
    });
  }

  recovery(data: any): void {
    const dialogRef = this.dialog.open(RecoveryComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.login();
    }
  }
}

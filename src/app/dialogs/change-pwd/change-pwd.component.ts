import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../services/corek/corek.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss']
})
export class ChangePwdComponent implements OnInit {

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder, public router: Router, public corek : CorekService,public dialogRef: MatDialogRef<ChangePwdComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.form = formBuilder.group({
      pwd: ['', [Validators.required]],
      pwd1: ['', Validators.required],
    });

  }
  ngOnInit() {
  }
  changePwd(){
    const time = Date.now().toString();
    this.corek.socket.emit('query',{'event':time + 'admin', 'querystring':"SELECT * FROM `wp_users` WHERE `user_status` = 5"});
    this.corek.socket.on(time + 'admin', (dat, key)=>{
      console.log(dat)
      this.corek.socket.emit('query',{'event':time + 'metaAdmin', 'querystring':"SELECT * FROM `wp_usermeta` WHERE `user_id` = "+dat[0].ID+" AND `meta_key` LIKE 'md5'"});
      this.corek.socket.on(time + 'metaAdmin', (dat1, key)=>{  
        console.log(dat1[0].meta_value);
        if(!this.form.value.pwd || !this.form.value.pwd1){
          alert('Debes ingresar la clave nueva y repetirla');
        }else{
          if(this.form.value.pwd != this.form.value.pwd1){
            alert('Las claves no son iguales.');
          }else{
            alert('La Clave ha sido cambiada con éxito');
            this.corek.socket.emit('change_password',{"token":dat1[0].meta_value,"user_pass":this.form.value.pwd});
            this.corek.socket.on("change_password", function(result,key){
            });
          }
        }
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { CorekService } from '../services/corek/corek.service';
import { ChangePhotoComponent } from '../dialogs/change-photo/change-photo.component';
import { ChangePwdComponent } from '../dialogs/change-pwd/change-pwd.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  tooltip = "close";
  public base64textString:String="";
  public id : any;
  public photo : any;
  public flag: any;
  img;
  constructor(public corek : CorekService, public dialog: MatDialog, public router: Router) { 
    this.id = localStorage.getItem("ID");

    if(this.photo == '' || this.photo == undefined){
      this.flag = true;
    }else{
      this.flag = false;
    }
  }

  ngOnInit() {
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(["/login"]);
  }
  open(){
    this.tooltip = "open";
  }
  close(){
    this.tooltip = "close";
  }

  changePhoto(): void {
    const dialogRef = this.dialog.open(ChangePhotoComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result.img == undefined) {
        this.flag = true;
        this.close();
        console.log('vale');
      } else {
        console.log('hola');
        this.flag = false;
        this.img = result.url;
        this.close();
      }
    });
  }

  changePwd(): void {
    const dialogRef = this.dialog.open(ChangePwdComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
}

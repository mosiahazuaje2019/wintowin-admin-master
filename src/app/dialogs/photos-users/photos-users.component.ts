import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../services/corek/corek.service';

@Component({
  selector: 'app-photos-users',
  templateUrl: './photos-users.component.html',
  styleUrls: ['./photos-users.component.scss']
})
export class PhotosUsersComponent implements OnInit {
  public photoDoc: any;
  public degress: number=0;
  constructor(public corek : CorekService,public dialogRef: MatDialogRef<PhotosUsersComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.photoDoc = this.corek.ipServer() + data;
  }
  
  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }

  rotate(option){
    let image = document.querySelector('#image') as HTMLElement;
    this.degress += option;
    image.style.transform = `rotate(${this.degress}deg)`;
  }

}

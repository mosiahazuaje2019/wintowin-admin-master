import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../services/corek/corek.service';

@Component({
  selector: 'app-photo-lic',
  templateUrl: './photo-lic.component.html',
  styleUrls: ['./photo-lic.component.scss']
})
export class PhotoLicComponent implements OnInit {
public photoLic: any;
public degress: number=0;
  constructor(public corek : CorekService, public dialogRef: MatDialogRef<PhotoLicComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.photoLic = this.corek.ipServer() + data;    
  }


  ngOnInit() {
    
  }

  rotate(option){
    let image = document.querySelector('#image') as HTMLElement;
    this.degress += option;
    image.style.transform = `rotate(${this.degress}deg)`;
  }
}

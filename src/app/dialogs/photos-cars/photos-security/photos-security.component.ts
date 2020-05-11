import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../../services/corek/corek.service';

@Component({
  selector: 'app-photos-security',
  templateUrl: './photos-security.component.html',
  styleUrls: ['./photos-security.component.scss']
})
export class PhotosSecurityComponent implements OnInit {
  public photoSecurity: any;
  public flag: any;
  public server;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public corek: CorekService) {
    this.photoSecurity = this.server = this.corek.ipServer() + data;
    if (data == ''){
      this.flag = 2
    }else{
      this.flag = 1
    }
  }

  ngOnInit() {
  }
}
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CorekService } from '../../../services/corek/corek.service';

@Component({
  selector: 'app-soat',
  templateUrl: './soat.component.html',
  styleUrls: ['./soat.component.scss']
})
export class SoatComponent implements OnInit {
  public photoSoat: any;
  public flag: any;
  public server: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public corek: CorekService) {
    this.photoSoat = this.server = this.corek.ipServer()+data;
    if (data == ''){
      this.flag = 2
    }else{
      this.flag = 1
    }
   }

  ngOnInit() {
  }
}
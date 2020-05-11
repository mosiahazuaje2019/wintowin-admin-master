import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../../services/corek/corek.service';

@Component({
  selector: 'app-tecnomecanica',
  templateUrl: './tecnomecanica.component.html',
  styleUrls: ['./tecnomecanica.component.scss']
})
export class TecnomecanicaComponent implements OnInit {
  public photoRtm: any;
  public flag: any;
  public server: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public corek: CorekService) {
    console.log(data);
    this.photoRtm = this.server = this.corek.ipServer()+data;
    if (data == ''){
      this.flag = 2
    }else{
      this.flag = 1
    }
  }

  ngOnInit() {
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../../services/corek/corek.service';
import * as moment from 'moment';

@Component({
  selector: 'app-soat-back',
  templateUrl: './soat-back.component.html',
  styleUrls: ['./soat-back.component.scss']
})
export class SoatBackComponent implements OnInit {
  public photoSoatBack: any;
  public date: any;
  public flag: any;
  public server: any;
  public degress: number=0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public corek: CorekService) {
    this.photoSoatBack = this.server = this.corek.ipServer() + data.photo;

    if(this.data.date != undefined){
      this.date = moment(this.data.date).add(1, 'days').format("DD/MM/YYYY");
    }

    if (data.photo == ''){
      this.flag = 2
    }else{
      this.flag = 1
    }
  }

  ngOnInit() {
  }

  rotate(option){
    let image = document.querySelector('#image') as HTMLElement;
    this.degress += option;
    image.style.transform = `rotate(${this.degress}deg)`;
  }

}

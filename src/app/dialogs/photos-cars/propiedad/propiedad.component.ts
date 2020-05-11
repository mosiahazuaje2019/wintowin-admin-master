import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../../services/corek/corek.service';

@Component({
  selector: 'app-propiedad',
  templateUrl: './propiedad.component.html',
  styleUrls: ['./propiedad.component.scss']
})
export class PropiedadComponent implements OnInit {
  public photoProp: any;
  public flag: any;
  public server: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public corek: CorekService) {
    this.photoProp = this.server = this.corek.ipServer() + data;
    console.log(data);
    if (data == ''){
      this.flag = 2
    }else{
      this.flag = 1
    }
  }

  ngOnInit() {
  }
}

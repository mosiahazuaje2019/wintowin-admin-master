import { Component } from '@angular/core';
import { CorekService } from './services/corek/corek.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-material-begin';
  bandera=0;
  constructor(public corek : CorekService) {
   
   }
   ngOnInit(){
    let apt = "main";
    this.corek.ConnectCorekconfig(apt);
    this.corek.socket.on("main", (data, key) => {
      this.bandera=1;
    });
   }
   returnedB(){
     return this.bandera;
   }

  
}

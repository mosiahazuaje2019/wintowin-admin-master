import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-details-travels',
  templateUrl: './details-travels.component.html',
  styleUrls: ['./details-travels.component.scss']
})
export class DetailsTravelsComponent implements OnInit {

  //public bandera = 0;
  public hero_name: any;
  public img: any;
  public car: any;
  public flag: any;
  public date: any;
  public begin: any;
  public end: any;
  public wins: any;
  public user1: any;
  public user2: any;
  public user3: any;

  constructor(public conf: AppComponent, private route: ActivatedRoute, public router: Router) { 
    
    this.hero_name = this.route.snapshot.paramMap.get('user_url')+" "+this.route.snapshot.paramMap.get('user_nicename');
    this.img = 'uploads/'+this.route.snapshot.paramMap.get('display_name');
    this.car = this.route.snapshot.paramMap.get('post_title');
    this.date = this.route.snapshot.paramMap.get('post_date');
    this.begin = this.route.snapshot.paramMap.get('post_content');
    this.end = this.route.snapshot.paramMap.get('post_password');
    this.user1 = this.route.snapshot.paramMap.get('post_name');
    this.user2 = this.route.snapshot.paramMap.get('post_content_filtered');
    this.user3 = this.route.snapshot.paramMap.get('guid');
    this.wins = this.route.snapshot.paramMap.get('to_ping');

  }

  ngOnInit() {
    
  }

  goBack(){
    this.router.navigate(['/historial-viajes']);
  }

}

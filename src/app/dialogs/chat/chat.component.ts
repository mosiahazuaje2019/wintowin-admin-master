import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CorekService } from '../../services/corek/corek.service';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public trip_id: any;
  public flag: any;
  public messages: any;
  public messages_hour: any;
  constructor(public corek : CorekService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.trip_id = data;
  }

  ngOnInit() {
    this.flag = 0;
    this.messages = [];
    this.messages_hour = [];
    const time = Date.now().toString;
    this.corek.ConnectCorekconfig(time + 'cone');
    this.corek.socket.on(time + 'cone', (data, key) => {
      const getM = Date.now().toString+"get message";
      this.corek.socket.emit("query_post" , {condition:{ 'post_parent':this.trip_id}, event : getM, order:"ID"});;
      this.corek.socket.on(getM, (messages)=>{
        this.messages = messages;
        for (let message of messages){
          this.messages_hour.push(moment(message.post_date).format('DD/MM/YYYY'));
        }
      });
    });
  }
}

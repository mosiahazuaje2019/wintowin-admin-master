import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {

  public newTerms: string;
  public terms: string;
  public flag:number = 0;
  constructor(public corek : CorekService) {
  }

  ngOnInit() {
    this.process();
  }

  process(){
    const getTerms = Date.now().toString()+'getTerms'+Math.random;
    this.corek.socket.emit('query_post' , {condition:{'post_type':'terms'}, 'event':getTerms});
    this.corek.socket.on(getTerms, (terms) =>{
      if (terms.length > 0){
        console.log(terms[0].post_content)
        this.flag = 1;
        this.terms = terms[0];
        this.newTerms = terms[0].post_content;
      }
    }); 
  }

  updateTerms(terms){
    console.log(terms)
    const time = Date.now().toString();
    this.corek.socket.emit("update_post",{"set":{"post_content":this.newTerms},"condition":{'ID':terms.ID}, 'event':time + 'updateP'});
    this.corek.socket.on(time + 'updateP', (data , key )=>{
      alert('Los términos y condiciones han sido actualizados');
      this.flag = 0;
      this.process();
    });
  }

}

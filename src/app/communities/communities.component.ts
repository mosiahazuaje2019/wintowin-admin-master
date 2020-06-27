import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {
  public allCommunities: any[];
  public flag: any;
  public flagEdits = 0;
  public flagCheck = 0;
  public flagLoader = 0;
  public bandera = 0;
  public compareId = 0;
  public form: FormGroup;
  public formNewName: FormGroup;

  constructor(public formBuilder: FormBuilder, public conf: AppComponent, public corek : CorekService) {
    // let intw = setInterval(() => { 
    //   this.bandera = this.conf.returnedB();
    //   if(this.bandera == 1){
    //     clearInterval(intw);
    //     this.process();
    //   }
    //  }, 2000);

    this.form = formBuilder.group({
      name: ['', Validators.required],
    });

    this.formNewName = formBuilder.group({
      newName: ['', Validators.required],
    });
    this.process();
   }

   ngOnInit () {
     
   }

  process() {
    this.flag = 0;
    this.flagLoader = 1;
    let aux =[];
    const time = Date.now().toString();
    this.corek.socket.emit('query_post' , {condition:{'post_type':'Communities'}, 'event':time + 'query', key: time});
    this.corek.socket.on(time + 'query' , (data , key) =>{
      if(time == key){
        if (data.error){
          this.reconectar();
        } else {
          for(let i of data){
            aux.push(i);
          }
          this.allCommunities = aux;
          this.flag = 1;
          this.flagLoader = 1;
          this.bandera = 1;
        }
      }
    });
  } 

  add(){
    const time = Date.now().toString();
    this.corek.socket.emit('query',{'event':time +"queryS", 'querystring':"SELECT * FROM `wp_posts` WHERE `post_content` LIKE '"+this.form.value.name+"'"});
    this.corek.socket.on(time + 'queryS', (data , key )=>{
      if(data.length > 0){
        alert('La comunidad que ingresas ya existe');
      }else{
        this.corek.socket.emit('insert_post',{'condition': {'post_type': 'Communities', 'post_content':this.form.value.name},'key':'insertpost','event':time + 'insert'});
        this.corek.socket.on(time + 'insert' , (data , key )=>{
          this.process();
        });
      }
    });
  }

  deleteCommunities(idCommunities){
    let d = confirm("Al borrar esta comunidad no podra ser recuperada. ¿Desea continuar?");
    if (d == true){
      const time = Date.now().toString();                                                                                     
      this.corek.socket.emit('query',{'event':time +"detele_user", 'querystring':"DELETE FROM `wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+idCommunities});
      this.corek.socket.on(time+"detele_user", (dele)=>{
        this.process();
      });
    }
  } 

  edit(idCommunities){
    this.compareId = 0;
    const time = Date.now().toString();    
    this.corek.socket.emit('query',{'event':time +"queryS", 'querystring':"SELECT * FROM `wp_posts` WHERE `post_content` LIKE '"+this.formNewName.value.newName+"'"});
    this.corek.socket.on(time + 'queryS', (data , key )=>{
      if(data.length > 0){
        alert('La comunidad que ingresas ya existe');
      }else{
        this.corek.socket.emit("update_post",{"set":{"post_content":this.formNewName.value.newName},"condition":{'ID':idCommunities}, 'event':time + 'updateP'});
        this.corek.socket.on(time + 'updateP', (data , key )=>{
          alert('La comunidad ha sido actualizada');
          this.process();
        });        
      }
    });
  }
  
  modeEdit(id){    
    this.compareId = id;
    this.flagEdits = 1;
  }

  reconectar(){
    let cf = Date.now().toString()+"halamadrid";
    this.corek.ConnectCorekconfig(cf);
    this.corek.socket.on(cf , (d)=>{
      console.log(d);
      this.bandera = 1;
      this.flag = 1;
      this.process();
    });
  }
} 

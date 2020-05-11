import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lugares-matriculas',
  templateUrl: './lugares-matriculas.component.html',
  styleUrls: ['./lugares-matriculas.component.scss']
})
export class LugaresMatriculasComponent implements OnInit {
  public allLugares: any[];
  public flag: any;
  public flagEdits = 0;
  public flagCheck = 0;
  public flagLoader = 0;
  public bandera = 0;
  public compareId = 0;
  public form: FormGroup;
  public formNewName: FormGroup;

  constructor(public formBuilder: FormBuilder, public conf: AppComponent, public corek : CorekService) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
    });

    this.formNewName = formBuilder.group({
      newName: ['', Validators.required],
    });
    this.process();
   }

  ngOnInit() {
  }

  process() {
    this.flag = 0;
    this.flagLoader = 1;
    let aux =[];
    const time = Date.now().toString();
    this.corek.socket.emit('query_post' , {condition:{'post_type':'lugares'}, 'event':time + 'query', key: time});
    this.corek.socket.on(time + 'query' , (data , key) =>{
      if(time == key){
        if (data.error){
          this.reconectar();
        } else {
          for(let i of data){
            aux.push(i);
          }
          this.allLugares = aux;
          this.flag = 1;
          this.flagLoader = 1;
          this.bandera = 1;
        }
      }
    });
  } 

  add(){
    const time = Date.now().toString();
    this.corek.socket.emit('query',{'event':time +"queryS", 'querystring':"SELECT * FROM `wp_posts` WHERE `post_content` LIKE '"+this.form.value.name+"' AND `post_type` LIKE 'lugares'"});
    this.corek.socket.on(time + 'queryS', (data , key )=>{
      if(data.length > 0){
        alert('El lugar que ingresas ya existe');
      }else{
        this.corek.socket.emit('insert_post',{'condition': {'post_type': 'lugares', 'post_content':this.form.value.name},'key':'insertpost','event':time + 'insert'});
        this.corek.socket.on(time + 'insert' , (data , key )=>{
          this.process();
        });
      }
    });
  }

  deleteCommunities(idLugar){
    let d = confirm("Al borrar esta lugar no podra ser recuperada. ¿Desea continuar?");
    if (d == true){
      const time = Date.now().toString();                                                                                     
      this.corek.socket.emit('query',{'event':time +"detele_user", 'querystring':"DELETE FROM `zadmin_wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+idLugar});
      this.corek.socket.on(time+"detele_user", (dele)=>{
        this.process();
      });
    }
  } 

  edit(idMarca){
    this.compareId = 0;
    const time = Date.now().toString();    
    this.corek.socket.emit('query',{'event':time +"queryS", 'querystring':"SELECT * FROM `wp_posts` WHERE `post_content` LIKE '"+this.formNewName.value.newName+"' `post_type` LIKE 'lugares'"});
    this.corek.socket.on(time + 'queryS', (data , key )=>{
      if(data.length > 0){
        alert('El lugar que ingresas ya existe');
      }else{
        this.corek.socket.emit("update_post",{"set":{"post_content":this.formNewName.value.newName},"condition":{'ID':idMarca}, 'event':time + 'updateP'});
        this.corek.socket.on(time + 'updateP', (data , key )=>{
          alert('El lugar ha sido actualizada');
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

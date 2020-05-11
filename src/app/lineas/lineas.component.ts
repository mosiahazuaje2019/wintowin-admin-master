import { Component, OnInit } from '@angular/core';
import { CorekService } from '../services/corek/corek.service';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})
export class LineasComponent implements OnInit {
  public allMarcas: any[];
  public allLineas: any[];
  public show_lineas: false;
  public flag: any;
  public flagEdits = 0;
  public flagCheck = 0;
  public flagLoader = 0;
  public bandera = 0;
  public compareId = 0;
  public form: FormGroup;
  public formNewName: FormGroup;
  public marcas: any;

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
    this.allMarcas = [];
    this.flag = 0;
    this.flagLoader = 1;
    const time = Date.now().toString();
    this.corek.socket.emit('query_post' , {condition:{'post_type':'marcas'}, 'event':time + 'query', key: time});
    this.corek.socket.on(time + 'query' , (data , key) =>{
      if(time == key){
        if (data.error){
          this.reconectar();
        }else if (data.length > 0){   
          for(let i of data){
            this.allMarcas.push(i.post_content);
          }
          this.flag = 1;
          this.flagLoader = 1;
          this.bandera = 1;
        }else{
          this.flag = 1;
          this.flagLoader = 1;
          this.bandera = 1;
          this.allMarcas.push('No tienes marcas');
        }

      }
    });
  } 

  getLineas(){
    console.log(this.marcas)
    let aux =[];
    const time = Date.now().toString();
    this.corek.socket.emit('query_post' , {condition:{'post_type':this.marcas}, 'event':time + 'query', key: time});
    this.corek.socket.on(time + 'query' , (data , key) =>{
      console.log(data)
      if(time == key){
        if (data.error){
          this.reconectar();
        } else {
          for(let i of data){
            aux.push(i);
          }
          this.allLineas = aux;
        }
      }
    });
  }

  add(){
    const time = Date.now().toString();
    this.corek.socket.emit('query',{'event':time +"queryS", 'querystring':"SELECT * FROM `wp_posts` WHERE `post_content` LIKE '"+this.form.value.name+"' AND `post_type` LIKE '"+this.marcas+"'"});
    this.corek.socket.on(time + 'queryS', (data , key )=>{
      if(data.length > 0){
        alert('La linea que ingresas ya existe');
      }else{
        this.corek.socket.emit('insert_post',{'condition': {'post_type':this.marcas, 'post_content':this.form.value.name},'key':'insertpost','event':time + 'insert'});
        this.corek.socket.on(time + 'insert' , (data , key )=>{
          this.form.reset();
          this.getLineas();
        });
      }
    });
  }

  deleteCommunities(idLugar){
    let d = confirm("Al borrar esta linea no podra ser recuperada. ¿Desea continuar?");
    if (d == true){
      const time = Date.now().toString();                                                                                     
      this.corek.socket.emit('query',{'event':time +"detele_user", 'querystring':"DELETE FROM `zadmin_wintowin`.`wp_posts` WHERE `wp_posts`.`ID` = "+idLugar});
      this.corek.socket.on(time+"detele_user", (dele)=>{
        this.getLineas();
      });
    }
  } 

  edit(idMarca){
    this.compareId = 0;
    const time = Date.now().toString();    
    this.corek.socket.emit('query',{'event':time +"queryS", 'querystring':"SELECT * FROM `wp_posts` WHERE `post_content` LIKE '"+this.formNewName.value.newName+"' AND `post_type` LIKE '"+this.marcas+"'"});
    this.corek.socket.on(time + 'queryS', (data , key )=>{
      if(data.length > 0){
        alert('El linea que ingresas ya existe');
      }else{
        this.corek.socket.emit("update_post",{"set":{"post_content":this.formNewName.value.newName},"condition":{'ID':idMarca}, 'event':time + 'updateP'});
        this.corek.socket.on(time + 'updateP', (data , key )=>{
          alert('El linea ha sido actualizada');
          this.getLineas();
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

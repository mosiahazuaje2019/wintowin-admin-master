import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpimagesService {
	public url_servidor = "http://159.203.82.152/images-webapp.php";
	constructor(private http: HttpClient){}

	public postFileImagen(imagenParaSubir: File){
		const formData = new FormData(); 
		console.log(imagenParaSubir);
		console.log(imagenParaSubir.name);
		formData.append('imagenPropia', imagenParaSubir, imagenParaSubir.name); 
		return this.http.post(this.url_servidor, formData);
	}
}
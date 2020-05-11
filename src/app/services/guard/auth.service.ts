export class AuthService {

  constructor() { }

  get isLoggedIn(): boolean {
  
    const token = localStorage.getItem('ID');

    if(token){
      return true;
    }else{
      return false;
    }
 
  }
 
  get isSuperAdmin() {
    return true;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthModel } from "../models/auth-model";
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;

  constructor(private http: HttpClient) {
    const value = localStorage.getItem('currentUser');
    if (value) {
      this.user = JSON.parse(value);
    }
    else {
      this.user = new User();
    }
  }

  public login(model: AuthModel, onAuth: () => void, onError: (error: any) => void) {
    this.http.post<boolean>("/pa165/rest/customer/login", model).subscribe(
      result => {
        this.user.isAuthenticated = result;
        if (this.user.isAuthenticated) {
          this.user.authData = window.btoa(model.nickname + ':' + model.password);
        }
        onAuth();
      },
      error => {
        onError(error);
    });
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.user = new User();
  }

  public IsAuthenticated(): boolean {
    return this.user.isAuthenticated;
  }

  public getAuthHeader(): any {
    if (this.user.isAuthenticated) {
      return new HttpHeaders({ Authorization: 'Basic ' + this.user.authData });
    }
    else {
      return { };
    }
  }
}

import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import * as env from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  private url = env.environment.API_URL;

  private currentUserSubject: BehaviorSubject<any>;
  private currentUser: Observable<any>;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(public router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      localStorage.getItem("token")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    withCredentials: true,
    observe: "response" as "response"
  };

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(data): Observable<any> {
    return this.http.post<any[]>(
      `${this.url}` + "rest-auth/login/",
      data,
      this.httpOptions
    );
  }

  // , {
  //   withCredentials: true,
  //   observe: "response"
  // }

  logout(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + "rest-auth/logout/");
  }

  register(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "rest-auth/registration/",
      data
    );
  }

  forgotPassword(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "rest-auth/password/reset/",
      data
    );
  }

  profile(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + "rest-auth/user/", {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token")
      })
    });
  }

  resetPassword(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "rest-auth/password/reset/confirm/",
      data
    );
  }

  updatePassword(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "rest-auth/password/change/",
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token")
        })
      }
    );
  }

  updateProfile(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "rest-auth/user/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token")
      })
    });
  }

  public setToken(token) {
    localStorage.setItem("token", token);
    this.currentUserSubject.next(token);
    this.loggedIn.next(true);
  }

  get isUserLoggedIn() {
    return this.loggedIn.asObservable();
  }

  removeToken() {
    localStorage.removeItem("token");
    this.loggedIn.next(false);
  }
}

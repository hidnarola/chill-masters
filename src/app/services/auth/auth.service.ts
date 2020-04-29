import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(public router: Router, private activatedRoute: ActivatedRoute) {}
  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    } else {
      return true;
    }
  }
}

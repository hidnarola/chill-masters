import { Component, OnInit } from "@angular/core";
import { navItems } from "../../_nav";
import { CommonService } from "../../services/common.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent implements OnInit {
  constructor(
    private service: CommonService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.service.isUserLoggedIn.subscribe((res) => {
      const token = localStorage.getItem("token");
      if (token != null) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
  }
  public sidebarMinimized = false;
  public navItems = navItems;
  isLogin: any = false;

  display: boolean = false;

  ngOnInit(): void {}

  menu() {
    this.display = false;
  }
  onClick() {
    this.spinner.show();
    this.service.logout().subscribe(
      (res) => {
        if (res[`detail`]) {
          this.service.removeToken();
          this.spinner.hide();
          this.router.navigate(["/login"]);
          this.toastr.success("Logout Successfully", "Success!", {
            timeOut: 3000,
          });
        }
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err, "Error!", { timeOut: 3000 });
      }
    );
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}

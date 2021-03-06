import { Component, OnInit, OnDestroy } from "@angular/core";
import { MySiteService } from "../../../services/mysite.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-sitelist",
  templateUrl: "./sitelist.component.html",
  styleUrls: ["./sitelist.component.css"],
})
export class SitelistComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  data: any = [];
  constructor(
    private service: MySiteService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.dtOptions = {
      pagingType: "full_numbers",
    };

    this.service.mysite_list().subscribe(
      (res) => {
        this.data = res;
        this.dtTrigger.next();
        this.spinner.hide();
      },
      (err) => {
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  navigateToUsers(id) {
    this.router.navigate([`/site/users/` + id]);
  }

  navigateToOverview(id) {
    this.router.navigate([`/site/overview/` + id]);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}

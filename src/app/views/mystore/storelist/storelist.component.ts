import { Component, OnInit, OnDestroy } from "@angular/core";
import * as jQuery from "jquery";
import { MyStoreService } from "../../../services/mystore.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-storelist",
  templateUrl: "./storelist.component.html",
  styleUrls: ["./storelist.component.css"],
})
export class StorelistComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  data: any = [];
  constructor(
    private service: MyStoreService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.dtOptions = {
      pagingType: "full_numbers",
    };

    this.service.mystore_list().subscribe(
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
    this.router.navigate([`/store/users/` + id]);
  }

  navigateToOverview(id) {
    this.router.navigate([`/store/overview/` + id]);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}

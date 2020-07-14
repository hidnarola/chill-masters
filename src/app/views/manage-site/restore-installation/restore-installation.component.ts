import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { MySiteService } from "../../../services/mysite.service";
import { FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-restore-installation",
  templateUrl: "./restore-installation.component.html",
  styleUrls: ["./restore-installation.component.css"],
})
export class RestoreInstallationComponent implements OnInit {
  id: any;
  page: any;
  data: any = [];
  previous: any;
  next: any;

  constructor(
    private route: ActivatedRoute,
    private service: MySiteService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.page = 1;
    this.route.paramMap.subscribe((params: Params) => {
      this.id = params.get(`id`);
      this.displaydata(this.page);
    });
  }

  displaydata(page) {
    if (this.id) {
      this.spinner.show();
      const obj = {
        site_id: this.id,
        delete_status: true,
      };
      this.service.deletedInstallationList(obj, page).subscribe(
        (res) => {
          this.data = res[`installation_data`];
          this.previous = res[`pagination`][`previous`];
          this.next = res[`pagination`][`next`];
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
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
  }

  nextPage(url, id) {
    this.page = this.page + 1;

    const obj = {
      site_id: parseInt(id),
      delete_status: true,
    };
    this.service.deletedInstallationListByPage(url, obj).subscribe(
      (res) => {
        this.data = res[`installation_data`];
        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
      },
      (err) => {
        console.log(" : err ==> ", err);
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

  previousPage(url, id) {
    this.page = this.page - 1;

    const obj = {
      site_id: parseInt(id),
      delete_status: true,
    };
    this.service.deletedInstallationListByPage(url, obj).subscribe(
      (res) => {
        this.data = res[`installation_data`];
        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
      },
      (err) => {
        console.log(" : err ==> ", err);
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

  restoreInstallation(installation_id, site_id) {
    const restoreObj = {
      installation_id: installation_id,
      site_id: site_id,
      delete_status: false,
    };
    this.service.deleteInstallation(restoreObj).subscribe(
      (res) => {
        if (this.data.length <= 1 && this.previous != null) {
          this.page = this.page - 1;
        }

        this.displaydata(this.page);
      },
      (err) => {
        console.log(" : err ==> ", err);
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

  onclick() {
    this.router.navigate([`site/overview/` + this.id]);
  }
}

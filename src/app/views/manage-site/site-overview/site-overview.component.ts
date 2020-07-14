import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MySiteService } from "../../../services/mysite.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { interval, Subscription } from "rxjs";
import _ from "lodash";

@Component({
  selector: "app-site-overview",
  templateUrl: "./site-overview.component.html",
  styleUrls: ["./site-overview.component.css"],
})
export class SiteOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup;
  site: any = [];
  permission: any;
  id: number;
  page: any;
  pagination: any;
  previous: any;
  next: any;
  selectedSitename: any;
  selectedSite = "";
  data: any = [];
  displayPage: boolean = true;
  subscription: Subscription;
  intervalId: number;
  initialAPICall = false;
  constructor(
    private route: ActivatedRoute,
    private service: MySiteService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      site_name: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.page = 1;
    this.sitelist();
    this.route.paramMap.subscribe((params: Params) => {
      this.id = params.get("id");
      if (this.id != null) {
        this.displaydata(this.page);
      } else {
        console.log("in else");
        setTimeout(() => {
          if (this.site.length > 0) {
            this.router.navigate([`/site/overview/` + this.site[0][`id`]]);
            this.displayPage = true;
          } else {
            this.displayPage = false;
          }
          this.spinner.hide();
        }, 1500);
      }
    });
  }

  sitelist() {
    this.service.mysite_list().subscribe(
      (res) => {
        const site = res;
        const siteList = [];
        if (site.length > 0) {
          for (const item of site) {
            siteList.push(item.site);
          }
          this.site = _.uniqBy(siteList, "site_name");
        } else {
          this.spinner.hide();
        }
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

  displaydata(page) {
    console.log(" : page ==> ", page);
    if (this.id) {
      console.log(" : this.id ==> ", this.id);
      if (!this.initialAPICall) {
        this.spinner.show();
      }
      const obj = {
        site_id: this.id,
        delete_status: false,
      };
      this.service.overviewList(obj, page).subscribe(
        (res) => {
          this.data = res[`installation_data`];
          this.permission = res[`permission`];
          this.previous = res[`pagination`][`previous`];
          this.next = res[`pagination`][`next`];
          setTimeout(() => {
            this.selectedSitename = this.site.find((x) => x.id == this.id);
            this.selectedSite = this.selectedSitename[`site_name`];
          }, 500);
          if (!this.initialAPICall) {
            this.spinner.hide();
          }
          this.initialAPICall = true;
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
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

  onclick() {
    this.router.navigate(["/site/add_installation"], {
      queryParams: { site_id: this.id },
    });
  }

  getCode(e) {
    // this.spinner.show();
    this.router.navigate([`/site/overview/` + e.value.id]);
    setTimeout(() => {
      this.displaydata(this.page);
    }, 1000);
  }

  nextPage(url, id) {
    const obj = {
      site_id: parseInt(id),
      delete_status: false,
    };
    this.service.overviewListByPage(url, obj).subscribe(
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
    const obj = {
      site_id: parseInt(id),
      delete_status: false,
    };
    this.service.overviewListByPage(url, obj).subscribe(
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

  restore() {
    this.router.navigate([`site/restore_installation/` + this.id]);
  }

  ngAfterViewInit() {
    const source = interval(10000);
    this.subscription = source.subscribe(() => this.displaydata(this.page));
  }

  ngOnDestroy() {
    // console.log(" : hii ==> ");
    this.subscription && this.subscription.unsubscribe();
  }
}

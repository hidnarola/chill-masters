import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MyStoreService } from "../../../services/mystore.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import _ from "lodash";

@Component({
  selector: "app-store-overview",
  templateUrl: "./store-overview.component.html",
  styleUrls: ["./store-overview.component.css"]
})
export class StoreOverviewComponent implements OnInit {
  form: FormGroup;
  store: any = [];
  permission: any;
  id: number;
  page: any;
  pagination: any;
  previous: any;
  next: any;
  selectedStorenmae: any;
  selectedStore = "";
  data: any = [];
  displayPage: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private service: MyStoreService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      store_name: new FormControl("")
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.page = 1;
    // setTimeout(() => {
    this.storelist();
    // }, 0);

    this.route.paramMap.subscribe((params: Params) => {
      this.id = params.get("id");
      if (this.id != null) {
        this.displaydata(this.page);
      } else {
        setTimeout(() => {
          console.log(" : this.store ==> ", this.store);
          if (this.store.length > 0) {
            this.router.navigate([
              `/store/lion_square/overview/` + this.store[0][`id`]
            ]);
            this.displayPage = true;
          } else {
            this.displayPage = false;
          }
          this.spinner.hide();
        }, 1500);
      }
    });
  }

  storelist() {
    this.service.mystore_list().subscribe(
      res => {
        const store = res;
        const storeList = [];
        if (store.length > 0) {
          for (const item of store) {
            storeList.push(item.store);
          }
          this.store = _.uniqBy(storeList, "store_name");
        } else {
          this.spinner.hide();
        }
      },
      err => {
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000
          });
        }
      }
    );
  }

  displaydata(page) {
    if (this.id) {
      this.spinner.show();
      const obj = {
        store_id: this.id,
        delete_status: false
      };
      this.service.overviewList(obj, page).subscribe(
        res => {
          console.log(" : res ==> ", res);
          this.data = res[`fridge_data`];
          this.permission = res[`permission`];
          this.previous = res[`pagination`][`previous`];
          this.next = res[`pagination`][`next`];
          setTimeout(() => {
            this.selectedStorenmae = this.store.find(x => x.id == this.id);
            this.selectedStore = this.selectedStorenmae[`store_name`];
          }, 500);
          // console.log(
          //   " : this.selectedStorename ==> ",
          //   this.selectedStorenmae[`store_name`]
          // );
          this.spinner.hide();
        },
        err => {
          console.log(err);
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000
            });
          }
        }
      );
    }
  }

  onclick() {
    this.router.navigate(["/store/lion_square/add_fridge"], {
      queryParams: { store_id: this.id }
    });
  }

  getCode(e) {
    // this.spinner.show();
    this.router.navigate([`/store/lion_square/overview/` + e.value.id]);
    setTimeout(() => {
      this.displaydata(this.page);
    }, 1000);
  }

  nextPage(url, id) {
    const obj = {
      store_id: parseInt(id),
      delete_status: false
    };
    this.service.overviewListByPage(url, obj).subscribe(
      res => {
        console.log(" res:  ==> ", res);
        this.data = res[`fridge_data`];
        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
        // this.selectedStorenmae = this.store.find(x => x.id == this.id);
      },
      err => {
        console.log(" : err ==> ", err);
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000
          });
        }
      }
    );
  }

  previousPage(url, id) {
    const obj = {
      store_id: parseInt(id),
      delete_status: false
    };
    this.service.overviewListByPage(url, obj).subscribe(
      res => {
        console.log(" res:  ==> ", res);
        this.data = res[`fridge_data`];
        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
        // this.selectedStorenmae = this.store.find(x => x.id == this.id);
      },
      err => {
        console.log(" : err ==> ", err);
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000
          });
        }
      }
    );
  }

  restore() {
    this.router.navigate([`store/lion_square/retore_fridge/` + this.id]);
  }
}

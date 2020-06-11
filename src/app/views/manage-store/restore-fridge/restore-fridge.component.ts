import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
import { FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-restore-fridge",
  templateUrl: "./restore-fridge.component.html",
  styleUrls: ["./restore-fridge.component.css"],
})
export class RestoreFridgeComponent implements OnInit {
  id: any;
  page: any;
  data: any = [];
  previous: any;
  next: any;

  constructor(
    private route: ActivatedRoute,
    private service: MyStoreService,
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
        store_id: this.id,
        delete_status: true,
      };
      this.service.deletedFridgeList(obj, page).subscribe(
        (res) => {
          this.data = res[`fridge_data`];
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
      store_id: parseInt(id),
      delete_status: true,
    };
    this.service.deletedFridgeListByPage(url, obj).subscribe(
      (res) => {
        this.data = res[`fridge_data`];
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
      store_id: parseInt(id),
      delete_status: true,
    };
    this.service.deletedFridgeListByPage(url, obj).subscribe(
      (res) => {
        this.data = res[`fridge_data`];
        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
        // this.selectedStorenmae = this.store.find(x => x.id == this.id);
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

  restoreFridge(fridge_id, store_id) {
    const restoreObj = {
      fridge_id: fridge_id,
      store_id: store_id,
      delete_status: false,
    };
    this.service.deleteFridge(restoreObj).subscribe(
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
    this.router.navigate([`store/overview/` + this.id]);
  }
}

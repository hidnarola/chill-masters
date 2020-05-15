import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import * as jQuery from "jquery";
import { MyStoreService } from "../../../services/mystore.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-storelist",
  templateUrl: "./storelist.component.html",
  styleUrls: ["./storelist.component.css"],
})
export class StorelistComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  data: any = [];
  alertForm: FormGroup;
  display2: boolean = false;
  alertData: any;
  checked: boolean = false;
  checked1: boolean = false;
  checked2: boolean = false;
  valueChange: boolean = false;

  constructor(
    private service: MyStoreService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.dtOptions = {
      pagingType: "full_numbers",
    };

    this.storeData();
    this.alertForm = this.fb.group({
      alert_email: new FormControl(false),
      alert_sms: new FormControl(false),
      alert_phonecall: new FormControl(false),
    });
  }

  storeData() {
    this.service.mystore_list().subscribe(
      (res) => {
        setTimeout(() => {
          if (this.valueChange == false) {
            this.dtTrigger.next();
          } else if (this.valueChange == true) {
            this.rerender();
          }
          this.data = res;
          // this.dtTrigger.next();
          this.spinner.hide();
        }, 300);
      },
      (err) => {
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

  showDialog2(data) {
    this.display2 = true;
    this.alertData = data;
    if (this.alertData[`alert_email`] == false) {
      this.checked = false;
    } else if (this.alertData[`alert_email`] == true) {
      this.checked = true;
    }

    if (this.alertData[`alert_sms`] == false) {
      this.checked1 = false;
    } else if (this.alertData[`alert_sms`] == true) {
      this.checked1 = true;
    }

    if (this.alertData[`alert_phonecall`] == false) {
      this.checked2 = false;
    } else if (this.alertData[`alert_phonecall`] == true) {
      this.checked2 = true;
    }
  }

  changeEmailAlert() {
    this.spinner.show();
    this.valueChange = true;
    let obj = {};
    console.log(" : this.alertForm.value ==> ", this.alertForm.value);
    if (this.alertForm.value) {
      obj = {
        store_id: this.alertData[`store`][`id`],
        user_store_id: this.alertData["id"],
        ...this.alertForm.value,
      };
    }
    this.service.changeMyalert(obj).subscribe(
      (res) => {
        console.log(" : res ==> ", res);
        this.toastr.success(res[`detail`], "Success!", {
          timeOut: 3000,
        });
        // this.displaydata();
        this.alertForm.reset();
        this.display2 = false;
        this.storeData();
        // this.spinner.hide();
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
        this.spinner.hide();
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      console.log("===>k");
    });
  }
}

import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
import { Subject } from "rxjs";
import _ from "lodash";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-userlist",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.css"],
})
export class UserlistComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  form: FormGroup;
  public formData: any;
  permissionForm: FormGroup;
  alertForm: FormGroup;
  userForm: FormGroup;
  public isFormSubmitted;
  store: any = [];
  selectedStorenmae: any;
  id: any;
  users: any = [];
  permission: any;
  storename = "";
  valueChange = false;
  PermissionData: any;
  alertData: any;
  display: boolean = false;
  display2: boolean = false;
  display3: boolean = false;
  usersList: any = [];
  keyword = "email";
  displayPage: boolean = true;
  checked: boolean = false;
  checked1: boolean = false;
  checked2: boolean = false;

  val1: string;
  val2: string;

  constructor(
    private route: ActivatedRoute,
    private service: MyStoreService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      store_name: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.dtOptions = {
      pagingType: "full_numbers",
      destroy: true,
    };
    this.storelist();
    this.allUsers();

    this.form = this.fb.group({
      store_name: new FormControl(""),
    });

    this.permissionForm = this.fb.group({
      permission: new FormControl(""),
    });
    this.formData = {};
    this.alertForm = this.fb.group({
      alerts: new FormControl(""),
    });

    this.userForm = this.fb.group({
      user: new FormControl("", Validators.required),
    });

    this.route.paramMap.subscribe((params: Params) => {
      this.id = params.get("id");
      if (this.id != null) {
        this.displaydata();
      } else {
        setTimeout(() => {
          if (this.store.length > 0) {
            this.router.navigate([`site/users/` + this.store[0][`id`]]);
            this.displayPage = true;
          } else {
            this.displayPage = false;
          }
          this.spinner.hide();
        }, 1500);
      }
    });
  }

  displaydata() {
    if (this.id) {
      this.service.store_users(this.id).subscribe(
        (res) => {
          setTimeout(() => {
            if (this.valueChange == false) {
              this.dtTrigger.next();
            } else if (this.valueChange == true) {
              this.rerender();
            }

            this.users = res[`user_store`];
            this.permission = res[`permission`];
            this.storename = res[`user_store`][0][`store`][`store_name`];
            this.selectedStorenmae = this.store.find(
              (x) => x.store_name == res[`user_store`][0][`store`][`store_name`]
            );
            this.spinner.hide();
          }, 300);
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

  storelist() {
    this.service.mystore_list().subscribe(
      (res) => {
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

  getCode(e) {
    this.spinner.show();
    this.valueChange = true;
    this.router.navigate([`/site/users/` + e.value.id]);
    setTimeout(() => {
      this.displaydata();
    }, 1000);
  }

  showDialog(data) {
    this.display = true;
    this.PermissionData = data;
    this.val1 = this.PermissionData[`permission`];
  }

  showDialog2(data) {
    this.display2 = true;
    this.alertData = data;
    if (this.alertData[`alerts`] === false) {
      this.val2 = "false";
    } else {
      this.val2 = "true";
    }
  }

  showDialog3() {
    this.display3 = true;
  }

  ngOnDestroy(): void {
    // this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  changePermission() {
    this.spinner.show();
    this.valueChange = true;
    const obj = {
      user_store_id: this.PermissionData[`id`],
      store_id: this.PermissionData[`store`][`id`],
      ...this.permissionForm.value,
    };
    this.service.changePemission(obj).subscribe(
      (res) => {
        this.toastr.success(res[`detail`], "Success!", {
          timeOut: 3000,
        });
        this.displaydata();
        this.permissionForm.reset();
        this.display = false;
        this.spinner.hide();
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

  changeAlerts() {
    this.spinner.show();
    this.valueChange = true;
    let obj = {};
    if (this.alertForm.value && this.alertForm.value[`alerts`] === "true") {
      obj = {
        store_id: this.alertData[`store`][`id`],
        user_store_id: this.alertData["id"],
        alerts: true,
      };
    } else if (
      this.alertForm.value &&
      this.alertForm.value[`alerts`] === "false"
    ) {
      obj = {
        store_id: this.alertData[`store`][`id`],
        user_store_id: this.alertData["id"],
        alerts: false,
      };
    }

    this.service.changeAlert(obj).subscribe(
      (res) => {
        this.toastr.success(res[`detail`], "Success!", {
          timeOut: 3000,
        });
        this.displaydata();
        this.alertForm.reset();
        this.display2 = false;
        this.spinner.hide();
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

  addUser(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.valueChange = true;
      this.spinner.show();
      const userId = this.userForm.value;
      const obj = {
        store: parseInt(this.id, 10),
        user: userId.user.id,
      };
      this.service.addUser(obj).subscribe(
        (res) => {
          this.toastr.success("User Added Successfully.", "Success!", {
            timeOut: 3000,
          });
          this.displaydata();
          this.isFormSubmitted = false;
          this.userForm.reset();
          this.display3 = false;
          this.spinner.hide();
        },
        (err) => {
          console.log(err.error.non_field_errors);
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`non_field_errors`]) {
            this.toastr.error("This user is already exist.", "Error!", {
              timeOut: 3000,
            });
          }
          this.spinner.hide();
        }
      );
    }
  }

  selectEvent(item) {
    // do something with selected item
  }

  allUsers() {
    const search = "";
    this.service.filteruser(search).subscribe(
      (res) => {
        this.usersList = res;
      },
      (err) => {
        console.log("==>", err);
      }
    );
  }

  onChangeSearch(search: string) {
    // console.log("==>", search);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }

  closeAddUserForm() {
    this.isFormSubmitted = false;
    this.userForm.reset();
    this.display3 = false;
  }
}

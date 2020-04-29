import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../../services/common.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.css"]
})
export class ForgotpasswordComponent implements OnInit {
  form: FormGroup;
  public isFormSubmitted;
  public formData: any;
  constructor(
    private router: Router,
    private service: CommonService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.formData = {};
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void {}

  sendMail(valid) {
    this.spinner.show();
    this.isFormSubmitted = true;
    if (valid) {
      this.service.forgotPassword(this.form.value).subscribe(
        res => {
          this.spinner.hide();
          this.router.navigate(["/login"]);
          this.toastr.success(res["detail"], "Success!", {
            timeOut: 3000
          });
        },
        err => {
          this.spinner.hide();
          if (err.error[`email`]) {
            this.toastr.error("This email address is not exist.", "Error!", {
              timeOut: 3000
            });
          } else {
            if (err.error[`phone_number`]) {
              this.toastr.error(err.error, "Error!", {
                timeOut: 3000
              });
            }
          }
        }
      );
    }
  }
}

import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  chnagepassForm: FormGroup;
  public formData: any;
  public isFormSubmitted;
  public isFormSubmit;
  checked: boolean = false;
  checked1: boolean = false;
  checked2: boolean = false;
  displayBasic: boolean;

  constructor(
    public fb: FormBuilder,
    private service: CommonService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.form = this.fb.group({
      username: new FormControl("", Validators.required),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ]),
      phone_number: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d{9,10}$|^[0-9]\d{9,10}$/)
        ])
      ),
      alert_email: new FormControl(false),
      alert_sms: new FormControl(false),
      alert_phonecall: new FormControl(false)
    });

    this.chnagepassForm = this.fb.group(
      {
        old_password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(8)
          ])
        ),
        new_password1: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(8)
          ])
        ),
        new_password2: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(8)
          ])
        )
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit(): void {
    this.spinner.show();
    this.service.profile().subscribe(res => {
      this.form.controls[`username`].setValue(res[`username`]);
      this.form.controls[`email`].setValue(res[`email`]);
      this.form.controls[`phone_number`].setValue(res[`phone_number`]);
      this.form.controls[`alert_email`].setValue(res[`alert_email`]);
      this.form.controls[`alert_sms`].setValue(res[`alert_sms`]);
      this.form.controls[`alert_phonecall`].setValue(res[`alert_phonecall`]);
      this.spinner.hide();
    });
  }

  checkMail() {
    if (
      this.form.value.email !== undefined &&
      this.form.value.email.length > 0
    ) {
      // tslint:disable-next-line: max-line-length
      this.form.controls["email"].setValidators([
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ]);
    } else {
      this.form.controls["email"].setValidators([Validators.required]);
    }
    this.form.controls["email"].updateValueAndValidity();
  }

  checkPasswords(g: FormGroup) {
    // here we have the 'passwords' group
    const new_password1 = g.get("new_password1").value;
    const new_password2 = g.get("new_password2").value;
    if (
      new_password1 !== undefined &&
      new_password1 != null &&
      new_password2 !== null &&
      new_password2 !== undefined
    ) {
      return new_password1 === new_password2
        ? null
        : g.get("new_password2").setErrors({ mismatch: true });
    }
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (
      typeof (control.value || "") === "string" ||
      (control.value || "") instanceof String
    ) {
      const isWhitespace = (control.value || "").trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.spinner.show();
      this.service.updateProfile(this.form.value).subscribe(
        res => {
          this.spinner.hide();
          this.isFormSubmitted = false;
          this.toastr.success("Profile Updated Successfully", "Success!", {
            timeOut: 3000
          });
        },
        err => {
          this.spinner.hide();
          console.log(" : err.error ==> ", err.error);
          if (err.error[`email`]) {
            this.toastr.error(
              "This email address is already exist.",
              "Error!",
              {
                timeOut: 3000
              }
            );
          } else if (err.error[`phone_number`]) {
            this.toastr.error("This phone number is already exist.", "Error!", {
              timeOut: 3000
            });
          } else if (err.error[`username`]) {
            this.toastr.error("This username is already exist.", "Error!", {
              timeOut: 3000
            });
          } else {
            this.toastr.error(err.error, "Error!", {
              timeOut: 3000
            });
          }
        }
      );
    }
  }

  changePassword(valid) {
    this.isFormSubmit = true;
    if (valid) {
      this.service.updatePassword(this.chnagepassForm.value).subscribe(
        res => {
          this.chnagepassForm.reset();
          this.toastr.success(res[`detail`], "Success!", {
            timeOut: 3000
          });
          this.isFormSubmit = false;
          this.displayBasic = false;
        },
        err => {
          if (err.error.old_password) {
            this.toastr.error("Old password does not match.", "Error!", {
              timeOut: 3000
            });
          } else {
            this.toastr.error("Something went wrong.", "Error!", {
              timeOut: 3000
            });
          }
        }
      );
    }
  }
}

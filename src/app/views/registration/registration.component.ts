import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  regForm: FormGroup;
  public formData: any;
  public isFormSubmitted;

  constructor(
    public fb: FormBuilder,
    private service: CommonService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.regForm = this.fb.group(
      {
        first_name: new FormControl("", [Validators.required]),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
        phone_number: new FormControl(""),
        password1: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(8),
          ])
        ),
        password2: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(8),
          ])
        ),
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit(): void {}

  checkPhoneNumber(e) {
    if (e.target.value !== undefined && e.target.value.length > 0) {
      // tslint:disable-next-line: max-line-length
      this.regForm.controls["phone_number"].setValidators([
        Validators.pattern(/^[0-9]\d{9,10}$|^[0-9]\d{9,10}$/),
      ]);
    }
    this.regForm.controls["phone_number"].updateValueAndValidity();
  }

  checkMail() {
    if (
      this.regForm.value.email !== undefined &&
      this.regForm.value.email.length > 0
    ) {
      // tslint:disable-next-line: max-line-length
      this.regForm.controls["email"].setValidators([
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]);
    } else {
      this.regForm.controls["email"].setValidators([Validators.required]);
    }
    this.regForm.controls["email"].updateValueAndValidity();
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

  checkPasswords(g: FormGroup) {
    // here we have the 'passwords' group
    const password1 = g.get("password1").value;
    const password2 = g.get("password2").value;
    if (
      password1 !== undefined &&
      password1 != null &&
      password2 !== null &&
      password2 !== undefined
    ) {
      return password1 === password2
        ? null
        : g.get("password2").setErrors({ mismatch: true });
    }
  }

  onSubmit(valid) {
    console.log(this.regForm);

    this.isFormSubmitted = true;
    if (valid) {
      this.spinner.show();
      this.service.register(this.regForm.value).subscribe(
        (res) => {
          if (res[`detail`]) {
            this.spinner.hide();
            Swal.fire({
              title: "sucess",
              icon: "success",
              text:
                "Registration is successfull, Verification email sent to you.",
            }).then((isConfirm) => {
              if (isConfirm) {
                this.router.navigate(["/login"]);
              }
            });
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err.error);

          if (err.error.email) {
            this.toastr.error(err.error.email, "Error!", {
              timeOut: 3000,
            });
          } else if (err.error.first_name) {
            this.toastr.error(err.error.first_name, "Error!", {
              timeOut: 3000,
            });
          } else if (err.error.phone_number) {
            this.toastr.error(err.error.phone_number, "Error!", {
              timeOut: 3000,
            });
          } else if (err.error.password1) {
            this.toastr.error(err.error.password1, "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
      // this.router.navigate(["/login"]);
    }
  }
}

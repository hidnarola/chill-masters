import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CommonService } from "../../../services/common.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.css"]
})
export class ResetpasswordComponent implements OnInit {
  form: FormGroup;
  submitform: FormGroup;
  uid: any;
  params_token: any;
  public isFormSubmitted;
  public formData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: CommonService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.formData = {};
    this.form = this.fb.group(
      {
        new_password1: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            this.noWhitespaceValidator,
            Validators.minLength(8)
            // Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)
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

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.uid = params.uid;
      this.params_token = params.token;
    });
  }

  confirm(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.spinner.show();
      const obj = {
        ...this.form.value,
        uid: this.uid,
        token: this.params_token
      };

      this.service.resetPassword(obj).subscribe(
        res => {
          this.spinner.hide();
          this.toastr.success(res[`detail`], "Success!", {
            timeOut: 3000
          });
          this.router.navigate([`/login`]);
        },
        err => {
          this.spinner.hide();
          if (err.error.token) {
            this.toastr.error("Token Has been expired.", "Error!", {
              timeOut: 3000
            });
            this.router.navigate([`/login`]);
          } else {
            this.toastr.error("Something went wrong.", "Error!", {
              timeOut: 3000
            });
            this.router.navigate([`/login`]);
          }
        }
      );
    }
  }
}

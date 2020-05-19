import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public formData: any;
  public isFormSubmitted;
  isLoggedIn: Observable<boolean>;
  constructor(
    public fb: FormBuilder,
    private service: CommonService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.formData = {};
    this.loginForm = this.fb.group({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
        ])
      ),
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.service.isUserLoggedIn;
  }

  checkMail() {
    if (
      this.loginForm.value.email !== undefined &&
      this.loginForm.value.email.length > 0
    ) {
      // tslint:disable-next-line: max-line-length
      this.loginForm.controls["email"].setValidators([
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]);
    } else {
      this.loginForm.controls["email"].setValidators([Validators.required]);
    }
    this.loginForm.controls["email"].updateValueAndValidity();
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

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.spinner.show();
      this.service.login(this.loginForm.value).subscribe(
        (res: HttpResponse<any>) => {
          const token = res.body["key"];
          if (token) {
            this.service.setToken(token);
            this.router.navigate(["/user/store"]);
            this.spinner.hide();
            this.toastr.success("Login Successfully", "Success!", {
              timeOut: 3000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.non_field_errors, "Error!", {
            timeOut: 3000,
          });
        }
      );
    }
  }
}

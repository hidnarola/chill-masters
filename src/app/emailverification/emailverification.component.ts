import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CommonService } from "../services/common.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { HttpResponse } from "@angular/common/http";
import * as env from "../../environments/environment";

@Component({
  selector: "app-emailverification",
  templateUrl: "./emailverification.component.html",
  styleUrls: ["./emailverification.component.css"],
})
export class EmailverificationComponent implements OnInit {
  private url = env.environment.API_URL;
  params_token: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CommonService,
    private toastr: ToastrService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.params_token = params;
    });

    const that = this;
    window.location.href =
      this.url +
      "rest-auth/registration/account-confirm-email/" +
      this.params_token.token +
      "/";
    // this.service.verify_email(this.params_token.token).subscribe(
    //   (res: HttpResponse<any>) => {
    //     if (res) {
    //       this.toastr.success("Your Email verified Successfull.", "Success!", {
    //         timeOut: 3000,
    //       });
    //       Swal.fire({
    //         title: "Thank you for verifying your email.",
    //         text: res[`warning`],
    //         icon: "success",
    //         showCancelButton: false,
    //         confirmButtonText: "OK",
    //       }).then(function (isConf) {
    //         that.router.navigate(["/login"]);
    //       });
    //     }
    //   },
    //   (err) => {
    //     this.toastr.error(err["error"].message, "Error!", { timeOut: 3000 });
    //     this.router.navigate(["/login"]);
    //   }
    // );
  }

  ngOnInit(): void {}
}

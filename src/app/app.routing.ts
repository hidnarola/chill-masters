import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { ForgotpasswordComponent } from "./views/forgotpassword/forgotpassword.component";
import { LoginGuard } from "./services/auth/login-gaurd.guard";
import { AuthGuardService } from "./services/auth/auth-guard.service";
import { RegistrationComponent } from "./views/registration/registration.component";
import { ProfileComponent } from "./views/profile/profile.component";
import { ResetpasswordComponent } from "./views/reset/resetpassword/resetpassword.component";
import { EmailverificationComponent } from "./emailverification/emailverification.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "confirmation/:token",
    component: EmailverificationComponent,
    data: {
      title: "Email Confirmation",
    },
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./views/home/home.module").then((m) => m.HomeModule),
        canActivate: [LoginGuard],
      },
      {
        path: "aboutus",
        loadChildren: () =>
          import("./views/aboutus/aboutus.module").then((m) => m.AboutusModule),
        canActivate: [LoginGuard],
      },
      {
        path: "login",
        loadChildren: () =>
          import("./views/login/login.module").then((m) => m.LoginModule),
        canActivate: [LoginGuard],
      },
      {
        path: "forgot_password",
        component: ForgotpasswordComponent,
        canActivate: [LoginGuard],
        data: {
          title: "Forgot Password",
        },
      },
      {
        path: "reset_password/:uid/:token",
        component: ResetpasswordComponent,
        canActivate: [LoginGuard],
        data: {
          title: "Reset Password",
        },
      },
      {
        path: "registration",
        component: RegistrationComponent,
        canActivate: [LoginGuard],
        data: {
          title: "Registration",
        },
      },
      {
        path: "user",
        loadChildren: () =>
          import("./views/mystore/mystore.module").then((m) => m.MystoreModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "store",
        loadChildren: () =>
          import("./views/manage-store/manage-store.module").then(
            (m) => m.ManageStoreModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuardService],
        data: {
          title: "My Profile",
        },
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

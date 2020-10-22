import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

import { AppComponent } from "./app.component";

// Import containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import {
  NgcCookieConsentModule,
  NgcCookieConsentConfig,
} from "ngx-cookieconsent";

const APP_CONTAINERS = [DefaultLayoutComponent];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts";
import { ForgotpasswordComponent } from "./views/forgotpassword/forgotpassword.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RegistrationComponent } from "./views/registration/registration.component";
import { ListComponent } from "./views/list/list.component";
import { ProfileComponent } from "./views/profile/profile.component";
import { CheckboxModule } from "primeng/checkbox";
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthService } from "./services/auth/auth.service";
import { DataTablesModule } from "angular-datatables";
import { AuthGuardService } from "./services/auth/auth-guard.service";
import { ResetpasswordComponent } from "./views/reset/resetpassword/resetpassword.component";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { EmailverificationComponent } from "./emailverification/emailverification.component";
const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    // domain: 'localhost'
    // domain: 'ec2-3-130-87-74.us-east-2.compute.amazonaws.com'
    domain: "alphonsora.com",
    // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: "#2b9d75",
    },
    button: {
      background: "#fca62b",
    },
  },
  theme: "edgeless",
  type: "info",
};
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    // NgcCookieConsentModule.forRoot(cookieConfig),
    PerfectScrollbarModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    DataTablesModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CheckboxModule,
    DialogModule,
    ButtonModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    ForgotpasswordComponent,
    RegistrationComponent,
    ListComponent,
    ProfileComponent,
    ResetpasswordComponent,
    EmailverificationComponent,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

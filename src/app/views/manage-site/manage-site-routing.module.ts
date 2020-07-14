import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserlistComponent } from "./userlist/userlist.component";
import { SiteOverviewComponent } from "./site-overview/site-overview.component";
import { AddInstallationComponent } from "./add-installation/add-installation.component";
import { InstallationDetailComponent } from "./installation-detail/installation-detail.component";
import { RestoreInstallationComponent } from "./restore-installation/restore-installation.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "/",
        redirectTo: "users",
      },
      {
        path: "users",
        component: UserlistComponent,
        data: {
          title: "Users",
        },
      },
      {
        path: "users/:id",
        component: UserlistComponent,
        data: {
          title: "Users",
        },
      },
      {
        path: "overview",
        component: SiteOverviewComponent,
        data: {
          title: "Overview",
        },
      },
      {
        path: "overview/:id",
        component: SiteOverviewComponent,
        data: {
          title: "Overview",
        },
      },
      {
        path: "restore_installation/:id",
        component: RestoreInstallationComponent,
        data: {
          title: "Restore installation",
        },
      },
      {
        path: "add_installation",
        component: AddInstallationComponent,
        data: {
          title: "Add installation",
        },
      },
      {
        path: "edit_installation",
        component: AddInstallationComponent,
        data: {
          title: "Edit installation",
        },
      },
      {
        path: "installation_detail",
        component: InstallationDetailComponent,
        data: {
          title: "installation Detail",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageSiteRoutingModule {}

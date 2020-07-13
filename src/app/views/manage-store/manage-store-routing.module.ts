import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserlistComponent } from "./userlist/userlist.component";
import { StoreOverviewComponent } from "./store-overview/store-overview.component";
import { AddFridgeComponent } from "./add-fridge/add-fridge.component";
import { FridgeDetailComponent } from "./fridge-detail/fridge-detail.component";
import { RestoreFridgeComponent } from "./restore-fridge/restore-fridge.component";

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
        component: StoreOverviewComponent,
        data: {
          title: "Overview",
        },
      },
      {
        path: "overview/:id",
        component: StoreOverviewComponent,
        data: {
          title: "Overview",
        },
      },
      {
        path: "restore_installation/:id",
        component: RestoreFridgeComponent,
        data: {
          title: "Restore installation",
        },
      },
      {
        path: "add_installation",
        component: AddFridgeComponent,
        data: {
          title: "Add installation",
        },
      },
      {
        path: "edit_installation",
        component: AddFridgeComponent,
        data: {
          title: "Edit installation",
        },
      },
      {
        path: "installation_detail",
        component: FridgeDetailComponent,
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
export class ManageStoreRoutingModule {}

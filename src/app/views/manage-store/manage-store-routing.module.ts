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
        path: "",
        redirectTo: "lion_square/users"
      },
      {
        path: "lion_square/users",
        component: UserlistComponent,
        data: {
          title: "Users"
        }
      },
      {
        path: "lion_square/users/:id",
        component: UserlistComponent,
        data: {
          title: "Users"
        }
      },
      {
        path: "lion_square/overview",
        component: StoreOverviewComponent,
        data: {
          title: "Overview"
        }
      },
      {
        path: "lion_square/overview/:id",
        component: StoreOverviewComponent,
        data: {
          title: "Overview"
        }
      },
      {
        path: "lion_square/retore_fridge/:id",
        component: RestoreFridgeComponent,
        data: {
          title: "Restore Fridge"
        }
      },
      {
        path: "lion_square/add_fridge",
        component: AddFridgeComponent,
        data: {
          title: "Add Fridge"
        }
      },
      {
        path: "lion_square/edit_fridge",
        component: AddFridgeComponent,
        data: {
          title: "Edit Fridge"
        }
      },
      {
        path: "lion_square/fridge_detail",
        component: FridgeDetailComponent,
        data: {
          title: "Fridge Detail"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStoreRoutingModule {}

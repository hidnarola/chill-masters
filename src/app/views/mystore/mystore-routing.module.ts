import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StorelistComponent } from "./storelist/storelist.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Store"
    },
    children: [
      {
        path: "",
        redirectTo: "store"
      },
      {
        path: "store",
        component: StorelistComponent,
        data: {
          title: "My Store"
        }
      }
      // {
      //   path: 'add',
      //   component: GroupAddComponent,
      //   data: {
      //     title: 'Add'
      //   }
      // },
      // {
      //   path: 'edit/:id',
      //   component: GroupEditComponent,
      //   data: {
      //     title: 'Edit'
      //   }
      // },
      // {
      //   path: 'view/:id',
      //   component: GroupViewComponent,
      //   // component: GroupEditComponent,
      //   data: {
      //     title: 'View'
      //   }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MystoreRoutingModule {}

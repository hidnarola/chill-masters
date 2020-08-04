import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SitelistComponent } from "./sitelist/sitelist.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Site",
    },
    children: [
      {
        path: "",
        redirectTo: "site",
      },
      {
        path: "site",
        component: SitelistComponent,
        data: {
          title: "My Sites",
        },
      },
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MysiteRoutingModule {}

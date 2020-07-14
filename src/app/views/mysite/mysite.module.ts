import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MysiteRoutingModule } from "./mysite-routing.module";
import { SitelistComponent } from "./sitelist/sitelist.component";
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [SitelistComponent],
  imports: [
    CommonModule,
    MysiteRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    CheckboxModule,
    ButtonModule,
  ],
})
export class MysiteModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MystoreRoutingModule } from "./mystore-routing.module";
import { StorelistComponent } from "./storelist/storelist.component";
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [StorelistComponent],
  imports: [
    CommonModule,
    MystoreRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    CheckboxModule,
    ButtonModule,
  ],
})
export class MystoreModule {}

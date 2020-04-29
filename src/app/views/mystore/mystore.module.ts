import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MystoreRoutingModule } from "./mystore-routing.module";
import { StorelistComponent } from "./storelist/storelist.component";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [StorelistComponent],
  imports: [CommonModule, MystoreRoutingModule, DataTablesModule]
})
export class MystoreModule {}

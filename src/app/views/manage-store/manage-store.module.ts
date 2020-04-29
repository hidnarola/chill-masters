import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ManageStoreRoutingModule } from "./manage-store-routing.module";
import { UserlistComponent } from "./userlist/userlist.component";
import { DropdownModule } from "primeng/dropdown";
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { RadioButtonModule } from "primeng/radiobutton";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { StoreOverviewComponent } from "./store-overview/store-overview.component";
import { AddFridgeComponent } from "./add-fridge/add-fridge.component";
import { FridgeDetailComponent } from "./fridge-detail/fridge-detail.component";
import { ChartsModule } from "ng2-charts";
import { CalendarModule } from "primeng/calendar";
import { RestoreFridgeComponent } from "./restore-fridge/restore-fridge.component";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
  declarations: [
    UserlistComponent,
    StoreOverviewComponent,
    AddFridgeComponent,
    FridgeDetailComponent,
    RestoreFridgeComponent,
  ],
  imports: [
    CommonModule,
    ManageStoreRoutingModule,
    DropdownModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    AutocompleteLibModule,
    ChartsModule,
    CalendarModule,
    CheckboxModule,
  ],
})
export class ManageStoreModule {}

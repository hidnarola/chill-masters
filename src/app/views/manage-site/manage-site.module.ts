import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ManageSiteRoutingModule } from "./manage-site-routing.module";
import { UserlistComponent } from "./userlist/userlist.component";
import { DropdownModule } from "primeng/dropdown";
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { RadioButtonModule } from "primeng/radiobutton";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { SiteOverviewComponent } from "./site-overview/site-overview.component";
import { AddInstallationComponent } from "./add-installation/add-installation.component";
import { InstallationDetailComponent } from "./installation-detail/installation-detail.component";
import { ChartsModule } from "ng2-charts";
import { CalendarModule } from "primeng/calendar";
import { RestoreInstallationComponent } from "./restore-installation/restore-installation.component";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { HighchartsChartModule } from "highcharts-angular";
import { UppercaseInputDirective } from "../../directives/uppercase-input.directive";

@NgModule({
  declarations: [
    UserlistComponent,
    SiteOverviewComponent,
    AddInstallationComponent,
    InstallationDetailComponent,
    RestoreInstallationComponent,
    UppercaseInputDirective,
  ],
  imports: [
    CommonModule,
    ManageSiteRoutingModule,
    DropdownModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    AutocompleteLibModule,
    HighchartsChartModule,
    ChartsModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
  ],
})
export class ManageSiteModule {}

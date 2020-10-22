import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MySiteService } from "../../../services/mysite.service";
import * as moment from "moment";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import _ from "lodash";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-installation",
  templateUrl: "./add-installation.component.html",
  styleUrls: ["./add-installation.component.css"],
})
export class AddInstallationComponent implements OnInit {
  form: FormGroup;
  myForm: FormGroup;
  createSensorForm: FormGroup;
  sensor_data: FormArray;
  value = false;
  submitted = false;
  public isFormSubmitted;
  public isCreateSensorFormSubmitted;
  site_id: any;
  installation_id: any;
  siteList: any = [{ label: "Select Location", value: "" }];
  sensorsList: any = [{ label: "Select Sensor", value: "" }];
  originalSensorsList: any = [];
  currentSensor: number = null;
  updatedSensor: any = [];
  getSensorsById: any = [];
  finalSensorData: any = [];
  editMode = false;
  PageTitle = "Add";
  display: boolean = false;
  currentIndex = null;
  tempSensorData: any = [];
  errorList: any = [];
  warning: any = [];

  selectedSitename: any;
  // minimumDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private service: MySiteService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.site_id = params.get("site_id");
      this.installation_id = params.get("installation_id");
    });
  }

  ngOnInit(): void {
    this.sitelist();
    // this.sensorList();
    this.form = this.fb.group({
      site: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      installation_name: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      installation_content: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      installation_description: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      storage_range_min: new FormControl("", Validators.required),
      storage_range_max: new FormControl("", Validators.required),
      created_by: new FormControl(""),
    });

    this.myForm = this.fb.group({
      sensor_data: this.fb.array([]),
    });

    this.createSensorForm = this.fb.group({
      device_id: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
    });

    if (this.site_id != null && this.installation_id != null) {
      this.spinner.show();
      this.editMode = true;
      this.PageTitle = "Edit";
      const obj = {
        site_id: parseInt(this.site_id, 10),
        installation_id: parseInt(this.installation_id, 10),
      };
      this.service.getInstallationById(obj).subscribe(
        (res) => {
          this.form.controls[`site`].setValue(res[`installation_data`][`site`]);
          this.form.controls[`installation_name`].setValue(
            res[`installation_data`][`installation_name`]
          );
          this.form.controls[`installation_content`].setValue(
            res[`installation_data`][`installation_content`]
          );
          this.form.controls[`installation_description`].setValue(
            res[`installation_data`][`installation_description`]
          );
          this.form.controls[`storage_range_min`].setValue(
            res[`installation_data`][`storage_range_min`]
          );
          this.form.controls[`storage_range_max`].setValue(
            res[`installation_data`][`storage_range_max`]
          );
          this.form.controls[`created_by`].setValue(
            res[`installation_data`][`created_by`]
          );
          this.getSensor();
        },
        (err) => {
          this.spinner.hide();
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
    } else {
      this.form.controls[`site`].setValue(parseInt(this.site_id, 10));
    }
  }

  get f() {
    return this.myForm.controls.sensor_data["controls"];
  }

  getSensor() {
    const sensorObj = {
      installation_id: this.installation_id,
      site_id: this.site_id,
    };

    this.service.getSensor(sensorObj).subscribe(
      (res) => {
        this.getSensorsById = res[`sensor_installation_data`];
        for (
          let index = 0;
          this.myForm.controls[`sensor_data`][`controls`].length <
          this.getSensorsById.length;
          index++
        ) {
          this.sensor_data = this.myForm.get("sensor_data") as FormArray;
          this.sensor_data.push(this.createItem());
          this.warning.push(null);
        }
        this.getSensorsById.forEach((element, index) => {
          this.myForm.controls[`sensor_data`]["controls"][index].controls[
            `id`
          ].setValue(element.id);
          this.myForm.controls[`sensor_data`]["controls"][index].controls[
            `temperature_sensor`
          ].setValue(element.temperature_sensor);
          if (element.installed_at != null) {
            this.myForm.controls[`sensor_data`]["controls"][index].controls[
              `installed_at`
            ].setValue(new Date(element.installed_at));
          }
          if (element.removed_at != null) {
            this.myForm.controls[`sensor_data`]["controls"][index].controls[
              `removed_at`
            ].setValue(new Date(element.removed_at));
          }
        });
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  createItem() {
    return this.fb.group(
      {
        id: [null],
        temperature_sensor: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(16),
            Validators.pattern(/^[0-9A-F]+$/),
          ]),
        ],
        installed_at: [null, Validators.compose([Validators.required])],
        removed_at: [null, []],
      },
      {
        validators: this.checkDateValidator,
      }
    );
  }

  onSelectDate(e, i) {
    const installAtDate = this.myForm.controls["sensor_data"].value[i][
      `installed_at`
    ];
    const removeAtDate = this.myForm.controls["sensor_data"].value[i][
      `removed_at`
    ];
    const momentA = moment(installAtDate, "DD/MM/YYYY").set({ second: 0 });
    const momentB = moment(removeAtDate, "DD/MM/YYYY").set({ second: 0 });

    if (this.myForm.value.sensor_data.length > 1) {
      for (
        let index = 0;
        index < this.myForm.value.sensor_data.length;
        index++
      ) {
        const data = this.myForm.value.sensor_data[index];
        if (index !== i) {
          const PreviousInstallAt = moment(
            data.installed_at,
            "DD/MM/YYYY"
          ).set({ second: 0 });
          const PreviousRemoveAt = moment(data.removed_at, "DD/MM/YYYY").set({
            second: 0,
          });

          if (
            moment(momentA).isBetween(
              PreviousInstallAt,
              PreviousRemoveAt,
              null,
              "[]"
            ) === true
          ) {
            this.myForm.controls.sensor_data["controls"][
              i
            ].controls.installed_at.setErrors({ isExist: true });
            break;
          } else if (
            moment(momentB).isBetween(
              PreviousInstallAt,
              PreviousRemoveAt,
              null,
              "[]"
            ) === true
          ) {
            this.myForm.controls.sensor_data["controls"][
              i
            ].controls.installed_at.setErrors({ isExist: true });
            break;
          } else if (
            moment(PreviousInstallAt).isBetween(
              momentA,
              momentB,
              null,
              "[]"
            ) === true ||
            moment(PreviousRemoveAt).isBetween(momentA, momentB, null, "[]") ===
              true
          ) {
            this.myForm.controls.sensor_data["controls"][
              i
            ].controls.installed_at.setErrors({ isExist: true });
            break;
          } else if (
            data.installed_at !== null &&
            data.removed_at === null &&
            moment(momentA).isSameOrAfter(PreviousInstallAt) === true
          ) {
            this.myForm.controls.sensor_data["controls"][
              i
            ].controls.installed_at.setErrors({ isExist: true });
            break;
          } else {
            this.myForm.controls.sensor_data["controls"][
              i
            ].controls.installed_at.updateValueAndValidity();
          }
        }
      }
    }
  }

  checkDateValidator(g: FormGroup) {
    const i = g.get("installed_at").value;
    const r = g.get("removed_at").value;
    const momentA = moment(i, "DD/MM/YYYY").set({ second: 0 });
    const momentB = moment(r, "DD/MM/YYYY").set({ second: 0 });

    let e;
    if (momentA.isSameOrAfter(momentB)) {
      e = { invalidDate: true };
    } else {
      e = null;
    }
    return e;
  }

  addItem() {
    this.sensor_data = this.myForm.get("sensor_data") as FormArray;
    this.sensor_data.push(this.createItem());
    this.warning.push(null);
  }

  remove_sensor(index: number) {
    this.spinner.show();
    this.sensor_data = this.myForm.get("sensor_data") as FormArray;
    if (this.sensor_data.value[index][`id`] != null) {
      const deleteObj = {
        sensor_installation_id: this.sensor_data.value[index][`id`],
        site: parseInt(this.site_id, 10),
      };
      this.service.deleteSensor(deleteObj).subscribe(
        (res) => {
          this.sensor_data.removeAt(index);
          this.warning.splice(index, 1);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
    } else {
      this.sensor_data.removeAt(index);
      this.warning.splice(index, 1);
      this.spinner.hide();
    }
    return false;
  }

  deleteInstallation() {
    this.spinner.show();
    const deleteObj = {
      installation_id: parseInt(this.installation_id, 10),
      site_id: parseInt(this.site_id, 10),
      delete_status: true,
    };

    this.service.deleteInstallation(deleteObj).subscribe(
      (res) => {
        this.toastr.success("Installation Deleted Sucessfully", "Success!", {
          timeOut: 3000,
        });
        this.router.navigate(["site/overview/" + this.site_id]);
        this.spinner.hide();
      },
      (err) => {
        console.log(" : err ==> ", err);
        this.spinner.hide();
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  sitelist() {
    this.service.mysite_list().subscribe(
      (res) => {
        const site = res;
        this.siteList = [];
        if (site.length > 0) {
          for (const item of site) {
            this.siteList.push({
              label: item.site.site_name,
              value: item.site.id,
            });
          }
        }
      },
      (err) => {
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  checkSensor(e, i) {
    if (e) {
      this.service.ckeckSensor(e).subscribe(
        (res) => {
          if (res[`warning`]) {
            this.warning[i] = res[`warning`];
          } else {
            this.warning[i] = null;
          }
          // if (res[`warning`]) {
          //   Swal.fire({
          //     title: "Please Confirm?",
          //     text: res[`warning`],
          //     icon: "warning",
          //     showCancelButton: true,
          //     confirmButtonText: "OK",
          //     cancelButtonText: "CANCEL",
          //   });
          // }
        },
        (err) => {
          console.log(" : err ==> ", err);
          this.spinner.hide();
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
    } else {
      this.warning[i] = null;
    }
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (
      typeof (control.value || "") === "string" ||
      (control.value || "") instanceof String
    ) {
      const isWhitespace = (control.value || "").trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  validateSensorsList() {
    const sList = this.myForm.controls["sensor_data"].value;
    const multipleNull = [];
    sList.forEach((element) => {
      if (element.removed_at === null) {
        multipleNull.push(element.removed_at);
      }
    });

    if (multipleNull.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
    this.isCreateSensorFormSubmitted = false;
  }

  createSensor(valid) {
    this.isCreateSensorFormSubmitted = true;
    if (valid) {
      const createSensorObj = {
        ...this.createSensorForm.value,
        site: this.site_id,
        deleted_at: null,
      };

      this.service.CreateSensor(createSensorObj).subscribe(
        (res) => {
          if (res[`detail`]) {
            this.toastr.success("Sensor Created Sucessfully.", "Success!", {
              timeOut: 3000,
            });
            this.createSensorForm.reset();
            this.isCreateSensorFormSubmitted = false;
            this.display = false;
            // this.sensorList();
            this.spinner.hide();
          }
        },
        (err) => {
          console.log(" : err ==> ", err);
          this.spinner.hide();
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
    }
  }

  onSubmit(formValid, myFormvalid) {
    this.finalSensorData = [];
    this.isFormSubmitted = true;
    this.submitted = true;
    if (formValid && myFormvalid) {
      if (this.validateSensorsList()) {
        this.toastr.show(
          "Please check and adjust removed at time it can't be blank more than one sensor.",
          "Alert"
        );
        return;
      }
      this.spinner.show();
      if (this.site_id != null && this.installation_id != null) {
        for (
          let index = 0;
          index < this.myForm.value.sensor_data.length;
          index++
        ) {
          const element = this.myForm.value.sensor_data[index];
          let obj;
          if (element.removed_at !== null) {
            obj = {
              id: element.id,
              temperature_sensor: element.temperature_sensor,
              installed_at: moment(element.installed_at)
                .utc()
                .set({ second: 0 })
                .format(),
              removed_at: moment(element.removed_at)
                .utc()
                .set({ second: 0 })
                .format(),
            };
          } else {
            obj = {
              id: element.id,
              temperature_sensor: element.temperature_sensor,
              installed_at: moment(element.installed_at)
                .utc()
                .set({ second: 0 })
                .format(),
              removed_at: null,
            };
          }

          this.finalSensorData.push(obj);
        }

        const updatedData = {
          ...this.form.value,
          id: parseInt(this.installation_id, 10),
          site: parseInt(this.site_id, 10),
        };
        const UpdateSensors = {
          sensor_data: this.finalSensorData,
          installation_data: updatedData,
          site: parseInt(this.site_id, 10),
        };

        this.service.updateSensor(UpdateSensors).subscribe(
          (result) => {
            if (result[`detail`]) {
              this.toastr.success(
                "Installation Updated Sucessfully",
                "Success!",
                {
                  timeOut: 3000,
                }
              );
              this.form.reset();
              this.myForm.reset();
              this.router.navigate(["site/overview/" + this.site_id]);
              // this.router.navigate(["site/installation_detail"], {
              //   queryParams: {
              //     site_id: this.site_id,
              //     installation_id: this.installation_id,
              //   },
              // });
              this.spinner.hide();
            }
          },
          (err) => {
            this.spinner.hide();
            this.errorList = [];
            console.log(" : err ==> ", err);
            if (err.error.date_issues) {
              for (
                let index = 0;
                index < err.error.date_issues.length;
                index++
              ) {
                const element = err.error.date_issues[index];
                console.log(" : element ==> ", element);
                this.errorList.push(element);
                this.display = true;
              }
            }

            if (err.error.already_available_list) {
              for (
                let index = 0;
                index < err.error.already_available_list.length;
                index++
              ) {
                const element = err.error.already_available_list[index];

                const current_temperature_sensor =
                  element.current_temperature_sensor;
                let current_installed_at = null;
                let current_removed_at = null;
                let old_installed_at = null;
                let old_removed_at = null;
                if (element.current_installed_at != null) {
                  current_installed_at = moment(
                    new Date(element.current_installed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  current_installed_at = null;
                }

                if (element.current_removed_at != null) {
                  current_removed_at = moment(
                    new Date(element.current_removed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  current_removed_at = null;
                }

                if (element.old_installed_at != null) {
                  old_installed_at = moment(
                    new Date(element.old_installed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  old_installed_at = null;
                }

                if (element.old_removed_at != null) {
                  old_removed_at = moment(
                    new Date(element.old_removed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  old_removed_at = null;
                }

                const old_sensor_installation_name =
                  element.old_sensor_installation_name;
                const old_sensor_temperature_sensor =
                  element.old_sensor_temperature_sensor;
                const errorString =
                  current_temperature_sensor +
                  " --> " +
                  current_installed_at +
                  " to " +
                  current_removed_at +
                  " is already time slot registered by " +
                  old_sensor_installation_name +
                  " and " +
                  old_sensor_temperature_sensor +
                  " with time " +
                  old_installed_at +
                  " to " +
                  old_removed_at;

                this.errorList.push(errorString);
              }
              // this.errorList =  ;
              this.display = true;
            } else if (err.error[`detail`]) {
              this.toastr.error(err.error[`detail`], "Error!", {
                timeOut: 3000,
              });
            } else if (err.error[`detail`]) {
              this.toastr.error(err.error[`detail`], "Error!", {
                timeOut: 3000,
              });
            } else if (err.error[`error`]) {
              this.toastr.error(err.error[`error`], "Error!", {
                timeOut: 3000,
              });
            }
          }
        );
      } else {
        // return false;
        for (
          let index = 0;
          index < this.myForm.value.sensor_data.length;
          index++
        ) {
          const element = this.myForm.value.sensor_data[index];
          let obj;
          if (element.removed_at !== null) {
            obj = {
              id: element.id,
              temperature_sensor: element.temperature_sensor,
              installed_at: moment(element.installed_at)
                .utc()
                .set({ second: 0 })
                .format(),
              removed_at: moment(element.removed_at)
                .utc()
                .set({ second: 0 })
                .format(),
            };
          } else {
            obj = {
              id: element.id,
              temperature_sensor: element.temperature_sensor,
              installed_at: moment(element.installed_at)
                .utc()
                .set({ second: 0 })
                .format(),
              removed_at: null,
            };
          }

          this.finalSensorData.push(obj);
        }

        const sensor_obj = {
          sensor_data: this.finalSensorData,
          installation_data: this.form.value,
          site: parseInt(this.site_id, 10),
        };
        this.service.addSensor(sensor_obj).subscribe(
          (result) => {
            if (result[`detail`]) {
              this.toastr.success(
                "Installation Added Sucessfully.",
                "Success!",
                {
                  timeOut: 3000,
                }
              );
              this.form.reset();
              this.myForm.reset();
              this.router.navigate(["site/overview/" + this.site_id]);
              this.spinner.hide();
            }
          },
          (err) => {
            this.spinner.hide();
            this.errorList = [];
            if (err.error.date_issues) {
              for (
                let index = 0;
                index < err.error.date_issues.length;
                index++
              ) {
                const element = err.error.date_issues[index];
                console.log(" : element ==> ", element);
                this.errorList.push(element);
                this.display = true;
              }
            }

            if (err.error.already_available_list) {
              for (
                let index = 0;
                index < err.error.already_available_list.length;
                index++
              ) {
                const element = err.error.already_available_list[index];

                const current_temperature_sensor =
                  element.current_temperature_sensor;
                let current_installed_at = null;
                let current_removed_at = null;
                let old_installed_at = null;
                let old_removed_at = null;
                if (element.current_installed_at != null) {
                  current_installed_at = moment(
                    new Date(element.current_installed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  current_installed_at = null;
                }

                if (element.current_removed_at != null) {
                  current_removed_at = moment(
                    new Date(element.current_removed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  current_removed_at = null;
                }

                if (element.old_installed_at != null) {
                  old_installed_at = moment(
                    new Date(element.old_installed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  old_installed_at = null;
                }

                if (element.old_removed_at != null) {
                  old_removed_at = moment(
                    new Date(element.old_removed_at)
                  ).format("YYYY-MM-DD HH:mm");
                } else {
                  old_removed_at = null;
                }

                const old_sensor_installation_name =
                  element.old_sensor_installation_name;
                const old_sensor_temperature_sensor =
                  element.old_sensor_temperature_sensor;
                const errorString =
                  current_temperature_sensor +
                  " --> " +
                  current_installed_at +
                  " to " +
                  current_removed_at +
                  " is already time slot registered by " +
                  old_sensor_installation_name +
                  " and " +
                  old_sensor_temperature_sensor +
                  " with time " +
                  old_installed_at +
                  " to " +
                  old_removed_at;

                this.errorList.push(errorString);
              }
              // this.errorList =  ;
              this.display = true;
            } else if (err.error[`detail`]) {
              this.toastr.error(err.error[`detail`], "Error!", {
                timeOut: 3000,
              });
            } else if (err.error[`error`]) {
              this.toastr.error(err.error[`error`], "Error!", {
                timeOut: 3000,
              });
            }
          }
        );
      }
    }
  }

  onBack() {
    if (this.editMode === false) {
      this.router.navigate(["site/overview/" + this.site_id]);
    } else {
      this.router.navigate(["site/overview/" + this.site_id]);
      // this.router.navigate(["site/installation_detail"], {
      //   queryParams: {
      //     site_id: this.site_id,
      //     installation_id: this.installation_id,
      //   },
      // });
    }
  }
}

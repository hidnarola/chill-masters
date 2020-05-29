import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
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
  selector: "app-add-fridge",
  templateUrl: "./add-fridge.component.html",
  styleUrls: ["./add-fridge.component.css"],
})
export class AddFridgeComponent implements OnInit {
  form: FormGroup;
  myForm: FormGroup;
  createSensorForm: FormGroup;
  sensor_data: FormArray;
  value = false;
  submitted = false;
  public isFormSubmitted;
  public isCreateSensorFormSubmitted;
  store_id: any;
  fridge_id: any;
  storeList: any = [{ label: "Select Location", value: "" }];
  sensorsList: any = [{ label: "Select Sensor", value: "" }];
  originalSensorsList: any = [];
  currentSensor: number = null;
  updatedSensor: any = [];
  getSensorsById: any = [];
  finalSensorData: any = [];
  editMode = false;
  PageTitle = "Add New Fridge";
  display: boolean = false;
  currentIndex = null;
  tempSensorData: any = [];
  errorList: any = [];
  warning: any = [];

  selectedStorenmae: any;
  // minimumDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private service: MyStoreService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.store_id = params.get("store_id");
      this.fridge_id = params.get("fridge_id");
    });
  }

  ngOnInit(): void {
    this.storelist();
    // this.sensorList();
    this.form = this.fb.group({
      store: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      fridge_name: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      fridge_content: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      fridge_description: new FormControl("", [
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

    if (this.store_id != null && this.fridge_id != null) {
      this.spinner.show();
      this.editMode = true;
      this.PageTitle = "Edit Fridge";
      const obj = {
        store_id: parseInt(this.store_id, 10),
        fridge_id: parseInt(this.fridge_id, 10),
      };
      this.service.getFreidgeById(obj).subscribe(
        (res) => {
          this.form.controls[`store`].setValue(res[`fridge_data`][`store`]);
          this.form.controls[`fridge_name`].setValue(
            res[`fridge_data`][`fridge_name`]
          );
          this.form.controls[`fridge_content`].setValue(
            res[`fridge_data`][`fridge_content`]
          );
          this.form.controls[`fridge_description`].setValue(
            res[`fridge_data`][`fridge_description`]
          );
          this.form.controls[`storage_range_min`].setValue(
            res[`fridge_data`][`storage_range_min`]
          );
          this.form.controls[`storage_range_max`].setValue(
            res[`fridge_data`][`storage_range_max`]
          );
          this.form.controls[`created_by`].setValue(
            res[`fridge_data`][`created_by`]
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
      this.form.controls[`store`].setValue(parseInt(this.store_id, 10));
    }
  }

  get f() {
    return this.myForm.controls.sensor_data["controls"];
  }

  getSensor() {
    const sensorObj = {
      fridge_id: this.fridge_id,
      store_id: this.store_id,
    };

    this.service.getSensor(sensorObj).subscribe(
      (res) => {
        this.getSensorsById = res[`sensor_fridge_data`];
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
        sensor_fridge_id: this.sensor_data.value[index][`id`],
        store: parseInt(this.store_id, 10),
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
      console.log(this.warning);
      this.spinner.hide();
    }
    return false;
  }

  deleteFridge() {
    this.spinner.show();
    const deleteObj = {
      fridge_id: parseInt(this.fridge_id, 10),
      store_id: parseInt(this.store_id, 10),
      delete_status: true,
    };

    this.service.deleteFridge(deleteObj).subscribe(
      (res) => {
        console.log(" : res ==> ", res);
        this.toastr.success("Fridge Deleted Sucessfully", "Success!", {
          timeOut: 3000,
        });
        this.router.navigate(["store/overview/" + this.store_id]);
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

  storelist() {
    this.service.mystore_list().subscribe(
      (res) => {
        const store = res;
        this.storeList = [];
        if (store.length > 0) {
          for (const item of store) {
            this.storeList.push({
              label: item.store.store_name,
              value: item.store.id,
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
    console.log(" : e.value, i ==> ", e);
    if (e) {
      this.service.ckeckSensor(e).subscribe(
        (res) => {
          console.log(res);

          if (res[`warning`]) {
            this.warning[i] = res[`warning`];
            console.log(this.warning);
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
      console.log(this.warning);

      // this.submitted = true;
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
    console.log(sList);
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
    // const sensorIndexes = sList.map((v) => v.temperature_sensor);
    // const isD = sensorIndexes.some((v, i) => sensorIndexes.indexOf(v) !== i);
    // console.log({ sList, sensorIndexes, isD });
    // return isD;
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
    this.isCreateSensorFormSubmitted = false;
  }

  createSensor(valid) {
    console.log(' : "hi" ==> ', "hi");
    this.isCreateSensorFormSubmitted = true;
    if (valid) {
      const createSensorObj = {
        ...this.createSensorForm.value,
        store: this.store_id,
        deleted_at: null,
      };
      console.log(" : this.createSensorForm ==> ", createSensorObj);

      this.service.CreateSensor(createSensorObj).subscribe(
        (res) => {
          console.log(" : res ==> ", res);
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
      if (this.store_id != null && this.fridge_id != null) {
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
          id: parseInt(this.fridge_id, 10),
          store: parseInt(this.store_id, 10),
        };
        const UpdateSensors = {
          sensor_data: this.finalSensorData,
          fridge_data: updatedData,
          store: parseInt(this.store_id, 10),
        };

        this.service.updateSensor(UpdateSensors).subscribe(
          (result) => {
            console.log(" : res ==> ");
            if (result[`detail`]) {
              this.toastr.success("Fridge Updated Sucessfully", "Success!", {
                timeOut: 3000,
              });
              this.form.reset();
              this.myForm.reset();
              this.router.navigate(["store/fridge_detail"], {
                queryParams: {
                  store_id: this.store_id,
                  fridge_id: this.fridge_id,
                },
              });
              this.spinner.hide();
            }
          },
          (err) => {
            this.spinner.hide();
            this.errorList = [];
            if (err.error.already_available_list) {
              for (
                let index = 0;
                index < err.error.already_available_list.length;
                index++
              ) {
                const element = err.error.already_available_list[index];
                console.log(" : element ==> ", element);
                const current_temperature_sensor =
                  element.current_temperature_sensor;
                let current_installed_at = null;
                let current_removed_at = null;
                let old_installed_at = null;
                let old_removed_at = null;
                if (element.current_installed_at != null) {
                  current_installed_at = moment(
                    new Date(element.current_installed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  current_installed_at = null;
                }

                if (element.current_removed_at != null) {
                  current_removed_at = moment(
                    new Date(element.current_removed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  current_removed_at = null;
                }

                if (element.old_installed_at != null) {
                  old_installed_at = moment(
                    new Date(element.old_installed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  old_installed_at = null;
                }

                if (element.old_removed_at != null) {
                  old_removed_at = moment(
                    new Date(element.old_removed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  old_removed_at = null;
                }

                const old_sensor_fridge_name = element.old_sensor_fridge_name;
                const old_sensor_temperature_sensor =
                  element.old_sensor_temperature_sensor;
                const errorString =
                  current_temperature_sensor +
                  " --> " +
                  current_installed_at +
                  " to " +
                  current_removed_at +
                  " is already time slot registered by " +
                  old_sensor_fridge_name +
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
              console.log(" : err ==> ", this.errorList);
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
        console.log(" : this.myForm ==> ", this.myForm);
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
          fridge_data: this.form.value,
          store: parseInt(this.store_id, 10),
        };
        this.service.addSensor(sensor_obj).subscribe(
          (result) => {
            console.log(" : res ==> ", result);
            if (result[`detail`]) {
              this.toastr.success("Fridge Added Sucessfully.", "Success!", {
                timeOut: 3000,
              });
              this.form.reset();
              this.myForm.reset();
              this.router.navigate(["store/overview/" + this.store_id]);
              this.spinner.hide();
            }
          },
          (err) => {
            this.spinner.hide();
            this.errorList = [];
            if (err.error.already_available_list) {
              for (
                let index = 0;
                index < err.error.already_available_list.length;
                index++
              ) {
                const element = err.error.already_available_list[index];
                console.log(" : element ==> ", element);
                const current_temperature_sensor =
                  element.current_temperature_sensor;
                let current_installed_at = null;
                let current_removed_at = null;
                let old_installed_at = null;
                let old_removed_at = null;
                if (element.current_installed_at != null) {
                  current_installed_at = moment(
                    new Date(element.current_installed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  current_installed_at = null;
                }

                if (element.current_removed_at != null) {
                  current_removed_at = moment(
                    new Date(element.current_removed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  current_removed_at = null;
                }

                if (element.old_installed_at != null) {
                  old_installed_at = moment(
                    new Date(element.old_installed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  old_installed_at = null;
                }

                if (element.old_removed_at != null) {
                  old_removed_at = moment(
                    new Date(element.old_removed_at)
                  ).format("MM-DD-YYYY HH:mm");
                } else {
                  old_removed_at = null;
                }

                const old_sensor_fridge_name = element.old_sensor_fridge_name;
                const old_sensor_temperature_sensor =
                  element.old_sensor_temperature_sensor;
                const errorString =
                  current_temperature_sensor +
                  " --> " +
                  current_installed_at +
                  " to " +
                  current_removed_at +
                  " is already time slot registered by " +
                  old_sensor_fridge_name +
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
              console.log(" : err ==> ", this.errorList);
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
    console.log(" : this.editMode ==> ", this.editMode);
    if (this.editMode === false) {
      this.router.navigate(["store/overview/" + this.store_id]);
    } else {
      this.router.navigate(["store/fridge_detail"], {
        queryParams: {
          store_id: this.store_id,
          fridge_id: this.fridge_id,
        },
      });
    }
  }
}

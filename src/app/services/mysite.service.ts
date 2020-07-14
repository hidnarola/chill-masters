import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import * as env from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class MySiteService {
  private url = env.environment.API_URL;

  constructor(public router: Router, private http: HttpClient) {}

  mysite_list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + "api/user/site/", {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  site_users(id): Observable<any[]> {
    const obj = {
      site_id: id,
    };
    return this.http.post<any[]>(`${this.url}` + "api/user/site/", obj, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  changePemission(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "api/user/site/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  changeAlert(data): Observable<any[]> {
    return this.http.patch<any[]>(`${this.url}` + "api/user/site/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  changeMyalert(data): Observable<any[]> {
    return this.http.put<any[]>(
      `${this.url}` + "api/user/site/myalert/",
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  filteruser(username): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.url}` + "useraccount/profile/?search=" + username,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  addUser(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/adduser/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  addInstallation(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/installation/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  overviewList(data, page): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/site/installation/?page_size=10&page=" + page,
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  overviewListByPage(url, data): Observable<any[]> {
    return this.http.post<any[]>(`${url}`, data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  deletedInstallationList(data, page): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/site/installation/?page_size=10&page=" + page,
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  deletedInstallationListByPage(url, data): Observable<any[]> {
    return this.http.post<any[]>(`${url}`, data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  installationDetail(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/installation/graph/",
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  getInstallationById(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/installation/particular/",
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  updateInstallation(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "api/installation/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  sensorList(id): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.url}` + "api/device/sensor/" + id + "/",
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  addSensor(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  ckeckSensor(name): Observable<any[]> {
    // /api/sensor/?id=&&sensor_id=F13-30000013
    return this.http.get<any[]>(
      `${this.url}` + "api/sensor/?sensor_id=" + name,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  getSensor(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/get/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  updateSensor(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "api/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  deleteInstallation(data): Observable<any[]> {
    return this.http.patch<any[]>(`${this.url}` + "api/installation/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  CreateSensor(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/device/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  deleteSensor(data): Observable<any[]> {
    return this.http.patch<any[]>(`${this.url}` + "api/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }
}

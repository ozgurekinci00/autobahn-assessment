import axios from 'axios';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://verkehr.autobahn.de/o/autobahn/';

  constructor() {}

  getAutobahnData(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      axios.get(this.apiUrl)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getRoadworks(roadId: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      axios.get(`${this.apiUrl}${roadId}/services/roadworks`)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}

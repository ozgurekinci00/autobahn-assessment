import axios from 'axios';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://verkehr.autobahn.de/o/autobahn/';

  constructor() {}

  private fetchData(url: string): Observable<any> {
    return new Observable((observer: any) => {
      axios
        .get(url)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getAutobahns(): Observable<any> {
    return this.fetchData(this.apiUrl);
  }

  private getDataForService(roadId: string, service: string): Observable<any> {
    const url = `${this.apiUrl}${roadId}/services/${service}`;
    return this.fetchData(url);
  }

  getRoadworks(roadId: string): Observable<any> {
    return this.getDataForService(roadId, 'roadworks');
  }

  getRestAreas(roadId: string): Observable<any> {
    return this.getDataForService(roadId, 'parking_lorry');
  }

  getTrafficReports(roadId: string): Observable<any> {
    return this.getDataForService(roadId, 'warning');
  }

  getSuspensions(roadId: string): Observable<any> {
    return this.getDataForService(roadId, 'closure');
  }

  getChargingStations(roadId: string): Observable<any> {
    return this.getDataForService(roadId, 'electric_charging_station');
  }

  getTableData(roadId: string): Observable<any> {
    const roadworksData$ = this.getRoadworks(roadId);
    const restAreasData$ = this.getRestAreas(roadId);
    const trafficReportsData$ = this.getTrafficReports(roadId);
    const suspensionsData$ = this.getSuspensions(roadId);
    const chargingStationsData$ = this.getChargingStations(roadId);

    return forkJoin({
      roadworksData: roadworksData$,
      restAreasData: restAreasData$,
      trafficReportsData: trafficReportsData$,
      suspensionsData: suspensionsData$,
      chargingStationsData: chargingStationsData$,
    }).pipe(
      catchError((error) => {
        console.error('Error fetching table data:', error);
        return [];
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { ExtractedInfo, AllRoadInfos, CommonFields, AllRoadExtractedInfos } from './interfaces/CommonInfoFields';

@Injectable({
  providedIn: 'root'
})

export class ParserService {
  propEnum = {
    roadworksData: 'roadworks',
    restAreasData: 'parking_lorry',
    trafficReportsData: 'warning',
    suspensionsData: 'closure',
    chargingStationsData: 'electric_charging_station'
  };

  constructor() { }

  parseInfo(data: AllRoadInfos): any {
    let parsedData: any = {};

    for (let [key, value] of Object.entries(data)) {
      const tmp = this.propEnum[key as keyof typeof this.propEnum];
      value = value[tmp].map((item: CommonFields) => (({title, subtitle, coordinate, isBlocked}) => ({title, subtitle, coordinate, isBlocked}))(item));
      parsedData[key as keyof typeof parsedData] = value;
    }

    return parsedData;
  } 
}
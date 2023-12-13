import { Injectable } from '@angular/core';
import { AllRoadInfos, CommonFields, ExtractedInfo } from '../interfaces/CommonInfoFields';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  propEnum = {
    roadworksData: 'roadworks',
    restAreasData: 'parking_lorry',
    trafficReportsData: 'warning',
    suspensionsData: 'closure',
    chargingStationsData: 'electric_charging_station',
  };

  constructor() {}

  parseInfo(data: AllRoadInfos): ExtractedInfo {
    let parsedData: ExtractedInfo = {
      title: '',
      subtitle: '',
      coordinate: {
        lat: '',
        long: ''
      },
      isBlocked: '',
      description: []
    };

    for (let [key, value] of Object.entries(data)) {
      const tmp = this.propEnum[key as keyof typeof this.propEnum];
      value = value[tmp].map((item: CommonFields) =>
        (({ title, subtitle, coordinate, isBlocked, description }) => ({
          title,
          subtitle,
          coordinate,
          isBlocked,
          description,
        }))(item)
      );
      parsedData[key as keyof typeof parsedData] = value;
    }

    return parsedData;
  }
}

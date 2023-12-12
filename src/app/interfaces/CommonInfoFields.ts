import { MatTableDataSource } from "@angular/material/table";

export interface CommonFields {
  coordinate: {
    lat: string;
    long: string;
  };
  description: string[];
  display_type: string;
  extent: string;
  footer: string[];
  future: boolean;
  icon: string;
  identifier: string;
  isBlocked: string;
  lorryParkingFeatureIcons: ParkingFeatureIcons[];
  point: string;
  routeRecommendation: string[];
  subtitle: string;
  title: string;
  startTimestamp?: string;
}

export interface ParkingFeatureIcons {
  description: string;
  icon: string;
  style: string;
}

export interface ExtractedInfo {
  title: string;
  subtitle: string;
  coordinate: Coordinate;
  isBlocked: string;
}

export interface AllRoadExtractedInfos {
  [key: string]: ExtractedInfo[];
  roadworksData: ExtractedInfo[];
  restAreasData: ExtractedInfo[];
  trafficReportsData: ExtractedInfo[];
  suspensionsData: ExtractedInfo[];
  chargingStationsData: ExtractedInfo[];
}

export interface AllRoadInfos {
  roadworksData: {
    roadworks: CommonFields[];
  };
  restAreasData: {
    parking_lorry: CommonFields[];
  };
  trafficReportsData: {
    warning: CommonFields[];
  };
  suspensionsData: {
    closure: CommonFields[];
  };
  chargingStationsData: {
    electric_charging_station: CommonFields[];
  };
}

export interface Coordinate {
  lat: string;
  long: string;
}

export interface ExampleTab {
  label: string;
  content: ExtractedInfo[];
}

export interface State {
  roads: never[];
  selectedRoad: string;
  tabsData: {
    constructionSites: { roadworks: never[] };
    trafficReports: { warning: never[] };
    restAreas: { parking_lorry: never[] };
    suspensions: { closure: never[] };
    chargingStations: { electric_charging_station: never[] };
  };
  selectedTabIndex: number;
  selectedRow: null;
  markerPositions: never[];
  center: { lat: number; lng: number },
  zoom: number,
  parsedData: {
    roadworksData: never[],
    restAreasData: never[],
    trafficReportsData: never[],
    suspensionsData: never[],
    chargingStationsData: never[],
  },
  asyncTabs: any
  tabDataSources: MatTableDataSource<ExtractedInfo>[],
  infoWindowContent: string
}

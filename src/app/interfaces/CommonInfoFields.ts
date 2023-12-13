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

export interface WholeRawRoadsData {
  [key: string]: CommonFields[];
  roadworksData: CommonFields[];
  restAreasData: CommonFields[];
  trafficReportsData: CommonFields[];
  suspensionsData: CommonFields[];
  chargingStationsData: CommonFields[];
}

export interface Roads {
  roads: string[]
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
  description?: string[]
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
  roads: string[];
  selectedRoad: string;
  tabsData: {
    constructionSites: { roadworks: CommonFields[] };
    trafficReports: { warning: CommonFields[] };
    restAreas: { parking_lorry: CommonFields[] };
    suspensions: { closure: CommonFields[] };
    chargingStations: { electric_charging_station: CommonFields[] };
  };
  selectedTabIndex: number;
  selectedRow: ExtractedInfo | any;
  markerPositions: never[];
  center: { lat: number; lng: number },
  zoom: number,
  parsedData: {
    [key: string]: CommonFields[];
    roadworksData: CommonFields[],
    restAreasData: CommonFields[],
    trafficReportsData: CommonFields[],
    suspensionsData: CommonFields[],
    chargingStationsData: CommonFields[],
  },
  asyncTabs: any
  tabDataSources: MatTableDataSource<ExtractedInfo>[],
  infoWindowContent: string,
  paginator?: any
}

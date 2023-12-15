import { MatTableDataSource } from "@angular/material/table";

export interface RoadElement {
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

export interface RawRoadData {
  roadworksData: {
    roadworks: RoadElement[];
  };
  restAreasData: {
    parking_lorry: RoadElement[];
  };
  trafficReportsData: {
    warning: RoadElement[];
  };
  suspensionsData: {
    closure: RoadElement[];
  };
  chargingStationsData: {
    electric_charging_station: RoadElement[];
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
    constructionSites: { roadworks: RoadElement[] };
    trafficReports: { warning: RoadElement[] };
    restAreas: { parking_lorry: RoadElement[] };
    suspensions: { closure: RoadElement[] };
    chargingStations: { electric_charging_station: RoadElement[] };
  };
  selectedTabIndex: number;
  selectedRow: ExtractedInfo | any;
  markerPositions: never[];
  center: { lat: number; lng: number },
  zoom: number,
  parsedData: {
    [key: string]: RoadElement[];
    roadworksData: RoadElement[],
    restAreasData: RoadElement[],
    trafficReportsData: RoadElement[],
    suspensionsData: RoadElement[],
    chargingStationsData: RoadElement[],
  },
  asyncTabs: any
  tabDataSources: MatTableDataSource<ExtractedInfo>[],
  infoWindowContent: string,
  paginator?: any
}

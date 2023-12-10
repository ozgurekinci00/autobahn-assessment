export interface CommonFields {
    coordinate: {
        lat: string,
        long: string,
    },
    description: string[],
    display_type: string,
    extent: string,
    footer: string[],
    future: boolean,
    icon: string,
    identifier: string,
    isBlocked: string,
    lorryParkingFeatureIcons: ParkingFeatureIcons[],
    point: string,
    routeRecommendation: string[],
    subtitle: string,
    title: string,
    startTimestamp?: string,
}

export interface ParkingFeatureIcons {
    description: string,
    icon: string,
    style: string,
}

export interface ExtractedInfo {
    title: string,
    subtitle: string,
    point: string,
    isBlocked: string
}

export interface AllRoadExtractedInfos {
    roadworksData: ExtractedInfo[],
    restAreasData: ExtractedInfo[],
    trafficReportsData: ExtractedInfo[],
    suspensionsData: ExtractedInfo[],
    chargingStationsData: ExtractedInfo[]
}

export interface AllRoadInfos {
    roadworksData: {
        roadworks: CommonFields[]
    },
    restAreasData: {
        parking_lorry: CommonFields[]
    },
    trafficReportsData: {
        warning: CommonFields[]
    },
    suspensionsData: {
        closure: CommonFields[]
    },
    chargingStationsData: {
        electric_charging_station: CommonFields[]
    }
};
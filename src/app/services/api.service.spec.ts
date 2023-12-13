import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Roads, CommonFields } from '../interfaces/CommonInfoFields';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://verkehr.autobahn.de/o/autobahn/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch autobahns', () => {
    // Arrange
    const mockAutobahns: Roads = {
      roads: ['A1', 'A2', 'A3']
    }; // fill here with mock data
    // Act
    service.getAutobahns().subscribe((data: Roads) => {
      // Assert
      expect(data).toEqual(mockAutobahns);
    });
    const req = httpMock.expectOne(`${apiUrl}`, 'call to api');
    expect(req.request.method).toBe('GET');
    req.flush(mockAutobahns); // Provide mock data as the response
  });

  it('should fetch roadworks', () => {
    // Arrange
    const mockRoadId = 'A1'; // replace as necessary
    const mockRoadworks: CommonFields = {
      coordinate: {
        lat: '',
        long: '',
      },
      description: ['', '', ''],
      display_type: '',
      extent: '',
      footer: ['', '', ''],
      future: true,
      icon: '',
      identifier: '',
      isBlocked: '',
      lorryParkingFeatureIcons: [{ description: '', icon: '', style: ''}],
      point: '',
      routeRecommendation: ['', '', ''],
      subtitle: '',
      title: '',
      startTimestamp: '',
    }; // fill here with mock data
    // Act
    service.getRoadworks(mockRoadId).subscribe((data: CommonFields) => {
      // Assert
      expect(data).toEqual(mockRoadworks);
    });
    const req = httpMock.expectOne(`${apiUrl}${mockRoadId}/services/roadworks`, 'call to api');
    expect(req.request.method).toBe('GET');
    req.flush(mockRoadworks); // Provide mock data as the response
  });

  // repeat the same for rest of the methods like getRestAreas, getTrafficReports, etc. 

});
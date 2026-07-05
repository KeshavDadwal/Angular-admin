export class TransportRoute {
  id: string;
  route_name: string;
  start_point: string;
  end_point: string;
  distance: string;
  vehicle_no: string;
  route_fees: string;
  status: string;

  constructor(route: Partial<TransportRoute>) {
    this.id = route.id || '';
    this.route_name = route.route_name || '';
    this.start_point = route.start_point || '';
    this.end_point = route.end_point || '';
    this.distance = route.distance || '';
    this.vehicle_no = route.vehicle_no || '';
    this.route_fees = route.route_fees || '';
    this.status = route.status || '';
  }
}

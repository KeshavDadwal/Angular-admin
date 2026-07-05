export class Vehicle {
  id: string;
  vehicle_no: string;
  vehicle_model: string;
  year_made: string;
  driver_name: string;
  driver_license: string;
  vehicle_type: string;
  status: string;
  img: string;

  constructor(vehicle: Partial<Vehicle>) {
    this.id = vehicle.id || '';
    this.vehicle_no = vehicle.vehicle_no || '';
    this.vehicle_model = vehicle.vehicle_model || '';
    this.year_made = vehicle.year_made || '';
    this.driver_name = vehicle.driver_name || '';
    this.driver_license = vehicle.driver_license || '';
    this.vehicle_type = vehicle.vehicle_type || '';
    this.status = vehicle.status || '';
    this.img = vehicle.img || 'assets/images/user/user1.jpg';
  }
}

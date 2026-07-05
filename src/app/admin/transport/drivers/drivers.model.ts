export class Driver {
  id: string;
  driver_name: string;
  license_no: string;
  phone: string;
  joining_date: string;
  address: string;
  experience: string;
  status: string;
  img: string;

  constructor(driver: Partial<Driver>) {
    this.id = driver.id || '';
    this.driver_name = driver.driver_name || '';
    this.license_no = driver.license_no || '';
    this.phone = driver.phone || '';
    this.joining_date = driver.joining_date || '';
    this.address = driver.address || '';
    this.experience = driver.experience || '';
    this.status = driver.status || '';
    this.img = driver.img || 'assets/images/user/user1.jpg';
  }
}

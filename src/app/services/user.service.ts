import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address; 
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}



@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  getUsers() {
    // Using JSONPlaceholder API for testing - fetches all users
    return this.http.get<User[]>(this.apiUrl);
  }

  // 🎯 Method mới: Lấy thông tin 1 user theo ID
  getUserById(id: number) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  constructor(private http: HttpClient) {}
}

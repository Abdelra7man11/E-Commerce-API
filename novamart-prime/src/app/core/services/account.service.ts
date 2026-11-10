import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, LoginDto, RegisterDto, User } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private baseUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    // Immediately & synchronously restore user session from localStorage so refresh never logs out
    const savedUser = localStorage.getItem('tp_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        if (parsed && parsed.token) {
          this.currentUser.set(parsed);
        }
      } catch {
        localStorage.removeItem('tp_user');
      }
    }
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('tp_token');
    if (!token) {
      this.currentUser.set(null);
      return of(null);
    }

    return this.http.get<User>(this.baseUrl + 'Authentication').pipe(
      map(user => {
        if (user) {
          localStorage.setItem('tp_token', user.token);
          localStorage.setItem('tp_user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.currentUser.set(user);
        }
      },
      error: (err) => {
        // Only log out if the backend explicitly reports 401 Unauthorized (token expired)
        if (err?.status === 401) {
          this.logout();
        }
        // If server is restarting or network is slow, keep current session intact!
      }
    });
  }

  login(values: LoginDto) {
    return this.http.post<User>(this.baseUrl + 'Authentication/Login', values).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('tp_token', user.token);
          localStorage.setItem('tp_user', JSON.stringify(user));
          this.currentUser.set(user);
          this.toast.success(`Welcome back, ${user.displayName}!`);
        }
        return user;
      })
    );
  }

  register(values: RegisterDto) {
    return this.http.post<User>(this.baseUrl + 'Authentication/Register', values).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('tp_token', user.token);
          localStorage.setItem('tp_user', JSON.stringify(user));
          this.currentUser.set(user);
          this.toast.success(`Account created successfully! Welcome, ${user.displayName}`);
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
    this.currentUser.set(null);
    this.toast.info('Logged out safely');
    this.router.navigateByUrl('/');
  }

  getUserAddress() {
    return this.http.get<Address | null>(this.baseUrl + 'Authentication/Address');
  }

  updateUserAddress(address: Address) {
    return this.http.put<Address>(this.baseUrl + 'Authentication/Address', address);
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'Authentication/emailexists?email=' + email);
  }
}

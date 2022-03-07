import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface TableRow<T> {
  data: T;
  edited: T | null;
  isEditing: boolean;
}

export interface IUser {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: TableRow<IUser>[] = [];
  dataFetched = false;

  constructor(private http: HttpClient) { }

  fetchData() {
    this.http.get('http://localhost:3000/users')
      .subscribe(users => {
        let data = users as IUser[]
        this.users = data.map(v => {
          return {
            data: v,
            edited: null,
            isEditing: false
          }
        });
      })
  }

  editUser(idx: number) {
    this.users[idx].isEditing = true;
    this.users[idx].edited = {
      ...this.users[idx].data
    }
  }

  cancelEdit(idx: number) {
    this.users[idx].isEditing = false;
  }

  updateUser(idx: number) {
    try {
      const updatedUser = this.users[idx].edited;
      this.#validateUser(updatedUser);
  
      if (!updatedUser) {
        throw new Error('Cannot find user')
      }

      this.http.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser)
        .subscribe(res => {
          this.users[idx].data = res as any;
          this.users[idx].edited = null;
          this.users[idx].isEditing = false;
        });
    } catch(err: any) {
      alert(err.message);
    }
  }

  deleteUser(idx: number) {
    const user = this.users[idx].data;
    this.http.delete(`http://localhost:3000/users/${user.id}`)
      .subscribe(res => {
        this.users.splice(idx, 1);
      })
  }

  #validateUser(user: any | undefined) {
    if (!user?.firstName) {
      throw new Error('First name is required')
    }

    if (!user?.email) {
      throw new Error('Email is required')
    }

    if (!user?.role) {
      throw new Error('Role is required')
    }
  }
}

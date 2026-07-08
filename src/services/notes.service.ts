import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseDTO} from './auth';

export interface Note {
  noteId:      number;
  userId:      number;
  title:       string;
  description: string;
  color:       string;
  image:       string;
  isArchived:  boolean;
  isTrashed:   boolean;
  isPinned:    boolean;
  createdAt:   string;
  modifiedAt:  string;
}

export interface NoteDTO {
  title:       string;
  description: string;
  color:       string;
  isPinned:    boolean;
  isArchived:  boolean;
  isTrashed:   boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private baseUrl = `${environment.apiUrl}/Notes`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getAllNotes(): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>(`${this.baseUrl}/getall`, this.getHeaders());
  }

  createNote(dto: NoteDTO): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.baseUrl}/create`, dto, this.getHeaders());
  }

  updateNote(id: number, dto: NoteDTO): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.baseUrl}/update/${id}`, dto, this.getHeaders());
  }

  deleteNote(id: number): Observable<ResponseDTO> {
    return this.http.delete<ResponseDTO>(`${this.baseUrl}/delete/${id}`, this.getHeaders());
  }

  trashNote(id: number): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.baseUrl}/trash/${id}`, {}, this.getHeaders());
  }

  archiveNote(id: number): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.baseUrl}/archive/${id}`, {}, this.getHeaders());
  }

  unarchiveNote(id: number): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.baseUrl}/unarchive/${id}`, {}, this.getHeaders());
  }

  recoverNote(id: number): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.baseUrl}/recover/${id}`, {}, this.getHeaders());
  }
}

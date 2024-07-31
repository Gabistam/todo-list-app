import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3050/api/todos';
  private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.http.get<Todo[]>(this.apiUrl).subscribe(
      todos => this.todosSubject.next(todos),
      error => console.error('Error loading todos', error)
    );
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string, description?: string): Observable<Todo> {
    const newTodo: Partial<Todo> = {
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    return this.http.post<Todo>(this.apiUrl, newTodo).pipe(
      tap(todo => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next([...currentTodos, todo]);
      })
    );
  }

  updateTodo(id: string, updates: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedTodo => {
        const currentTodos = this.todosSubject.value;
        const index = currentTodos.findIndex(todo => todo._id === id);
        if (index !== -1) {
          currentTodos[index] = updatedTodo;
          this.todosSubject.next([...currentTodos]);
        }
      })
    );
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next(currentTodos.filter(todo => todo._id !== id));
      })
    );
  }

  toggleTodoComplete(id: string): Observable<Todo> {
    const todo = this.todosSubject.value.find(t => t._id === id);
    if (todo) {
      return this.updateTodo(id, { completed: !todo.completed });
    }
    throw new Error('Todo not found');
  }
}
import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;

  constructor(private todoService: TodoService) { }

  toggleComplete(): void {
    this.todoService.toggleTodoComplete(this.todo._id).subscribe(
      () => {},
      error => console.error('Error toggling todo', error)
    );
  }

  deleteTodo(): void {
    this.todoService.deleteTodo(this.todo._id).subscribe(
      () => {},
      error => console.error('Error deleting todo', error)
    );
  }
}
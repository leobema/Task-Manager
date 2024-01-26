import { CommonModule } from '@angular/common';
import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { Task } from './../../Models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal('all');
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })


  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  injector = inject(Injector);


  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    effect(() =>{
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }

  updateTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();   
    if (value !== ''){
      this.addTask(value);
      this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks: Task[]) => [...tasks,newTask]);
  };

  updateTask(index: number) {
        /*
        this.tasks.update((tasks) => {
          return tasks.map((task, position) => {
            if (position === index) {
              return {
                ...task,
                completed: !task.completed
              }
            }
            return task;
          })
        });
      } 
       */
        
    this.tasks.update((prevState: Task[]) => {
      const currentTask = prevState[index];
      prevState[index] = {
        ...currentTask,
        completed: !currentTask.completed
      }
      return prevState;
    }) 
  }

  updateTaskText(index: number) {
    let value = '';
    if (this.updateTaskCtrl.valid) {
      value = this.updateTaskCtrl.value.trim();
    } else {
      return;
    }

    this.tasks.update((prevState: Task[]) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: value,
            editing: false,
          }
        }
        return task;
      })
    });
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((prevState: Task[]) => {
      return prevState.map((task, position) => {
        const editing = position === index;
        return {
          ...task,
          editing,
        }
        /* 
        if (position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }; 
        */
      })
    });
  }

  deleteTask(index: number) {
    this.tasks.update((tasks: Task[]) => { 
      // return tasks.splice(index, 1);
      tasks.splice(index, 1); // quitando el elemento y devolviendolo
      return tasks; // estamos retornando la lista sin el elementos que quitamos
    });
  }

  changeFilter(filter: string) {
    this.filter.set(filter);
  }

}

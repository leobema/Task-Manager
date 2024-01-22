import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  wellcome = 'Hola!';
  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear componentes',
  ]);
  name = signal('Leonardo');
  age = 18;
  disabled = true;
  img = 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo-Imagen%281%29.jpg';

  person = {
    name: 'Leonardo',
    age: 18,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo-Imagen%281%29.jpg'
  };

  clickHandler(){
      alert('Hola perro')
  };
  
  changeHandler(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  };

  keyownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  };

}

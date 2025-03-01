import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inscripcion,Estudiante, InfoInscripcion, InfoEstudiante } from './inscripcion';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  data: Inscripcion[] = [];
  private http = inject(HttpClient);
  codigo: string = '';
  identificacion: string = '';
  nombre: string = '';
  dataEstudiante: InfoEstudiante | undefined;

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'bg-gradient-to-r');
    this.renderer.addClass(document.body, 'from-gray-200');
    this.renderer.addClass(document.body, 'to-gray-50');
  }

  ngOnInit(): void {
    this.http
      .get<Inscripcion[]>('assets/inscripciones.json')
      .subscribe((response: Inscripcion[]) => {
        this.data = response;
      });
  }

  getEstudiantes(): Estudiante[] {
    return [...new Map(
      this.data.map(item => [item.estudiante.nombre, item.estudiante])).values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  getInfoEstudiante(codigo: string): InfoEstudiante {
    // Obtener las inscripciones del estudiante con el código dado
    const inscripciones: Inscripcion[] = this.data.filter(inscripcion => inscripcion.estudiante.codigo === codigo);

    // Asignar el estudiante de la primera inscripción encontrada
    const estudiante: Estudiante = inscripciones[0]?.estudiante;

    // Mapear las inscripciones para crear el array info
    const info: InfoInscripcion[] = inscripciones.map(inscripcion => ({
      grupo: inscripcion.grupo,
      notas: inscripcion.notas,
      definitiva: inscripcion.definitiva,
      inasistencia: inscripcion.inasistencia
    }));

    // Calcular el promedio de las definitivas
    const promedio: number = this.getPromedio(info);

    // Obtener el rendimiento basado en el promedio
    const rendimiento: string = this.getRendimiento(promedio);

    // Retornar el objeto InfoEstudiante
    return { estudiante, info, promedio, rendimiento };
  }

  getPromedio(info: InfoInscripcion[]): number {
    let totalDefinitivas = 0;
    info.forEach(inscripcion => totalDefinitivas += inscripcion.definitiva);
    return totalDefinitivas / info.length;
  }

  getRendimiento(promedio: number): string {
    if (promedio >= 4.4) return 'sobresaliente';
    if (promedio >= 3.9) return 'bueno';
    if (promedio >= 3.4) return 'aceptable';
    if (promedio >= 3) return 'regular';
    return 'deficiente';
  }

  getInfoEstudiantes(): InfoEstudiante[] {
    return this.getEstudiantes().map(estudiante => this.getInfoEstudiante(estudiante.codigo));
  }

  // Funcion personalizada
  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  getCreditos(horasSemana: number): number {
    return horasSemana / 3;
  }

  getDataGrupo(codigo: string): boolean {
    // Usar Array.find() para encontrar el grupo con el código dado
    const inscripcion = this.data.find(inscripcion => inscripcion.grupo.codigo === codigo);
  
    if (inscripcion) {
      console.log(inscripcion);
      return true;
    }
    return false;
  }

  // Vinculacion de propiedades
  getDataEstudiante(codigo: string) {
    if (codigo) {
      this.dataEstudiante = this.getInfoEstudiante(codigo);
      this.codigo = this.dataEstudiante.estudiante.codigo;
      this.identificacion = this.dataEstudiante.estudiante.identificacion;
      this.nombre = this.dataEstudiante.estudiante.nombre;
    }
  }
}


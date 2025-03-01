export type Estudiante = {
    identificacion: string;
    codigo: string;
    nombre: string;
    semestre: number;
  };
  
  export type Asignatura = {
    codigo: string;
    nombre: string;
    cuantitativa: boolean;
    horas: number;
  };
  
  export type Profesor = {
    identificacion: string;
    nombre: string;
    correo: string;
  };
  
  export type Grupo = {
    codigo: string;
    anio: number;
    periodo: number;
    cupo: number;
    horario: string;
    semanas: number;
    horasSemana: number;
    asignatura: Asignatura;
    profesor: Profesor;
  };
  
  export type Inscripcion = {
    estudiante: Estudiante;
    grupo: Grupo;
    notas: number[];
    definitiva: number;
    inasistencia: number;
  };
  
  export type InfoInscripcion = {
    grupo: Grupo;
    notas: number[];
    definitiva: number;
    inasistencia: number;
  };
  
  
  // la información de un estudiante consta de sus datos personales, un array de sus
  // inscripciones (InfoInscripcion[]), su promedio y su rendimiento
  export type InfoEstudiante = {
    estudiante: Estudiante;
    info: InfoInscripcion[];
    promedio?: number; // el promedio de las definitivas
    rendimiento?: string; // deficiente < 3, regular < 3.4, aceptable < 3.9, bueno < 4.4, sobresaliente
  };
import Genero from "./genero.entity";

class Alumno {
    id: string;
    nombre: string;
    apellidos: string;
    genero: Genero;
    fechaNacimiento: Date;
    fecha: any;
}

export default Alumno;
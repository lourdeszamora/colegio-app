import Alumno from "@/models/alumno.entity";
import AlumnoGrado from "@/models/alumno-grado.entity"; // Add this import statement
import Paginable from "@/models/paginable.interface";
import axios from "axios";

class AlumnosService {
    getAll = (page: number, pageSize:number, signal?:AbortSignal) => axios.get<Paginable<Alumno>>(`/alumnos?page=${page}&pageSize=${pageSize}`, {signal}).then(res => res.data);
    getgrado = (id: string) => axios.get<AlumnoGrado>(`/alumnos/${id}/grado`).then(res => res.data);
    create = (data: Alumno) => axios.post(`/alumnos`, data).then(res => res.data);
    update = (data: Alumno) => axios.put(`/alumnos/${data.id}`, data).then(res => res.data);
    delete = (id: string) => axios.delete(`/alumnos/${id}`).then(res => res.data);
    setGrado = (id: string, data: AlumnoGrado) => axios.put(`/alumnos/${id}/grado`,data).then(res => res.data);
}  

export default new AlumnosService();
import Paginable from "@/models/paginable.interface";
import Profesor from "@/models/profesor.entity";
import axios from "axios";

class ProfesoresService {
    getAll = (page: number, pageSize:number, signal?:AbortSignal) => axios.get<Paginable<Profesor>>(`/profesores?page=${page}&pageSize=${pageSize}`, {signal}).then(res => res.data);
    getbyId = (id: string) => axios.get<Profesor>(`/profesores/${id}`).then(res => res.data);
    create = (data: Profesor) => axios.post(`/profesores`, data).then(res => res.data);
    update = (data: Profesor) => axios.put(`/profesores/${data.id}`, data).then(res => res.data);
    delete = (id: string) => axios.delete(`/profesores/${id}`).then(res => res.data);
}

export default new ProfesoresService();
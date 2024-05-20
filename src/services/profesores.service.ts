import Profesor from "@/models/profesor.entity";
import axios from "axios";

class ProfesoresService {
    getAll = (page: number, pageSize:number, signal?:AbortSignal) => axios.get(`/profesores?page=${page}&pageSize=${pageSize}`, {signal}).then(res => res.data);
    getbyId = (id: string) => axios.get<Profesor>(`/profesores/${id}`).then(res => res.data);
}

export default new ProfesoresService();
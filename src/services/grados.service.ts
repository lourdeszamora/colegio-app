import Grado from "@/models/grado.entity";
import Paginable from "@/models/paginable.interface";
import axios from "axios";

class GradosService {
    getAll = (page: number, pageSize:number, signal?:AbortSignal) => axios.get<Paginable<Grado>>(`/grados?page=${page}&pageSize=${pageSize}`, {signal}).then(res => res.data);
    getbyId = (id: string) => axios.get<Grado>(`/grados/${id}`).then(res => res.data);
    create = (data: Grado) => axios.post(`/grados`, data).then(res => res.data);
    update = (data: Grado) => axios.put(`/grados/${data.id}`, data).then(res => res.data);
    delete = (id: string) => axios.delete(`/grados/${id}`).then(res => res.data);
}

export default new GradosService();
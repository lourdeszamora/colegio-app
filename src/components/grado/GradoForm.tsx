import { IFormProps } from "@/models/form-props.interface";
import Grado from "@/models/grado.entity";
import profesoresService from "@/services/profesores.service";
import { useQuery } from "@tanstack/react-query";
import { Form, Input,  Select } from "antd";
import { use, useEffect, useState } from "react";

const GradoForm = ({ form, onSubmit }: IFormProps<Grado>) => {
    const currentPage = 1;
    const [options, setOptions] = useState<{ label: string; value: any; }[]>([]);
    const {
        isLoading,
        isError,
        error,
        data: profesores,
      } = useQuery({
        queryKey: ['profesores', currentPage],
        queryFn: ({ signal }) => profesoresService.getAll(currentPage, 20, signal),
      });
      useEffect(() => { 
        if(profesores){
          const opts = profesores.data.map((profesor: any) => ({
            label: `${profesor.nombre} ${profesor.apellidos}`,
            value: profesor.id,
          }));
          setOptions(opts);
        }
      }, [profesores]);
        
    return (
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          label='Id'
          name='id'
          hidden
          rules={[{ required: true, message: 'Debe ingresar los nombres' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Nombre'
          name='nombre'
          rules={[{ required: true, message: 'Debe ingresar los nombres' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Profesor'
          name='profesorId'
          rules={[{ required: true, message: 'Especifique el genero' }]}
        >
          <Select placeholder='Seleccione el profesor' options={options}>
          </Select>
        </Form.Item>
      </Form>
    );
  };
  
  export default GradoForm;
  
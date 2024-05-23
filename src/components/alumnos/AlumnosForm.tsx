import Alumno from '@/models/alumno.entity';
import { IFormProps } from '@/models/form-props.interface';
import Genero from '@/models/genero.entity';
import { DatePicker, Form, Input, Select } from 'antd';
import React from 'react';

const AlumnoForm: React.FC = ({ form, onSubmit }: IFormProps<Alumno>) => {
  return (
    <Form form={form} onFinish={onSubmit} onValuesChange={(changedValues, values) =>{ values.fechaNacimiento = changedValues.fecha}}>
      <Form.Item
        label='Id'
        name='id'
        rules={[{ required: true, message: 'Debe ingresar el id' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Nombre'
        name='nombre'
        rules={[{ required: true, message: 'Debe ingresar el nombre' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Apellidos'
        name='apellidos'
        rules={[{ required: true, message: 'Debe ingresar los apellidos' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Genero'
        name='genero'
        rules={[{ required: true, message: 'Especifique el genero' }]}
      >
        <Select placeholder='Seleccione el genero'>
            <Select.Option value={Genero.Masculino}>Masculino</Select.Option>
            <Select.Option value={Genero.Femenino}>Femenino</Select.Option>
        </Select>
      </Form.Item>
        <Form.Item
            label='Fecha de Nacimiento'
            name='fecha'
            
            rules={[{ required: true, message: 'Debe ingresar la fecha de nacimiento' }]}
        >
            <DatePicker />
        </Form.Item>
        <Form.Item
            label='Fecha de Nacimiento'
            hidden
            name='fechaNacimiento'
            rules={[{ required: true, message: 'Debe ingresar la fecha de nacimiento' }]}
        >
            <Input />
        </Form.Item>
    </Form>
  );
};

export default AlumnoForm;

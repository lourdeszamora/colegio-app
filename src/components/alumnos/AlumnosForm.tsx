import Alumno from '@/models/alumno.entity';
import { IFormProps } from '@/models/form-props.interface';
import { DatePicker, Form, Input } from 'antd';
import React from 'react';

const AlumnoForm: React.FC = ({ form, onSubmit }: IFormProps<Alumno>) => {
  return (
    <Form form={form} onFinish={onSubmit}>
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
            label='Fecha de Nacimiento'
            name='fechaNacimiento'
            rules={[{ required: true, message: 'Debe ingresar la fecha de nacimiento' }]}
        >
            <DatePicker  />
        </Form.Item>
    </Form>
  );
};

export default AlumnoForm;

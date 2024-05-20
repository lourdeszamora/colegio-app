import React from 'react';
import { Form, Input, Button, FormInstance, Select } from 'antd';
import Profesor from '../../models/profesor.entity';
import { IFormProps } from '@/models/form-props.interface';
import Genero from '@/models/genero.entity';

const ProfesorForm = ({ form, onSubmit }: IFormProps<Profesor>) => {
  const onFinish = (values: Profesor) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <Form.Item
        label='Id'
        name='id'
        rules={[{ required: true, message: 'Debe ingresar los nombres' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Nombres'
        name='nombre'
        rules={[{ required: true, message: 'Debe ingresar los nombres' }]}
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
    </Form>
  );
};

export default ProfesorForm;

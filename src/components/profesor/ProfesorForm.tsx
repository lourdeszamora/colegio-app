import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import  Profesor from '../../models/profesor.entity';
import { IFormProps } from '@/models/form-props.interface';



const ProfesorForm = ({form, onSubmit}: IFormProps<Profesor>) => {
    const onFinish = (values: Profesor) => {
        console.log('Form values:', values);
    };

    return (
        <Form form={form} onFinish={onSubmit} >
            <Form.Item hidden name="id">
                <Input />
            </Form.Item>
            <Form.Item
                label="Nombres"
                name="nombres"
                rules={[{ required: true, message: 'Debe ingresar los nombres' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Apellidos"
                name="apellidos"
                rules={[{ required: true, message: 'Debe ingresar los apellidos' }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Genero"
                name="genero"
                rules={[
                    { required: true, message: 'Especifique el genero' },
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    );
};

export default ProfesorForm;
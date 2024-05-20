'use client';
import {
  UseMutateFunction,
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  message,
  Row,
  Space,
  Table,
  TableProps,
} from 'antd';
import React, { useMemo } from 'react';
import profesoresService from '../../services/profesores.service';
import FormModal from '@/components/general/form-modal';
import ProfesorForm from '@/components/profesor/ProfesorForm';
import Profesor from '@/models/profesor.entity';
import { AxiosError } from 'axios';

const Profesores = () => {
  const [page, setPage] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const [profesor, setProfesor] = React.useState<Profesor>();
  const {
    isLoading,
    isError,
    error,
    data: profesores,
  } = useQuery({
    queryKey: ['profesores', page],
    queryFn: ({ signal }) => profesoresService.getAll(page, 20, signal),
  });
  const createProfesor = useMutation({
    mutationFn: (data: Profesor) => profesoresService.create(data),
    onSuccess: (data: Profesor) => {
      queryClient.invalidateQueries({ queryKey: ['profesores', page] });
      message.success(
        `El Profesor ${data.nombre} ${data.apellidos} fue agregado!`,
      );
      setIsModalVisible(false);
    },
    onError: (error: AxiosError) => {
      let data: any = error.response?.data;
      if(data.errors){
        data.errors.id && message.error(data.errors.id);
        data.errors.nombre && message.error(data.errors.nombre);
        data.errors.apellidos && message.error(data.errors.apellidos);
      }else if(data){
        data && message.error(data as string);
      }else{
        message.error(error.message);
      }
    },
  });
  const [action, setAction] = React.useState<any>(createProfesor);
  const updateProfesor = useMutation({
    mutationFn: (data: Profesor) => profesoresService.update(data),
    onSuccess: (data: Profesor) => {
      queryClient.invalidateQueries({ queryKey: ['profesores', page] });
      message.success(
        `El Profesor ${data.nombre} ${data.apellidos} fue actualizado!`,
      );
      setIsModalVisible(false);
    },
    onError: (error: AxiosError) => {
      let data: any = error.response?.data;
      if(data.errors){
        data.errors.id && message.error(data.errors.id);
        data.errors.nombre && message.error(data.errors.nombre);
        data.errors.apellidos && message.error(data.errors.apellidos);
      }else if(data){
        data && message.error(data as string);
      }else{
        message.error(error.message);
      }
    },
  });
  const deleteProfesor = useMutation({
    mutationFn: (id: string) => profesoresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profesores', page] });
      message.success('Profesor eliminado!');
    },
    onError: (error: AxiosError) => {
      error.message && message.error(error.message);
    },
  });

  const columns = useMemo(
    () => [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Apellidos',
        dataIndex: 'apellidos',
        key: 'apellidos',
      },
      {
        title: 'Genero',
        dataIndex: 'genero',
        key: 'genero',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size='middle'>
            <a
              onClick={() => {
                setProfesor(record);
                setAction(updateProfesor);
                setIsModalVisible(true);
              }}
            >
              Editar
            </a>
            <a onClick={()=>{
              deleteProfesor.mutate(record.id);
            }}>Eliminar</a>
          </Space>
        ),
      },
    ],
    [],
  ) as TableProps<any>['columns'];
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <Row>
      <FormModal
        isVisisble={isModalVisible}
        title='Nuevo profesor'
        onClose={() => setIsModalVisible(false)}
        okText='Guardar'
        isLoading={createProfesor.isPending}
        onSubmit={action?.mutate}
        initialValues={profesor}
      >
        <ProfesorForm />
      </FormModal>
      <Col span={24}>
        <Card title='Profesores'>
          <Row justify='end'>
            <Col>
              <Button
                type='primary'
                onClick={() => {
                  setProfesor(new Profesor());
                  setAction(createProfesor);
                  setIsModalVisible(true);
                }}
              >
                Nuevo
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={profesores}
            loading={isLoading}
            pagination={{
              current: page,
              onChange: (page) => setPage(page),
            }}
          ></Table>
        </Card>
      </Col>
    </Row>
  );
};

export default Profesores;

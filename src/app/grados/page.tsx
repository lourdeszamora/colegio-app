'use client';
import {
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
import React, { useEffect, useMemo } from 'react';
import FormModal from '@/components/general/form-modal';
import { AxiosError } from 'axios';
import Grado from '@/models/grado.entity';
import gradosService from '@/services/grados.service';
import GradoForm from '@/components/grado/GradoForm';

const Grados = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isModalNewVisible, setIsModalNewVisible] = React.useState(false);
  const queryClient = useQueryClient();
  const [totalCount, setTotalCount] = React.useState(0);
  const [grado, setGrado] = React.useState<Grado>();
  const {
    isLoading,
    isError,
    error,
    data: grados,
  } = useQuery({
    queryKey: ['grados', currentPage],
    queryFn: ({ signal }) => gradosService.getAll(currentPage, 20, signal),
  });
  const createGrado = useMutation({
    mutationFn: (data: Grado) => gradosService.create(data),
    onSuccess: (data: Grado) => {
      queryClient.invalidateQueries({ queryKey: ['grados', currentPage] });
      message.success(
        `El Grado ${data.nombre} fue agregado!`,
      );
      setIsModalNewVisible(false);
    },
    onError: (error: AxiosError) => {
      let data: any = error.response?.data;
      if(data.errors){
        data.errors.id && message.error(data.errors.id);
        data.errors.nombre && message.error(data.errors.nombre);
        data.errors.profesorId && message.error(data.errors.profesorId);
      }else if(data){
        data && message.error(data as string);
      }else{
        message.error(error.message);
      }
    },
  });
  useEffect(() => {
    setTotalCount(grados?.total || 0);
  }, [grados]);
  const updateGrado = useMutation({
    mutationFn: (data: Grado) => gradosService.update(data),
    onSuccess: (data: Grado) => {
      queryClient.invalidateQueries({ queryKey: ['grados', currentPage] });
      message.success(
        `El Grado ${data.nombre} fue actualizado!`,
      );
      setIsModalVisible(false);
    },
    onError: (error: AxiosError) => {
      let data: any = error.response?.data;
      if(data.errors){
        data.errors.id && message.error(data.errors.id);
        data.errors.nombre && message.error(data.errors.nombre);
        data.errors.profesorId && message.error(data.errors.profesorId);
      }else if(data){
        data && message.error(data as string);
      }else{
        message.error(error.message);
      }
    },
  });
  const deleteGrado = useMutation({
    mutationFn: (id: string) => gradosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grados', currentPage] });
      message.success('Grado eliminado!');
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
        title: 'Profesor',
        dataIndex: 'profesorId',
        key: 'profesorId',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size='middle'>
            <a
              onClick={() => {
                setGrado(record);
                setIsModalVisible(true);
              }}
            >
              Editar
            </a>
            <a onClick={()=>{
              deleteGrado.mutate(record.id);
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
        title='Grado'
        onClose={() => setIsModalVisible(false)}
        okText='Guardar'
        isLoading={updateGrado.isPending}
        onSubmit={updateGrado.mutate}
        initialValues={grado}
      >
        <GradoForm />
      </FormModal>
      <FormModal
        isVisisble={isModalNewVisible}
        title='Grado Nuevo'
        onClose={() => setIsModalNewVisible(false)}
        okText='Guardar'
        isLoading={createGrado.isPending}
        onSubmit={createGrado.mutate}
        initialValues={grado}
      >
        <GradoForm />
      </FormModal>
      <Col span={24}>
        <Card title='Grados'>
          <Row justify='end'>
            <Col>
              <Button
                type='primary'
                onClick={() => {
                  setGrado(new Grado());
                  setIsModalNewVisible(true);
                }}
              >
                Nuevo
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={grados?.data}
            loading={isLoading}
            rowKey={(record) => record.id}
            pagination={{
              current: currentPage,
              defaultPageSize: 20,
              total: totalCount,
              pageSize: 20,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }}
          ></Table>
        </Card>
      </Col>
    </Row>
  );
};

export default Grados;


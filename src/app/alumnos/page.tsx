'use client';
import alumnosService from '@/services/alumnos.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Table,
  TableProps,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { use, useState } from 'react';
import { useMemo } from 'react';
import moment from 'moment';
import Alumno from '@/models/alumno.entity';
import FormModal from '@/components/general/form-modal';
import AlumnoForm from '@/components/alumnos/AlumnosForm';
import { AxiosError } from 'axios';

const Alumnos: React.FC = () => {
  const [alumno, setAlumno] = useState<Alumno>();
  const [openDetails, setOpenDetails] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const queryClient = useQueryClient();
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
        title: 'Fecha de Nacimiento',
        dataIndex: 'fechaNacimiento',
        key: 'fechaNacimiento',
        render: (date) => moment(date).format('DD/MM/YYYY'),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size='middle'>
            <a
              onClick={() => {
                record.fecha = dayjs(record.fechaNacimiento);
                setAlumno(record);
                setOpenCreate(true);
              }}
            >
              Editar
            </a>
            <a
              onClick={() => {
                setAlumno(record);
                setOpenDetails(true);
              }}
            >
              Detalles
            </a>
            <a
              onClick={() => {
              }}
            >
              Eliminar
            </a>
          </Space>
        ),
      },
    ],
    [],
  ) as TableProps<any>['columns'];

  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoading,
    isError,
    error,
    data: alumnos,
  } = useQuery({
    queryKey: ['alumnos', currentPage],
    queryFn: ({ signal }) => alumnosService.getAll(currentPage, 20, signal),
  });

  const { data: grado } = useQuery({
    queryKey: ['alumnos', alumno?.id],
    queryFn: () => alumnosService.getgrado(alumno?.id || ''),
    enabled: openDetails && !!alumno,
  });

  const createAlumno = useMutation({
    mutationFn: (data: Alumno) => alumnosService.create(data),
    onSuccess: (data: Alumno) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', currentPage] });
      message.success(
        `El Alumno ${data.nombre} ${data.apellidos} fue agregado!`,
      );
      setOpenCreate(false);
      createAlumno.reset();
    },
    onError: (error: AxiosError) => {
      let data: any = error.response?.data;
      if (data.errors) {
        data.errors.Id && message.error(data.errors.Id);
        data.errors.Nombre && message.error(data.errors.Nombre);
        data.errors.Apellidos && message.error(data.errors.Apellidos);
      } else if (data) {
        data && message.error(data as string);
      } else {
        message.error(error.message);
      }
    },
  });

  return (
    <Row justify={'center'}>
      <Modal
        open={openDetails}
        title='Details'
        onOk={() => setOpenDetails(false)}
        onCancel={() => setOpenDetails(false)}
      >
        <p>Nombre: {alumno?.nombre}</p>
        <p>Apellidos: {alumno?.apellidos}</p>
        <p>Genero: {alumno?.genero}</p>
        <p>
          Fecha de Nacimiento:{' '}
          {moment(alumno?.fechaNacimiento).format('DD/MM/YYYY')}
        </p>
        <p>Grado: {grado?.grado.nombre}</p>
        <p>Seccion: {grado?.seccion}</p>
      </Modal>
      <FormModal
        isVisisble={openCreate}
        title='Alumno'
        onClose={() => setOpenCreate(false)}
        okText='Guardar'
        onSubmit={createAlumno.mutate}
        isLoading={createAlumno.isPending}
        initialValues={alumno}
      >
        <AlumnoForm />
      </FormModal>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Card title='Alumnos'>
          <Row justify={'end'}>
            <Col>
              <Button
                type='primary'
                onClick={() => {
                  setOpenCreate(true);
                  setAlumno(new Alumno());
                }}
              >
                Nuevo
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={alumnos?.data}
            loading={isLoading}
            rowKey={(record) => record.id}
            pagination={{
              current: currentPage,
              total: alumnos?.total,
              pageSize: 20,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Alumnos;

'use client';
import alumnosService from '@/services/alumnos.service';
import { UseMutationResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Table,
  TableProps,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState , useMemo} from 'react';
import moment from 'moment';
import Alumno from '@/models/alumno.entity';
import FormModal from '@/components/general/form-modal';
import AlumnoForm from '@/components/alumnos/AlumnosForm';
import { AxiosError } from 'axios';

interface AlumnoModal {
  open: boolean;
  alumno: Alumno;
  action: UseMutationResult<Alumno, AxiosError<unknown,any>, Alumno, unknown>;
}


const Alumnos = () => {
  const [alumno, setAlumno] = useState<Alumno>();
  const [openDetails, setOpenDetails] = useState(false);
  const queryClient = useQueryClient();
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
  const createAlumno = useMutation({
    mutationFn: (data: Alumno) => alumnosService.create(data),
    onSuccess: (data: Alumno) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', currentPage] });
      message.success(
        `El Alumno ${data.nombre} ${data.apellidos} fue agregado!`,
      );
      setAlumnoModal({open: false, alumno: new Alumno(), action: createAlumno});
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
  const [alumnoModal, setAlumnoModal] = useState<AlumnoModal>({open: false, alumno: new Alumno(), action: createAlumno});
  
  const updateAlumno = useMutation({
    mutationFn: (data: Alumno) => alumnosService.update(data),
    onSuccess: (data: Alumno) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', currentPage] });
      message.success(
        `El Alumno ${data.nombre} ${data.apellidos} fue actualizado!`,
      );
      setAlumnoModal({open: false, alumno: new Alumno(), action: createAlumno});
    },
    onError: (error: AxiosError) => {
      let data: any = error.response?.data;
      if(data.errors){
        data.errors.Id && message.error(data.errors.Id);
        data.errors.Nombre && message.error(data.errors.Nombre);
        data.errors.Apellidos && message.error(data.errors.Apellidos);
      }else if(data){
        data && message.error(data as string);
      }else{
        message.error(error.message);
      }
    },
  });

  const deleteAlumno = useMutation({
    mutationFn: (id: string) => alumnosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', currentPage] });
      message.success('Alumno eliminado!');
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
                setAlumnoModal({open: true, alumno: record, action: updateAlumno});
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
              onClick={() => deleteAlumno.mutate(record.id)}
            >
              Eliminar
            </a>
          </Space>
        ),
      },
    ],
    [],
  ) as TableProps<any>['columns'];


  const { data: grado } = useQuery({
    queryKey: ['alumnos', alumno?.id],
    queryFn: () => alumnosService.getgrado(alumno?.id || ''),
    enabled: openDetails && !!alumno,
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
        {grado && <p>Grado: {grado?.grado.nombre}</p>}
        {grado && <p>Seccion: {grado?.seccion}</p>}
        {!grado && <p>El alumno no tiene asignado ningun grado</p>}
      </Modal>
      <FormModal
        isVisisble={alumnoModal.open}
        title='Alumno'
        onClose={() => setAlumnoModal({open: false, alumno: new Alumno(), action: createAlumno})}
        okText='Guardar'
        onSubmit={alumnoModal.action?.mutate}
        isLoading={alumnoModal.action?.isPending}
        initialValues={alumnoModal.alumno}
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
                  setAlumnoModal({open: true, alumno: new Alumno(), action: createAlumno});
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

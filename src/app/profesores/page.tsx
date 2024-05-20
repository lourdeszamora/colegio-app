'use client';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Row, Space, Table, TableProps, Tag } from 'antd';
import React, { useMemo } from 'react';
import profesoresService from '../../services/profesores.service';
import FormModal from '@/components/general/form-modal';
import ProfesorForm from '@/components/profesor/ProfesorForm';



const Profesores = () => {
  const [page, setPage] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const {
    isLoading,
    isError,
    error,
    data: profesores,
  } = useQuery({
    queryKey: ['profesores', page],
    queryFn: ({ signal }) => profesoresService.getAll(page, 20, signal),
  });
  const columns = useMemo(
    () => [
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
            <a>Invite {record.name}</a>
            <a>Delete</a>
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
      >
        <ProfesorForm />
      </FormModal>
      <Col span={24}>
        <Card title='Profesores'>
          <Row justify='end'>
            <Col>
              <Button type='primary' onClick={() => setIsModalVisible(true)}>Nuevo</Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={profesores}
            loading={isLoading}
          ></Table>
        </Card>
      </Col>
    </Row>
  );
};

export default Profesores;

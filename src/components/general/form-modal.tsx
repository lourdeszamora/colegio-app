import { IFormProps } from '@/models/form-props.interface';
import { Modal, Form, Typography } from 'antd';
import React, { ReactElement, useEffect } from 'react';


interface Props<T> {
  isVisisble?: boolean;
  title?: string;
  okText?: string;
  isLoading?: boolean;
  initialValues?: Partial<T>;
  children?: ReactElement<IFormProps<T>>;
  width?: number;
  onClose?: () => void;
  onSubmit?: (values: T) => void;
}

function FormModal<T>({
  isVisisble = false,
  title,
  okText = 'Ok',
  isLoading,
  initialValues,
  children,
  width = 448,
  onClose,
  onSubmit,
}: Props<T>) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  let childrenProps = { form, onSubmit: children?.props.onSubmit };
  if (onSubmit) childrenProps.onSubmit = onSubmit;

  return (
    <Modal
      open={isVisisble}
      okText={okText}
      closable={false}
      maskClosable={false}
      okButtonProps={{ size: 'small' }}
      cancelButtonProps={{ size: 'small' }}
      confirmLoading={isLoading}
      onOk={form.submit}
      onCancel={() => {
        form.resetFields();
        if (onClose) {
          onClose();
        }
      }}
      title={title && <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>{title}</Typography.Text>}
      width={width}
    >
      {children && React.cloneElement(children, childrenProps)}
    </Modal>
  );
}

export default FormModal;

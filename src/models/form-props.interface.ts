import { FormInstance } from 'antd';

export interface IFormProps<T> {
  form?: FormInstance<T>;
  onSubmit?: (values: T) => void;
}

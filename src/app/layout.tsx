'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {
  FileOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
const { Content, Sider } = Layout;
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnorderedListOutlined , IdcardOutlined} from '@ant-design/icons';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  const items: MenuItem[] = [
    {
      key: 'profesores-link',
      label: <a href='/profesores'>Profesores</a>,
      icon: <UnorderedListOutlined />
    },
    {
      key: 'grados-link',
      label: <a href='/grados'>Grados</a>,
      icon: <FileOutlined />,
    },
    {
      key: 'alumnos-link',
      label: <a href='/alumnos'>Alumnos</a>,
      icon: <IdcardOutlined />,
    },
  ];

  return (
    <html lang='en'>
      <body>
      <QueryClientProvider client={queryClient}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className='demo-logo-vertical' />
          <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline' items={items} />
        </Sider>
        <Content style={{ margin: '0 16px', height: '100%' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      </QueryClientProvider>
      </body>
    </html>
  );
}

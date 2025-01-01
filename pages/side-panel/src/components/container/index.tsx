import './index.css';
import { twMerge } from 'tailwind-merge';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: ContainerProps) => {
  return <div className={twMerge('container', className)}>{children}</div>;
};

export default Container;

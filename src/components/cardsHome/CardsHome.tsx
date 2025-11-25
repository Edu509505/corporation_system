import type { ReactNode } from 'react';


type CardBaseProps = {
  children: ReactNode;
  className?: string;
};

export default function CardBase({ children, className = '' }: CardBaseProps) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 w-fit flex flex-col justify-center items-start ${className}`}>
      {children}
    </div>
  );
}

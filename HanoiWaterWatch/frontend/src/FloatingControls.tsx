import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from 'react';

export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }) {
  return <button type="button" className={'floating-icon ' + className} {...props}/>;
}

export function stagger(index: number, total: number): CSSProperties {
  return { '--item-index': index, '--exit-index': total - index - 1 } as CSSProperties;
}

export function Cascade({ open, children, className = '' }: { open: boolean; children: ReactNode; className?: string }) {
  return <div className={'cascade ' + className} data-open={open} inert={!open}>{children}</div>;
}

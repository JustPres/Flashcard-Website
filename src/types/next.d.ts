declare module 'next/navigation' {
  export interface AppRouterInstance {
    back: () => void;
    forward: () => void;
    refresh: () => void;
    push: (href: string) => void;
    replace: (href: string) => void;
    prefetch: (href: string) => void;
  }
  
  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/document' {
  import { ComponentType, ReactElement, ReactNode } from 'react';
  
  export default class Document<P = {}> {
    render(): ReactElement<P>;
  }
  
  export class Html extends React.Component<any> {}
  export class Head extends React.Component<any> {}
  export class Main extends React.Component<any> {}
  export class NextScript extends React.Component<any> {}
}

declare module 'next/app' {
  import { NextPage } from 'next';
  import { AppProps as NextAppProps } from 'next/app';
  import { ReactElement, ReactNode } from 'react';

  export type NextComponentType<C = any, IP = any, P = any> = NextPage<P, IP> & {
    getInitialProps?(context: C): IP | Promise<IP>;
  };

  export type AppProps<P = any> = NextAppProps<P>;
}

declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  function confetti(options?: ConfettiOptions): Promise<null>;

  export = confetti;
}

declare module 'next/link' {
  import { ReactElement, ReactNode } from 'react';
  import { UrlObject } from 'url';

  export type Url = string | UrlObject;

  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    children?: ReactNode;
  }

  export default function Link(props: LinkProps): ReactElement;
} 
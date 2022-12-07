import { SVGProps } from "react";

export type IconProps = {
  name: string;
  className?: string;
  section?: string;
} & SVGProps<SVGSVGElement>;

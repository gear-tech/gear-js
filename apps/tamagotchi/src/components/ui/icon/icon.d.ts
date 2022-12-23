import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
  section?: string;
};

import { title } from "@/components/primitives";
type H2Props = React.ComponentProps<"h2">;

export const H2 = ({ children, className, ...props }: H2Props) => {
  return (
    <h2 className={title({ className })} {...props}>
      {children}
    </h2>
  );
};

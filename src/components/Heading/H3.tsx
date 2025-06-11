import { title } from "@/components/primitives";
type H3Props = React.ComponentProps<"h3">;

export const H3 = ({ children, className, ...props }: H3Props) => {
  return (
    <h3 className={title({ className })} {...props}>
      {children}
    </h3>
  );
};

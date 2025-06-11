import { title } from "@/components/primitives";
type H1Props = React.ComponentProps<"h1">;

export const H1 = ({ children, className, ...props }: H1Props) => {
  return (
    <h1 className={title({ className })} {...props}>
      {children}
    </h1>
  );
};

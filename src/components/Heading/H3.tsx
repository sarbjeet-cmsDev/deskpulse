import { title } from "@/components/primitives";
type H3Props = React.ComponentProps<"h3">;

export const H3 = ({ children, className, ...props }: H3Props) => {
  return (
    // <h3 className={title({ className })} {...props}>
     <h3 className={`text-[#31394f] text-[20px] leading-[28px] font-[700] ${className}`} {...props}>
      {children}
    </h3>
  );
};




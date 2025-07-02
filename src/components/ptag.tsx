type PProps = React.ComponentProps<"p">;

export const P = ({ children, className = "", ...props }: PProps) => {
  return (
    <p className={`text-[#31394f99] text-[13px] leading-[22px] text-center ${className}`} {...props}>
      {children}
    </p>
  );
};

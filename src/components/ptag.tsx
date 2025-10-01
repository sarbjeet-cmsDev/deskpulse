type PProps = React.ComponentProps<"p">;

export const P = ({ children, className = "", ...props }: PProps) => {
  return (
    <p className={` text-[13px] leading-[22px] ${className}`} {...props}>
      {children}
    </p>
  );
};

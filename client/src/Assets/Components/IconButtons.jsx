export const IconButton = ({
  text,
  classes,
  onClick,
  props,
  children,
  icon,
  disabled,
}) => {
  return (
    <button
      className={
        'px-2 py-1 rounded-md bg-primary-blue hover:bg-primary-main transition-colors flex items-center justify-center text-sm h-full disabled:opacity-30 disabled:hover:bg-primary-blue' +
        ` ${classes}`
      }
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
      {icon}
      {children}
    </button>
  );
};

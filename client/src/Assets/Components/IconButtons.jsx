export const IconButton = ({
  text,
  classes,
  onClick,
  props,
  children,
  icon,
}) => {
  return (
    <button
      className={
        'px-2 py-1 rounded-md bg-primary-blue hover:bg-primary-main transition-colors flex items-center justify-center text-sm h-full ' +
        classes
      }
      onClick={onClick}
      {...props}
    >
      {text}
      {icon}
      {children}
    </button>
  );
};

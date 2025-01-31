interface FromProps {
  children: React.ReactNode;
  onSubmit?: () => void;
}

const Form: React.FC<FromProps> = (props) => {
  const { children, onSubmit } = props;
  return <form onSubmit={onSubmit}>{children}</form>;
};

export default Form;

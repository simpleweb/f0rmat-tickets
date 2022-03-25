interface FieldProps extends Partial<HTMLDivElement> {
  children: any;
  error?: string;
  helpText?: string;
}

export default function Field({ children, error, helpText }: FieldProps) {
  return (
    <div>
      {children}
      <p>{error ?? helpText}</p>
    </div>
  );
}

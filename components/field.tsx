import classNames from "classnames";

interface FieldProps extends Partial<HTMLDivElement> {
  children: any;
  error?: string;
  helpText?: string;
}

export default function Field({ children, error, helpText }: FieldProps) {
  return (
    <div>
      {children}
      <p classNames={classNames(error && "bg-red-500  text-white shadow")}>
        {error ?? helpText}
      </p>
    </div>
  );
}

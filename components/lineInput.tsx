import { Controller, useFormContext } from "react-hook-form";

interface InputProps extends Partial<HTMLInputElement> {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  trailing?: any;
  error?: string;
}

export function Input({
  name,
  type = "text",
  placeholder,
  label,
  helpText,
  trailing,
  error,
  ...rest
}: InputProps) {
  return (
    <div className="w-full">
      {label}
      <div>
        <input
          placeholder={placeholder}
          type={type}
          name={name}
          id={name}
          {...rest}
        />
        {trailing && <div>{trailing}</div>}
      </div>
    </div>
  );
}

interface ControllerInputProps extends InputProps {
  name: string;
  defaultValue?: any;
}

export default function ControlledInput({
  name,
  defaultValue = "",
  ...rest
}: ControllerInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field }) => <Input {...field} {...rest} />}
    />
  );
}

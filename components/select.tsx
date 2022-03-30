import { Controller, useFormContext } from "react-hook-form";

interface SelectProps extends Partial<HTMLSelectElement> {
  name: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  trailing?: any;
  error?: string;
}
export function Select({
  name,
  children,
  placeholder,
  label,
  helpText,
  trailing,
  error,
  ...rest
}: SelectProps) {
  return (
    <div className="w-full">
      {label}
      <div className="flex">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          name={name}
          id={name}
          placeholder={placeholder}
          {...rest}
        >
          {children}
        </select>
      </div>
    </div>
  );
}

interface ControllerInputProps extends SelectProps {
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
      render={({ field }) => <Select {...field} {...rest} />}
    />
  );
}

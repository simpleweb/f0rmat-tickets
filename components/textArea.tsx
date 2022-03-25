import { Controller, useFormContext } from "react-hook-form";

interface TextAreaProps {
  name: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  rows?: number;
  error?: string;
}

export function TextArea({
  name,
  placeholder,
  label,
  helpText,
  rows = 3,
  error,
  ...rest
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label}
      <div>
        <textarea
          className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          name={name}
          id={name}
          rows={rows}
          placeholder={placeholder}
          {...rest}
        />
      </div>
    </div>
  );
}

interface ControllerInputProps extends TextAreaProps {
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
      render={({ field }) => <TextArea {...field} {...rest} />}
    />
  );
}

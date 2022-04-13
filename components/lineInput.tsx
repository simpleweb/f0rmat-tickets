import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";

interface LineInputProps extends Partial<HTMLInputElement> {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  trailing?: any;
  error?: string;
}

export function LineInput({
  name,
  type = "text",
  placeholder,
  label,
  helpText,
  trailing,
  error,
  ...rest
}: LineInputProps) {
  return (
    <div className="w-full">
      {label}
      <div className="flex text-black">
        <input
          className={classNames(
            { "border-2 border-red-500": error },
            "block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          )}
          placeholder={placeholder}
          type={type}
          name={name}
          id={name}
          {...rest}
        />
        {trailing && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-semibold text-black">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

interface ControllerInputProps extends LineInputProps {
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
      render={({ field }) => <LineInput {...field} {...rest} />}
    />
  );
}

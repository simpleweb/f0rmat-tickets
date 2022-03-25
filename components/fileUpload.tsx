interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  text: string;
  name: string;
  accept: string;
}

export default function FileUpload({
  onFileUpload,
  label,
  text,
  name,
  accept,
}: FileUploadProps) {
  return (
    <div>
      <label className="font-semibold hover:text-blue-400" htmlFor={name}>
        <span className="whitespace-nowrap">{text}</span>
      </label>

      <input
        id={name}
        className="hidden"
        name="file-upload"
        type="file"
        onChange={onFileUpload}
        accept={accept}
      />
    </div>
  );
}

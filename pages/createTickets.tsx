import { WalletState } from "@web3-onboard/core";
import { CreateTicketsForm } from "../forms";
import { useState } from "react";
import { FileUpload } from "../components";
import { useFileDataStore } from "../stores";

interface CreateTicketsProps {
  wallet: WalletState;
}

export default function CreateTickets({ wallet }: CreateTicketsProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { image, setImage } = useFileDataStore();

  async function handleCreateContract(data: TicketData) {
    console.log(data);
    //setLoading(true);
  }
  function handleFileUpload(e, setter) {
    const files = e.target.files;
    if (files[0]) {
      setter(files[0]);
    }
  }

  return (
    <div>
      {wallet?.provider && (
        <div className="grid grid-cols-2 gap-1">
          <div>
            <CreateTicketsForm
              onCreateTickets={(data) => handleCreateContract(data)}
              isLoading={isLoading}
              requiredFilesAdded={true}
            />
          </div>
          <div className="col-span-1  w-2/5">
            <FileUpload
              name="image"
              onFileUpload={(e) => handleFileUpload(e, setImage)}
              label="Marketing Image"
              text="Upload an image"
              accept=".png, .jpeg, .jpg"
            />

            {image && (
              <div>
                <div className="flex flex-col items-center justify-center">
                  {image ? (
                    <img
                      className="w-full rounded-md"
                      src={URL.createObjectURL(image)}
                    />
                  ) : (
                    <FileUpload
                      name="image"
                      onFileUpload={(e) => handleFileUpload(e, setImage)}
                      label="Marketing Image"
                      text="Upload an image"
                      accept=".png, .jpeg, .jpg"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { WalletState } from "@web3-onboard/core";
import { CreateTicketsForm } from "../forms";
import { useState } from "react";
import { FileUpload } from "../components";
import { useFileDataStore } from "../stores";
import { ethers } from "ethers";
import { createMetadata, uploadToIPFS, createContract } from "../helpers";

interface CreateTicketsProps {
  wallet: WalletState;
}

export default function CreateTickets({ wallet }: CreateTicketsProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { image, setImage } = useFileDataStore();

  async function handleCreateContract(data: TicketData) {
    setLoading(true);
    console.log(data);
    const {
      address,
      description,
      eventDate,
      eventEndTime,
      eventStartTime,
      price,
      quantity,
      title,
      venue,
      category,
      genre,
      stakeholders,
      stake,
    } = data;

    const metadata = createMetadata(
      title,
      venue,
      description,
      address,
      eventStartTime,
      eventEndTime,
      eventDate,
      image,
      category,
      genre
      // stakeholders,
      // stake
    );

    const ipfsData = await uploadToIPFS(metadata);
    console.log(ipfsData.data);
    createContract({
      name: "factory",
      provider: wallet?.provider,
      cb: async (factory) => {
        try {
          const contract = await factory.deploy(
            [wallet.accounts[0].address],
            [100],
            price ? ethers.utils.parseEther(price.toString()) : 0,
            title,
            "WLTCKT",
            quantity,
            0,
            ipfsData.url
          );

          await contract.deployTransaction.wait();

          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      },
    });
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
        <div className="flex gap-2">
          <div>
            <CreateTicketsForm
              onCreateTickets={(data) => handleCreateContract(data)}
              isLoading={isLoading}
              requiredFilesAdded={true}
            />
          </div>
          <div className="col-span-1  w-2/5">
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
            <FileUpload
              name="image"
              onFileUpload={(e) => handleFileUpload(e, setImage)}
              label="Marketing Image"
              text="Upload an image"
              accept=".png, .jpeg, .jpg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

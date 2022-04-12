import { CreateTicketsForm } from "../../forms";
import { useState } from "react";
import { FileUpload } from "../../components";
import { useFileDataStore } from "../../stores";
import { ethers } from "ethers";
import {
  createMetadata,
  uploadToIPFS,
  createContract,
  errorNotification,
  loadingNotification,
  dismissNotification,
} from "../../helpers";
import toast from "react-hot-toast";
import Router from "next/router";
import { useConnectWallet } from "@web3-onboard/react";

export default function CreateTickets() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { image, setImage } = useFileDataStore();
  const [{ wallet }] = useConnectWallet();

  function onCreation(contractAddress: string) {
    if (contractAddress) Router.push(`/ticket/${contractAddress}`);
  }

  async function handleCreateContract(data: TicketData) {
    if (image) {
      setLoading(true);
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
        categories,
        genres,
        blockChainId,
        stakeholders,
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
        categories,
        genres
      );

      let ipfsData;
      try {
        ipfsData = await uploadToIPFS(metadata);
      } catch (e) {
        console.log("IPFS UPLOAD FAILED: ", e);
        return;
      }

      const payees = stakeholders.map((stakeholder) => stakeholder.address) || [
        "",
      ];
      const shares = stakeholders.map((stakeholder) => stakeholder.stake) || [
        "",
      ];
      const waitingToConfirm = loadingNotification("Waiting for confirmation");

      try {
        createContract({
          name: "factory",
          provider: wallet?.provider,
          cb: async (factory) => {
            try {
              const contract = await factory.deploy(
                payees,
                shares,
                price ? ethers.utils.parseEther(price.toString()) : 0,
                title,
                blockChainId,
                quantity,
                0,
                ipfsData.url
              );
              dismissNotification(waitingToConfirm);
              toast
                .promise(
                  contract.deployTransaction.wait(),
                  {
                    loading: "Creating Tickets ⛏️",
                    success: "success",
                    error: "failed",
                  },
                  {
                    position: "bottom-center",
                    style: {
                      background: "#94a4bb",
                      padding: "16px",
                    },
                  }
                )
                .then((data: any) => {
                  onCreation(data.contractAddress);
                })
                .catch((e) => {
                  setLoading(false);
                  console.log(e);
                });
            } catch (e) {
              dismissNotification(waitingToConfirm);
              errorNotification(e.toString());
              setLoading(false);
            }
          },
        });
      } catch (e) {
        console.log(e);
      }
    } else if (!image) {
      errorNotification("Add a marketing image.");
    }
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
        <div className="flex grid w-full gap-2 lg:grid-cols-3">
          <div className="lg:col-span-1 lg:col-start-3">
            <div>
              <div className="flex flex-col items-center justify-center">
                {image && (
                  <img
                    className="w-1/2 rounded-md lg:w-full"
                    src={URL.createObjectURL(image)}
                  />
                )}
              </div>
            </div>
            <FileUpload
              name="image"
              onFileUpload={(e) => handleFileUpload(e, setImage)}
              label="Marketing Image"
              text="Upload an image"
              accept=".png, .jpeg, .jpg"
            />
          </div>
          <div className="sm:order-2 lg:col-span-2 lg:col-start-1 lg:row-start-1">
            <CreateTicketsForm
              onCreateTickets={(data) => handleCreateContract(data)}
              isLoading={isLoading}
              requiredFilesAdded={true}
              wallet={wallet}
            />
          </div>
        </div>
      )}
    </div>
  );
}

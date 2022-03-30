import { File, NFTStorage } from "nft.storage";

const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
});

export async function uploadToIPFS(data: any) {
  if (!data) throw Error("Data is invalid");
  return await client.store(data);
}

export function createMetadata(
  name: string,
  venue: string,
  description: string,
  address: string,
  start: string,
  end: string,
  date: string,
  image: File,
  category: string,
  genre: string
) {
  const data = {
    name,
    venue,
    description,
    address,
    start,
    end,
    date,
    category,
    genre,
    factory_id: "16247fb7-1a2c-4899-a581-c46b319ef600",
    image: new File([image], image.name, {
      type: image.type,
    }),
  };
  return data;
}

export function transformURL(url: string) {
  return url.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}

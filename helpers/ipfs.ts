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
    factory_id:
      "D121BCB4B98679EAA60430A97960AC6290FD90DBEF409BA46146DCE2105CD81E", //SHA256 hash of 'ticket-factory' not sure what andy used to make his
    image: new File([image], image.name, {
      type: image.type,
    }),
  };
  return data;
}

export function transformURL(url: string) {
  return url.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}

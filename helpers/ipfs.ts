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
  categories: string[],
  genres: string[]
) {
  const data = {
    name,
    venue,
    description,
    address,
    start,
    end,
    date,
    release_type: "ticket",
    categories: categories.toString(),
    genres: genres.toString(),
    factory_id: process.env.NEXT_PUBLIC_FACTORY_ID,
    image: new File([image], image.name, {
      type: image.type,
    }),
  };
  return data;
}

export function transformURL(url: string) {
  return url.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}

import { getMetadataValue, transformURL } from "../helpers";

interface TicketCardProps {
  metadata: Ticket;
  id: string;
}
export function TicketCard({ metadata, id }: TicketCardProps) {
  const image = getMetadataValue(metadata, "image");
  const title = getMetadataValue(metadata, "name");
  const date = getMetadataValue(metadata, "date");
  const start = getMetadataValue(metadata, "start");
  const venue = getMetadataValue(metadata, "venue");
  const categories = getMetadataValue(metadata, "categories");
  const factory = getMetadataValue(metadata, "factory_id");
  const url = "/ticket/" + id;

  if (factory != process.env.NEXT_PUBLIC_FACTORY_ID) return ""; //couldnt work out how to do this in the subgraph
  return (
    <a href={url}>
      <div className="border-2 border-black p-2 hover:border-y-white">
        <div className="">
          <div className="aspect-w-3 aspect-h-3">
            <img
              className="rounded-lg object-cover"
              loading="lazy"
              src={transformURL(image)}
            />
          </div>
        </div>
        <div className="pt-1 text-3xl">{title}</div>
        <div className="text-xl">{venue}</div>
        <div>{date + " @ " + start}</div>
        <div className="text-white">
          {categories ? <div>{categories}</div> : <br></br>}
        </div>
      </div>
    </a>
  );
}

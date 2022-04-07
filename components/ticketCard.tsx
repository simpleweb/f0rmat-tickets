import { getMetadataValue, transformURL } from "../helpers";

interface TicketCardProps {
  data: Ticket;
}
export function TicketCard({ data }: TicketCardProps) {
  const metadata = data.metadata;
  const image = getMetadataValue(metadata, "image");
  const title = getMetadataValue(metadata, "name");
  const date = getMetadataValue(metadata, "date");
  const start = getMetadataValue(metadata, "start");
  const venue = getMetadataValue(metadata, "venue");
  const categories = getMetadataValue(metadata, "categories");
  console.log(categories);

  console.log(data);
  const url = "/ticket/" + data.id;
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
        <div>{title}</div>
        <div>{venue}</div>
        <div>{date + " @ " + start}</div>
        <div className="text-white">
          {categories ? <div>{categories}</div> : <br></br>}
        </div>
      </div>
    </a>
  );
}

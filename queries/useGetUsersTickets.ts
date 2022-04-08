import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT;

export default function useGetUsersTickets(
  address: string,
  refetchInterval = 0
) {
  return useQuery(
    ["ticketCreator", address],
    async () => {
      const { mediaItems } = await request(
        endpoint,
        gql`
			query {
					mediaItems(where: {creator: "${address}"}, orderBy: createdAt, orderDirection: desc) {
						id				
						symbol
						createdAt
						metadata {
							key
							value
						}
					}
				}
			`
      );
      return mediaItems;
    },
    { refetchInterval }
  );
}

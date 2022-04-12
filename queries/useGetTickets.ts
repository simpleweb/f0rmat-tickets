import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT;

export default function useGetTickets(uuid: string, refetchInterval = 0) {
  return useQuery(
    ["factory", uuid],
    async () => {
      const { mediaItems } = await request(
        endpoint,
        gql`
			    query {
                mediaItems(where: {factory_id: "${uuid}"}) {
                    id
                    symbol
                    saleData {
                                            totalSold
                                            maxSupply
                                            totalEarnings
                                            totalReleased
                                            royaltiesPercentage
                                            salePrice
                                        }
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

//Get a single events tickets
import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT;

export default function useGetTicket(address: string, refetchInterval = 0) {
  return useQuery(
    ["ticket", address],
    async () => {
      const { mediaItem } = await request(
        endpoint,
        gql`
        query {
            mediaItem(id: "${address}") {
                id
                symbol
                creator{id}
                owners {
                  id
                }
                stakeholders {
                    id
                    share
                }
                payouts {
                    id
                    amount
                    createdAt
                    transactionHash
                }
                metadata {
                    key
                    value
                }
                saleData {
                    totalSold
                    maxSupply
                    totalEarnings
                    totalReleased
                    royaltiesPercentage
                    salePrice
                }
            }
        }
        `
      );
      return mediaItem;
    },
    { refetchInterval }
  );
}

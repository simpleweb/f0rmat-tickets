//Get a single events tickets
import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint =
  "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

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
                stakeholders {
                    id
                    share
                    balance
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

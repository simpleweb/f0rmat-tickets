import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint =
  "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function useGetOwner(address: string, refetchInterval = 0) {
  return useQuery(
    ["owners", address],
    async () => {
      const data = await request(
        endpoint,
        gql`
          query {
            owner(id: "${address}") {
              id
              mediaItems {
                mediaItem {
                  id
                  creator {
                    id
                  }
                  metadata {
                    key
                    value
                  }
                }
              }
            }
          }
        `
      );

      return data;
    },
    { refetchInterval }
  );
}

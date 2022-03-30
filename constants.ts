import TicketFactory from "./abis/factory.json";

export const contracts: Contracts = {
  factory: {
    bytecode: TicketFactory.bytecode,
    abi: TicketFactory.abi,
  },
};

import TicketFactory from "./abis/factory.json";

export const contracts: Contracts = {
  factory: {
    bytecode: TicketFactory.bytecode,
    abi: TicketFactory.abi,
  },
};

export const categories = [
  { value: "gig", label: "Gig" },
  { value: "festival", label: "Festival" },
  { value: "exhibition", label: "Exhibition" },
  { value: "talk", label: "Talk" },
  { value: "clubnight", label: "Clubnight" },
  { value: "instructional", label: "Instructional" },
  { value: "cinema", label: "Cinema" },
  { value: "theatre", label: "Theatre" },
  { value: "other", label: "Other" },
];

export const genres = [
  { value: "history", label: "History" },
  { value: "abstract", label: "Abstract" },
  { value: "comedy", label: "Comedy" },
  { value: "acoustic", label: "Acoustic" },
  { value: "other", label: "Other" },
];


export interface EventData {
  name: any
  date: any
  location: any
  description: any
  shortDescription: any
  startingPrice: any
  schedule: any
  audience: any
  duration: any
  note: any
  image: any
  seatsWorkspaceKey: any
  seatsEventName: any
  nftAddress: any
  owner: any
  startDate: any
  ticketPrice: any
}

export interface EventType {
  // Event Details
  id?: any
  isPending?: any
  name: any
  description: any
  category: any
  image: any
  location: any
  lat: any
  lng: any
  startDate: any
  endDate: any
  timeZone: any
  organizers: any
  isAvailable: any

  audience: any
  note: any

  hasNftsMinted: any

  //Contact
  email: any
  website: any
  twitter: any
  discord: any
  instagram: any

  hasFloorplan: any
  // Tickets Details
  ticketName: any
  ticketImage: any
  ticketSupply: any
  isPaid: any
  acceptCrypto: any
  acceptFiat: any
  currency: any
  isResellable: any
  ticketPrice: any
  resaleRoyalty: any
  // Contract Details
  URI: any
  contractAddress: any
  contractType: any
  contractId: any
  marketplaceAddress: any
  marketplaceId: any
  isContractVerified: any
  // Seats
  seatsWorkspaceKey: any
  seatsEventName: any

  chain: any

  //Magic Link
  //eventCreator: any
}


export interface UserData {
  bio: string
  profilePicture: string
  twitter: string
  linkedin: string
  discord: string
  instagram: string
  telegram: string
}

export enum ContractType {
  editionDrop = 'editionDrop',
  nftDrop = 'nftDrop', 
  noSet='notSet'
}

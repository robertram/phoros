import { EventType } from '@/types/types'

const convertArrayStringValueToString = (array: []) => {
  return array.map((item: any) => {
    return item?.stringValue
  })
}

export const convertFirestoreDataToObject = (eventInfo: any) => {
  const eventObject: EventType = {
    hasNftsMinted: eventInfo?.hasNftsMinted?.booleanValue ?? false,
    isPending: eventInfo?.isPending?.booleanValue ?? false,
    name: eventInfo?.name?.stringValue ?? '',
    description: eventInfo?.description?.stringValue ?? '',
    category: eventInfo?.category?.stringValue ?? '',
    image: eventInfo?.image?.stringValue ?? '',
    location: eventInfo?.location?.stringValue ?? '',
    lat: eventInfo?.lat?.stringValue ?? '',
    lng: eventInfo?.lng?.stringValue ?? '',
    startDate: eventInfo?.startDate?.stringValue ?? '',
    endDate: eventInfo?.endDate?.stringValue ?? '',
    timeZone: eventInfo?.timeZone?.stringValue ?? '',
    hasFloorplan: eventInfo?.hasFloorplan?.booleanValue ?? false,
    isAvailable: eventInfo?.isAvailable?.booleanValue ?? false,
    audience: eventInfo?.audience?.stringValue ?? '',
    note: eventInfo?.note?.stringValue ?? '',
    email: eventInfo?.email?.stringValue ?? '',
    website: eventInfo?.website.stringValue ?? '',
    twitter: eventInfo?.twitter?.stringValue ?? '',
    discord: eventInfo?.discord?.stringValue ?? '',
    instagram: eventInfo?.instagram?.stringValue ?? '' ?? '',
    ticketName: eventInfo?.ticketName?.stringValue ?? '',
    ticketImage: eventInfo?.ticketImage?.stringValue ?? '',
    ticketSupply: eventInfo?.ticketSupply.stringValue ?? '',
    isPaid: eventInfo?.isPaid?.booleanValue ?? false,
    acceptCrypto: eventInfo?.acceptCrypto?.booleanValue ?? false,
    acceptFiat: eventInfo?.acceptFiat?.booleanValue ?? false,
    currency: eventInfo?.currency?.stringValue ?? '',
    isResellable: eventInfo?.isResellable?.booleanValue ?? false,
    ticketPrice: eventInfo?.ticketPrice?.stringValue ?? '',
    resaleRoyalty: eventInfo?.resaleRoyalty?.stringValue ?? '',
    URI: eventInfo?.URI?.stringValue ?? '',
    contractAddress: eventInfo?.contractAddress?.stringValue ?? '',
    contractType: eventInfo?.contractType?.stringValue ?? '',
    contractId: eventInfo?.contractId?.stringValue ?? '',
    marketplaceAddress: eventInfo?.marketplaceAddress?.stringValue ?? '',
    marketplaceId: eventInfo?.marketplaceId?.stringValue ?? '',
    isContractVerified: eventInfo?.isContractVerified?.booleanValue ?? false,
    seatsWorkspaceKey: eventInfo?.seatsWorkspaceKey?.stringValue ?? '',
    seatsEventName: eventInfo?.seatsEventName?.stringValue ?? '',
    chain: eventInfo?.chain?.stringValue ?? '',
    organizers: eventInfo?.organizers?.arrayValue ? convertArrayStringValueToString(eventInfo?.organizers?.arrayValue?.values) : [],
  }

  return eventObject
}
export const activitiesQuery = (userAddress:string|undefined) => {
  return `query  {
  savingsContractCreateds(
    where: {user: "${userAddress}"}
  ) {
    user
    savingsContract
    date
  }
  savingsAccountOwnershipTransfereds(
    where: {oldUser: "${userAddress}"}
  ) {
    oldUser
    newOwner
    date
  }
}`
}

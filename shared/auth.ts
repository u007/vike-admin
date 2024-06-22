export type AuthUser = {
  uid: string
  email?: string
  loginId: string
  displayName: string
  phoneNumber?: string
  photoURL?: string
  token: string
  refreshToken?: string
  customData: any
  cartSessionToken?: string
  teams: string[]
  accessRights?: string[]
}

import { ObjectId } from 'bson'
import BaseModel from './base'
import { PhotoURL } from './photo_url'
import { _BaseType } from './_base_type'

export type UserType = _BaseType & {
  uid: string
  firstName: string
  lastName: string
  // mobile: string
  photoURL?: PhotoURL
  loginId: string
  email?: string
  status: number

  dob?: Date
  parentId?: string

  // agent/beautician area
  country?: string
  state?: string

  roles?: string[]
  teams?: string[]
  cartSessionToken?: string
  accessRights: string[]

  outletId?: ObjectId
  createOwnTeam?: boolean
}

export class UserModel extends BaseModel {
  constructor () {
    super('users')
    this.uniques = [['email']]
    this.required = ['email', 'status']
  }
}

export class ProfileModel extends BaseModel {
  constructor () {
    super('users')
    this.required = ['firstName']
  }
}

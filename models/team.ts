import { ObjectId } from 'bson'
import BaseModel from './base'
import { _BaseType } from './_base_type'

export type TeamType = _BaseType & {
  name: string
  status: number
  teamType?: string

  siteId: string

  isPublic: boolean
  parentId?: ObjectId
}
export class TeamModel extends BaseModel {
  constructor () {
    super('teams')
    // this.uniques = [['name']]
    this.required = ['name', 'status']
  }
}

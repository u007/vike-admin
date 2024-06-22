import BaseModel from './base'
import { _BaseType } from './_base_type'

export type TeamUserType = _BaseType & {
  name: string
  status: number
}
export class TeamUserModel extends BaseModel {
  constructor () {
    super('teamUsers')
    this.uniques = [['teamId', 'userId']]
    this.required = ['teamId', 'userId']
  }
}

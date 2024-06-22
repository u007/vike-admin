/* eslint-disable no-use-before-define */
import { UserStateType } from '../shared/fetch'

export enum PrimaryTypeEnum {
  ObjectId = 'ObjectId',
  UID = 'uid',
}

export type ModelField = {
  type: string
  nullable?: boolean
  label?: string
}

export abstract class BaseHook {
  onBeforeValidate?(userState: UserStateType, data: any, old: any): void
  onBefore?(
    rootState: UserStateType,
    data: any,
    old: any
  ): Promise<boolean> | boolean

  onAfter?(
    rootState: UserStateType,
    data: any,
    old: any
  ): Promise<boolean> | boolean
}

export enum ModelRelationType {
  OneToOne = 'one-to-one',
  ManyToOne = 'many-to-one',
  ManyToMany = 'many-to-many',
  BelongsTo = 'belongs-to',
  HasMany = 'has-many',
}

export default class BaseModel extends BaseHook {
  primaryField: string
  primaryType: PrimaryTypeEnum
  table: string
  label?: string
  uniques?: [
    string[]
  ]

  required: string[] = []// for both update and new
  insertRequired?: string[]// for only new
  updateRequired?: string[]// for only update

  fields: Record<string, ModelField> = {}

  // split this as getter to avoid circular dependency
  _relation?: RelationFieldType
  get relation (): RelationFieldType {
    if (!this._relation) {
      this._relation = {}
      this.setRelation()
    }
    return this._relation ?? {}
  }

  set relation (value: RelationFieldType) {
    this._relation = value
  }

  constructor (table: string, primaryField = '_id', primaryType = PrimaryTypeEnum.ObjectId) {
    super()
    this.table = table
    this.primaryField = primaryField
    this.primaryType = primaryType
  }
  
  setRelation () {}
}

export type ModelRelationFieldType = {
  model: BaseModel
  foreignKey: string // this table
  targetKey: string
  type: ModelRelationType
}

export type RelationFieldType = {
  [field: string]: ModelRelationFieldType
}

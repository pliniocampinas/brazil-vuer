import { SourceFormat, ValueType } from "./Enums"

export default interface MapBrowserFormInputs {
  title: string
  sourceUrl: string
  sourceFormat: SourceFormat
  cityCodeKey: string
  valueKey: string
  valueType: ValueType
}
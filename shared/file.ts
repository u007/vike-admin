export interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
  error?: Error
  originFileObj?: File
}

export interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}

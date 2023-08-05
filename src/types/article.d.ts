// 文章新增请求
interface ArticleAdd {
  uid: number
  title: string
  description: string
  content: string
}

// 文章状态
interface ArticleStatus {
  state: number
  createdOn: string
  modifiedOn: string
}

// 文章
interface Article extends ArticleAdd, ArticleStatus {
  id: number
}

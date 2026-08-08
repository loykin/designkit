// ─── Patterns ───────────────────────────────────────────────────────────────
// Reusable content compositions that sit between src/components/ui/* atomic
// primitives and src/components/templates/* page-level templates. A pattern
// is not itself a page — it composes ui atoms into a reusable content shape
// (a panel, a card, an article) meant to be placed inside a page template.

export { PanelTemplate } from './panel/PanelTemplate'
export type {
  PanelTemplateProps,
  PanelTemplateSectionProps,
  PanelTemplateRowProps,
} from './panel/PanelTemplate'
export { InteractiveCard } from './card/InteractiveCard'
export type { InteractiveCardProps } from './card/InteractiveCard'
export {
  ArticleCover,
  ArticleByline,
  ArticleToc,
  ArticleBody,
  ArticleBodySkeleton,
  ArticleCardPreview,
} from './article/ArticleContent'
export type {
  ArticleTone,
  ArticleCoverProps,
  ArticleBylineProps,
  ArticleTocItem,
  ArticleTocProps,
  ArticleBodyProps,
  ArticleBodySkeletonProps,
  ArticleCardPreviewProps,
} from './article/ArticleContent'
export { FormField, FormActions } from './form/FormPatterns'
export type { FormFieldProps, FormActionsProps } from './form/FormPatterns'

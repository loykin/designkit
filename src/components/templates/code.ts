import type { TemplateDefinition } from './definitions'

export interface TemplateCodeContext {
  definition: TemplateDefinition
  themeProp: string
  layoutClassName: string
}

export type TemplateCodeBuilder = (context: TemplateCodeContext) => string

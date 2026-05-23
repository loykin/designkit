import { useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { Button } from '@loykin/designkit'
import { Check, Copy } from 'lucide-react'

export type CodeBlockLanguage = 'css' | 'tsx'

export interface CodeBlockProps {
  code: string
  language: CodeBlockLanguage
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} className="h-7 gap-1.5 text-xs text-muted-foreground">
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const extensions = useMemo(
    () => [
      language === 'css' ? css() : javascript({ jsx: true, typescript: true }),
    ],
    [language],
  )

  return (
    <div className="relative overflow-hidden rounded-md border bg-muted/40">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton text={code} />
      </div>
      <CodeMirror
        value={code}
        readOnly
        editable={false}
        className="dk-code-block"
        basicSetup={{
          autocompletion: false,
          closeBrackets: false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          searchKeymap: false,
        }}
        extensions={extensions}
      />
    </div>
  )
}

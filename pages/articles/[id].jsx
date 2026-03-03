import fs from 'fs'
import elixir from 'highlight.js/lib/languages/elixir'
import path from 'path'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'

export async function getStaticPaths() {
  const articlesDir = path.join(process.cwd(), 'articles')
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'))

  const paths = files.map((filename) => ({
    params: { id: filename.replace(/\.md$/, '') },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'articles', `${params.id}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight, { languages: { elixir } })
    .use(rehypeStringify)
    .process(fileContents)

  return {
    props: { contentHtml: processedContent.toString() },
  }
}

export default function ArticlePage({ contentHtml }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  )
}

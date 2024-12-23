const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')

async function generate() {
  const feed = new RSS({
    title: 'Luca Bandini',
    site_url: 'https://lucabandini.it',
    feed_url: 'https://lucabandini.it/feed.xml'
  })

  try {
    const postsDir = path.join(__dirname, '..', 'pages', 'posts')
    
    // Check if directory exists
    try {
      await fs.access(postsDir)
    } catch {
      // Create directory if it doesn't exist
      await fs.mkdir(postsDir, { recursive: true })
      console.log('Created posts directory')
      // Exit early since we know it's empty
      await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
      return
    }

    const posts = await fs.readdir(postsDir)

    await Promise.all(
      posts.map(async (name) => {
        if (name.startsWith('index.')) return

        const content = await fs.readFile(
          path.join(postsDir, name)
        )
        const frontmatter = matter(content)

        feed.item({
          title: frontmatter.data.title,
          url: '/posts/' + name.replace(/\.mdx?/, ''),
          date: frontmatter.data.date,
          description: frontmatter.data.description,
          categories: frontmatter.data.tag?.split(', ') || [],
          author: frontmatter.data.author
        })
      })
    )

    await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    // Create an empty feed file to prevent build failures
    await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
  }
}

generate()

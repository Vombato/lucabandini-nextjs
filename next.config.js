const nextra = require('nextra')

// Helper function to handle potential ESM default export weirdness
const withNextraFactory = (typeof nextra === 'function' ? nextra : nextra.default)

if (typeof withNextraFactory !== 'function') {
    console.error('nextra export is:', nextra)
    throw new Error('Failed to import nextra as a function')
}

// NextraConfig configuration based on strict Zod schema compliance.
const withNextra = withNextraFactory({
    // minimalist valid config that satisfies NextraConfigSchema
    codeHighlight: true
})

module.exports = withNextra({
    // Passing standard next.js config here.
})

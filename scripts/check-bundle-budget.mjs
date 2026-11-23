import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const budgetPath = path.join(root, "performance-budget.json")
const chunksDir = path.join(root, ".next", "static", "chunks")

const budget = JSON.parse(fs.readFileSync(budgetPath, "utf8"))
if (!fs.existsSync(chunksDir)) {
  console.error("Missing .next/static/chunks. Run npm run build first.")
  process.exit(1)
}

const jsFiles = fs
  .readdirSync(chunksDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => {
    const bytes = fs.statSync(path.join(chunksDir, file)).size
    return { file, bytes }
  })
  .sort((a, b) => b.bytes - a.bytes)

const failures = []
for (const chunk of jsFiles) {
  if (chunk.bytes > budget.maxChunkBytes) {
    failures.push(`${chunk.file}: ${chunk.bytes} > ${budget.maxChunkBytes}`)
  }
}

const total = jsFiles.reduce((sum, chunk) => sum + chunk.bytes, 0)
const manifestPath = path.join(root, ".next", "build-manifest.json")
let firstLoad = jsFiles.slice(0, 6).reduce((sum, chunk) => sum + chunk.bytes, 0)
let firstLoadLabel = "top-6 chunk sum"
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  const rootFiles = [
    ...new Set([...(manifest.rootMainFiles ?? []), ...(manifest.polyfillFiles ?? [])]),
  ]
  firstLoad = rootFiles.reduce(
    (sum, file) => sum + fs.statSync(path.join(root, ".next", file)).size,
    0,
  )
  firstLoadLabel = "root main + polyfill"
}
if (firstLoad > budget.maxFirstLoadJsBytes) {
  failures.push(`${firstLoadLabel}: ${firstLoad} > ${budget.maxFirstLoadJsBytes}`)
}

console.log(`chunks=${jsFiles.length} totalJsBytes=${total} top6Bytes=${firstLoad}`)
for (const chunk of jsFiles.slice(0, 8)) {
  console.log(`${chunk.bytes}\t${chunk.file}`)
}

if (failures.length > 0) {
  console.error("Bundle budget failures:")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

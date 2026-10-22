import { readFile } from "node:fs/promises"
import { stripTypeScriptTypes } from "node:module"
import vm from "node:vm"
import path from "node:path"

// Execute actual route code with explicitly supplied boundary mocks.
export async function loadModule(file, mocks = {}, cache = new Map()) {
  const filename = path.resolve(file)
  if (cache.has(filename)) return cache.get(filename)
  const source = await readFile(filename, "utf8")
  const mod = new vm.SourceTextModule(filename.endsWith(".ts") ? stripTypeScriptTypes(source) : source, { identifier: filename })
  cache.set(filename, mod)
  await mod.link(async (specifier) => {
    if (Object.hasOwn(mocks, specifier)) {
      const values = mocks[specifier]
      return new vm.SyntheticModule(Object.keys(values), function () {
        for (const [key, value] of Object.entries(values)) this.setExport(key, value)
      })
    }
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const target = specifier.startsWith("@/") ? path.resolve(specifier.slice(2)) : path.resolve(path.dirname(filename), specifier)
      return loadModule(target.endsWith(".ts") ? target : target + ".ts", mocks, cache)
    }
    const values = await import(specifier)
    return new vm.SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value)
    })
  })
  return mod
}

export async function route(file, mocks = {}) {
  const mod = await loadModule(file, {
    "next/server": { NextRequest: Request, NextResponse: { json: (body, init) => Response.json(body, init) } },
    ...mocks,
  })
  await mod.evaluate()
  return mod.namespace
}


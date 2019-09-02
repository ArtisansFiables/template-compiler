import { promises as fs } from 'fs'
import { join } from 'path'
import { compileFile, compileTemplate } from 'pug'
import toPascalCase from 'pascal-case'

class Walker {
    files: Map<string, compileTemplate> = new Map()

    async walk(rootDir: string, rootDirName: string) {
        const entries = await fs.readdir(rootDir, { withFileTypes: true })

        for (const entry of entries) {
            const path = join(rootDir, entry.name)
            const filename = `${rootDirName} ${entry.name}`

            if (entry.isDirectory()) {
                await this.walk(path, filename)
            } else if (entry.isFile() && !entry.name.startsWith('_')) {
                const key = toPascalCase(filename.split('.')[0])
                const template = compileFile(path)

                this.files.set(key, template)
            }
        }
    }
}

export async function compile(
    root: string,
    baseName?: string
): Promise<Map<string, compileTemplate>> {
    const walker = new Walker()

    await walker.walk(root, baseName || '')

    return walker.files
}

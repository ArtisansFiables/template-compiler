import { compileTemplate } from 'pug'

import { compile } from '../src/template-compiler'

import { join } from 'path'

describe('Library runs correctly', () => {
    it('returns correct number of templates', async () => {
        const templates = await compile(join(__dirname, './templates_1'))

        expect(templates.size).toBe(3)
    })

    it('returns templates we expect', async () => {
        const templates = await compile(join(__dirname, './templates_1'))
        const keys: string[] = [...templates.keys()]

        expect(keys).toEqual(['Body', 'HeadersDirLololol', 'HeadersHeader'])
    })

    it('adds prefix to all files', async () => {
        const PREFIX = 'prefix'

        const templates = await compile(join(__dirname, './templates_1'), PREFIX)
        const keys: string[] = [...templates.keys()]

        expect(keys).toEqual(['PrefixBody', 'PrefixHeadersDirLololol', 'PrefixHeadersHeader'])
    })

    it('returns compileTemplate instances', async () => {
        const templates = await compile(join(__dirname, './templates_1'))

        const render = templates.get('Body')
        if (render === undefined) return

        expect(render()).toBe('')
    })
})

describe('Pug can be used correctly', () => {
    it('template inheritance works', async () => {
        const templates = await compile(join(__dirname, './templates_2'))

        const render = templates.get('Index')
        if (render === undefined) return

        expect(render()).toBe(
            '<html><body><p>This is index</p><p>This is a layout</p></body></html>'
        )
    })
})

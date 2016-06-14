
import { default as cofigure, makeProcessor } from '../'
import { assert } from 'chai'

describe('cofigure', () => {
	it('should resolve the promise with the upper case text', (done) => {
		const stringToUpperProcessor = makeProcessor(
			(value) => typeof value == 'string',
			(value, next) => {
				next(value.toUpperCase())
			}
		)

		function* lowercaseText(text) {
			return yield text
		}

		cofigure([stringToUpperProcessor])(lowercaseText('Hello World !'))
			.then((text) => {
				assert.equal('HELLO WORLD !', text)
				done()
			})
	})

	it('should throw an error and get handled', (done) => {
		const processor = makeProcessor(
			(value) => true,
			(value, next, error) => {
				error(new Error())
			}
		)

		function* lowercaseText(text) {
			return yield text
		}

		cofigure([processor])(lowercaseText('Hello World !'))
			.then((text) => {
				done(new Error('Inside then callback, we shouldn\'t be'))
			})
			.catch(() => done())
	})

})
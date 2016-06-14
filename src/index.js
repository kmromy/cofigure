
export const makeProcessor = (identify, processFn) => ({
	identify,
	process: processFn,
})

export default (processors) => function run(gen) {

	return new Promise((resolve, reject) => {

		next({value: undefined})

		function process(nextPayload) {
			let found = false

			processors.forEach((processor) => {
				if (processor.identify(nextPayload.value)) {
					found = true
					return processor.process(nextPayload.value, (value) => next({done: nextPayload.done, value}), error, run)
				}
			})

			if (!found)
				reject(new Error('No processor found for entity'))
		}

		function error(err) {
			let nextPayload;
			try {
				nextPayload = gen.throw(err)
			} catch(e) {
				reject(e)
			}
			process(nextPayload)
		}

		function next(injectedPayload) {
			let nextPayload;

			try {
				nextPayload = gen.next(injectedPayload.value)
			} catch(e) {
				return reject(e)
			}

			if (nextPayload.done)
				return resolve(nextPayload.value)
			process(nextPayload)
		}
	})

}
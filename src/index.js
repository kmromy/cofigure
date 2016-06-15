
export const makeProcessor = (identify, exec) => ({
  identify,
  exec,
})

export default (...processors) => {

  const run = gen => new Promise((resolve, reject) => {

    const next = ({ value } = {}) => {
      let nextPayload

      try {
        nextPayload = gen.next(value)
      } catch (e) {
        reject(e)
      }
      exec(nextPayload)
    }

    const error = err => {
      let nextPayload

      try {
        nextPayload = gen.throw(err)
      } catch (e) {
        reject(e)
      }

      exec(nextPayload)
    }

    const exec = (payload) => {
      const processor = processors.find(p => p.identify(payload.value))

      if (processor) {
        processor.exec(
          payload.value,
          value => next({ value, done: payload.done }),
          error,
          run
        )
      } else {
        reject(new Error('No Processor found for entity'))
      }
    }

    next()
  })

}

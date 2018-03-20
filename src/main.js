/**
 * @param {function} createError will create error only when an exception happens so that stack trace gets created only when necessary
 * @param {Promise} promise to be wrapped in try/catch
 * @returns {Promise<*>}
 */
async function catchMe(createError, promise) {
  if (!(createError instanceof Function)) throw new Error("param 'createError' must be a function")
  if (!promise || !(promise.then instanceof Function)) throw new Error("param 'promise' must be a promise ;-)")

  try {
    return await promise
  } catch (e) {
    const newError = createError()
    e.stack += newError.stack
    throw e
  }
}

module.exports = {
  me: catchMe,
  E: Error,
  Err: Error
}
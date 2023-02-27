import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

// TODO: add error handling middleware?
export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}

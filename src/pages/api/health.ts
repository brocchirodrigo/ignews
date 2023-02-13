/* eslint-disable import/no-anonymous-default-export */
import {NextApiRequest, NextApiResponse} from 'next'

const code = process.env.CODE;

export default (request: NextApiRequest, response: NextApiResponse) => {
  const header = request.headers;

  if (!header.authorization || !header.authorization.startsWith('Bearer ')) {
    return response.status(401).json({status: 'not authorized'});
  }

  const removeBearer = header.authorization.replace('Bearer ', '')

  if (!header.authorization || removeBearer !== code) {
    return response.status(401).json({status: 'not authorized'});
  }

  const health = [
    {
      status: 200,
      situation: 'ok'
    }
  ]

  return response.status(200).json(health)
}
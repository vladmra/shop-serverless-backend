import { handlerPath } from '@libs/handler-resolver';

// TODO: check if schema is correct?
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
      },
    },
  ],
};

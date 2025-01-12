import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

export const schema = a.schema({
  Storage: a
    .model({
      userId: a.string().required(),
      location: a.string().required(),
      behavior: a.enum(['input', 'click']),
      input: a.string(),
      result: a.string(),
      timestamp: a.string().required(),
    })
    .authorization(allow => [allow.publicApiKey()])
});



// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});

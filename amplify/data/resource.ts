import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates two tables: "Todo" and "Device". The "Device" table
includes fields for "username", "deviceID", "typeOfUser", and "remarks".
The authorization rule specifies that authenticated users can "create",
"read", "update", and "delete" their own "Device" records, while "Todo"
retains its current configuration.
=========================================================================*/

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Device: a
    .model({
      username: a.string(), // Username of the user
      deviceID: a.string(), // Unique identifier for the device
      typeOfUser: a.string(), // Type of user (e.g., admin, regular)
      remarks: a.string(), // Optional remarks field
    })
    .authorization((allow) => [
      allow.owner({
        ownerField: "username", // Allow users to manage their own devices
        operations: ["create", "read", "update", "delete"],
      }),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

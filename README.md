# News Hub

## API Details

## Example GraphQL Request:-
```javascript
  const fetchGetRequestAPI = async () => {
  if (!user) return;

  const { data, error: graphqlError } = await nhost.graphql.request(
    `
      query GetRequest($check_table_name: String!) {
        user_read_article(where: { check_name: { _eq: $check_table_name } }) {
          column1
          column2
          column3
          articles
        }
      }
    `,
    {
      check_table_name: variable_data  // Changed variable_name to match the query parameter
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );

  if (graphqlError) {
    return;  // Added return to prevent further execution on error
  }

  const readData = data?.user_read_article?.[0]?.articles || [];
  return readData;
};
```

### JWT Token Verification

#### When JWT Token is **not verified**:
```json
{
    "errors": [
        {
            "message": "Could not verify JWT: JWSError (JSONDecodeError \"Not valid base64url\")",
            "extensions": {
                "path": "$",
                "code": "invalid-jwt"
            }
        }
    ]
}
```

#### When JWT Token is **verified**:
```json
{
    "data": {
        "update_user_saved_article": {
            "affected_rows": 1
        }
    }
}
```

### Authentication
All GraphQL/Nhost API calls require a **Bearer Token** in the headers:

```javascript
{
    headers: {
      Authorization: `Bearer ${token}`,
    },
}
```

Ensure your token is securely stored and retrieved when making authenticated requests.
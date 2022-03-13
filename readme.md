# djsonotron

Todo

- Reject records with additional unknown properties?
- Write a test to verify the string & record test cases.
- Generate typescript definitions that I can use to define request/response API
  messages
- Generate parsing functions that I can use to parse inbound JSON payloads

And then...

- Ability to define an API surface (operations, inputs, outputs)
- Generate an oak-based web server scaffold
- Generate an OpenAPI compliant definition that is served by the web server

And finally...

- A utility that can parse an OpenAPI definition and create a fetch-based client
  that I'm happy with!

## Commands

Run `deno test --coverage=cov_profile` to test.

Run `deno coverage cov_profile` to view coverage report.

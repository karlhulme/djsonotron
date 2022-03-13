# djsonotron

Todo

- Improve error messages where appropriate? e.g Record requires "" property.
  Integer (5) must be greater than 10.
- Write tests to check production of validation code
- Write a test to verify type system (which means checking valid/invalid test
  cases of string/record)
- Generate typescript definitions from records
- Generate parsing functions for records that I can use to parse inbound JSON
  payloads

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

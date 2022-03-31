# djsonotron

Todo

- Generate a router for the oak web server
- Generate an OpenAPI compliant definition that is served by the web server

And finally...

- A utility that can parse an OpenAPI definition and create a fetch-based client
  that I'm happy with! Might not need much more than the definitions and a
  simple wrapper that allows all non-success codes to be handled as thrown
  errors.

## Commands

Run `deno test --coverage=cov_profile` to test.

Run `deno coverage cov_profile` to view coverage report.

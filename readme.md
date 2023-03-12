# djsonotron

Define schemas and then convert them into Typescript source code containing
interfaces, parsers, validators and JSON schemas..

## Common uses

### HTTP/REST and OpenAPi

Define your input and output messages using the Jsonotron format, then you can
generate:

- JSON schemas to use in your OpenAPI specification
- Typescript interfaces to support the development of web service routes
- Validation functions to use at runtime.

### NoSQL database definitions

Define your table or collection record structures using the Jsonotron format,
you can then generate:

- Typescript interfaces to support the development of code that reads or writes
  to the database.
- Validation functions to use at runtime before data is written to the database.

## Formatting

All output is left-aligned, so run `deno fmt` after generation to pretty print.

## Commands

Run `deno task test` to test, format and output coverage report.

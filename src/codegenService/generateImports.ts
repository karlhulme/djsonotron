interface GenerateImportsProps {
  typesPath: string;
  typeNames: string[];
  depsPath: string;
}

export function generateImports(props: GenerateImportsProps) {
  return `
    import { ${props.typeNames.join(", ")} } from "${props.typesPath}";
    import { Context, isHttpError, Request, Router, Status } from "${props.depsPath}";
  `;
}

interface GenerateImportsProps {
  typesPath: string;
  referencedTypeNames: string[];
  depsPath: string;
}

export function generateImports(props: GenerateImportsProps) {
  const typeImports: string[] = [];

  for (const typeName of props.referencedTypeNames) {
    typeImports.push(typeName);
    typeImports.push(`validate${typeName}`);
  }

  return `
    import { ${typeImports.join(", ")} } from "${props.typesPath}";
    import { Context, isHttpError, Request, Router, Status } from "${props.depsPath}";
  `;
}

/** Runtime-free slices of the host plugin and catalog contracts. */

type CleanupLite = () => Promise<void> | void;

interface CatalogRegistrationLite {
  dispose(): Promise<void>;
}

interface ModelInfoLite {
  name: string;
}

interface CatalogDraftLite {
  model: {
    get(providerID: string, modelID: string): ModelInfoLite | undefined;
    update(providerID: string, modelID: string, update: (model: ModelInfoLite) => void): void;
    remove(providerID: string, modelID: string): void;
  };
}

interface CommandDraftLite {
  add(command: {
    name: string;
    description?: string;
    execute: () => unknown | Promise<unknown>;
  }): void;
}

interface CommandTransformApiLite {
  transform(
    callback: (draft: CommandDraftLite) => void,
  ): Promise<{ dispose(): Promise<void> | void }>;
}

interface PluginContextLite {
  options: Readonly<Record<string, unknown>>;
  catalog: {
    transform(callback: (draft: CatalogDraftLite) => void): Promise<CatalogRegistrationLite>;
    reload(): Promise<void>;
  };
  /** OpenCode integration store; absent in mocks and older runtimes. */
  integration?: IntegrationApiLite;
  /** Command registration surface; absent on runtimes without the command API. */
  command?: CommandTransformApiLite;
  /** Event subscription surface; no unsubscribe handle is exposed. */
  event?: {
    subscribe(topic: string, cb: (...args: unknown[]) => void): unknown;
  };
}

interface IntegrationConnectionLite {
  type: string;
  id?: string;
  label?: string;
  name?: string;
}

interface CredentialValueLite {
  type: string;
  key?: string;
  access?: string;
  refresh?: string;
  expires?: number;
}

interface IntegrationConnectionApiLite {
  active(integrationID: string): Promise<IntegrationConnectionLite | undefined>;
  resolve(connection: IntegrationConnectionLite): Promise<CredentialValueLite | undefined>;
}

interface IntegrationApiLite {
  connection?: IntegrationConnectionApiLite;
}

interface PluginDefinitionLite {
  id: string;
  setup: (context: PluginContextLite) => CleanupLite | Promise<CleanupLite | void> | void;
}

interface ProcessLite {
  env: Record<string, string | undefined>;
  cwd(): string;
  chdir(directory: string): void;
  exit(code?: number): never;
}

interface BunServerLite {
  readonly port: number;
  stop(): void;
}

interface BunRuntimeLite {
  serve(options: {
    hostname: string;
    port: number;
    fetch(request: Request): Response | Promise<Response>;
  }): BunServerLite;
}

declare var Bun: BunRuntimeLite;
declare var process: ProcessLite;

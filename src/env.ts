export class Env {
  static get commitHash(): string | null {
    return process.env.VUE_APP_COMMIT_HASH ?? null
  }
}

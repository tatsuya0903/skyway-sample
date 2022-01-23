export class Env {
  static get title(): string {
    return process.env.VUE_APP_TITLE ?? ''
  }
  static get commitHash(): string | null {
    return process.env.VUE_APP_COMMIT_HASH ?? null
  }
  static get commitUrl(): string | null {
    if (this.commitHash === null) {
      return null
    }
    return `https://github.com/tatsuya0903/skyway-sample/commit/${this.commitHash}`
  }

  static get gitHubPagesUrl(): string {
    return 'https://tatsuya0903.github.io/skyway-sample'
  }

  static calcSample3ShareUrl(apiKey: string, peerId: string): string {
    return `${this.gitHubPagesUrl}/${apiKey}/sample3/${peerId}`
  }
}

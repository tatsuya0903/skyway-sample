export interface ISettings {
  apiKey?: string | null
}

export class Settings {
  constructor(public apiKey: string | null) {}

  public static createDefault(): Settings {
    return new Settings(null)
  }

  public static create(data: ISettings): Settings {
    return new Settings(data.apiKey ?? null)
  }

  toJson(): ISettings {
    return {
      apiKey: this.apiKey,
    }
  }
}

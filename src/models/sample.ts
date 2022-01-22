import { Location } from 'vue-router'
import { RouteLocations } from '@/router/models'

export const SampleIds = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
} as const
export type SampleId = typeof SampleIds[keyof typeof SampleIds]
export class Sample {
  constructor(public id: SampleId, public title: string, public subTitle: string) {}

  static find(id: SampleId): Sample {
    return this.all.find((v) => v.id === id) as Sample
  }

  static get all(): Sample[] {
    return [
      new Sample(SampleIds.One, 'サンプル1', 'テキスト送受信(P2P)'),
      new Sample(SampleIds.Two, 'サンプル2', 'テキスト送受信(ルーム)'),
      new Sample(SampleIds.Three, 'サンプル3', 'ファイル共有'),
      new Sample(SampleIds.Four, 'サンプル4', '映像・音声通話(ルーム)'),
    ]
  }

  calcLocation(apiKey: string): Location {
    switch (this.id) {
      case 1:
        return RouteLocations.toSample1(apiKey)
      case 2:
        return RouteLocations.toSample2(apiKey)
      case 3:
        return RouteLocations.toSample3(apiKey)
      case 4:
        return RouteLocations.toSample4(apiKey)
    }
  }
}

import { Location } from 'vue-router'

export const RouteNames = {
  Login: 'Login',
  Home: 'Home',
  Sample1: 'Sample1',
  Sample2: 'Sample2',
  Sample3a: 'Sample3a',
  Sample3b: 'Sample3b',
  Sample4: 'Sample4',
} as const
export type RouteName = typeof RouteNames[keyof typeof RouteNames]
export class RouteLocations {
  static toLogin(): Location {
    return {
      name: RouteNames.Login,
    }
  }
  static toHome(apiKey: string): Location {
    return {
      name: RouteNames.Home,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample1(apiKey: string): Location {
    return {
      name: RouteNames.Sample1,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample2(apiKey: string): Location {
    return {
      name: RouteNames.Sample2,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample3a(apiKey: string): Location {
    return {
      name: RouteNames.Sample3a,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample3b(apiKey: string, peerId: string): Location {
    return {
      name: RouteNames.Sample3b,
      params: {
        apiKey: apiKey,
        peerId: peerId,
      },
    }
  }
  static toSample4(apiKey: string): Location {
    return {
      name: RouteNames.Sample4,
      params: {
        apiKey: apiKey,
      },
    }
  }
}

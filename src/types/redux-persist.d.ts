declare module 'redux-persist' {
  import { Store, Action, AnyAction } from 'redux'
  import { PersistState } from 'redux-persist/es/types'

  export interface Storage {
    getItem(key: string): Promise<string | null> | string | null
    setItem(key: string, value: string): Promise<void> | void
    removeItem(key: string): Promise<void> | void
  }

  export interface PersistConfig<S = any, RS = any, HSS = any, ESS = any> {
    key: string
    storage: Storage
    version?: number
    whitelist?: string[]
    blacklist?: string[]
    transforms?: any[]
    throttle?: number
    migrate?: (state: any, version: number) => Promise<any> | any
    stateReconciler?: false | ((inboundState: any, originalState: any, reducedState: any, config: PersistConfig<S, RS, HSS, ESS>) => any)
    getStoredState?: (config: PersistConfig<S, RS, HSS, ESS>) => Promise<any>
    debug?: boolean
    serialize?: boolean
    timeout?: number
    writeFailHandler?: (err: Error) => void
  }

  export interface PersistorOptions {
    enhancer?: any
  }

  export interface Persistor {
    purge(): Promise<void>
    flush(): Promise<void>
    pause(): void
    persist(): void
    resume(): void
  }

  export function persistStore(store: Store, options?: PersistorOptions, callback?: () => any): Persistor
  export function persistReducer<S = any, A extends Action<any> = AnyAction>(config: PersistConfig<S>, reducer: any): any
}

declare module 'redux-persist/lib/storage' {
  import { Storage } from 'redux-persist'
  const storage: Storage
  export default storage
}

declare module 'redux-persist/lib/integration/react' {
  import { Component, ReactNode } from 'react'
  import { Persistor } from 'redux-persist'

  interface PersistGateProps {
    persistor: Persistor
    loading?: ReactNode | null
    children?: ReactNode
  }

  export class PersistGate extends Component<PersistGateProps> {}
} 
type EventCallback = (...args: any[]) => void

export class SceneEventEmitter {
  private events: Map<string, EventCallback[]> = new Map()

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  off(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) return

    const callbacks = this.events.get(event)!
    const index = callbacks.indexOf(callback)

    if (index !== -1) {
      callbacks.splice(index, 1)
    }

    if (callbacks.length === 0) {
      this.events.delete(event)
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) return

    const callbacks = this.events.get(event)!
    callbacks.forEach((callback) => callback(...args))
  }
}

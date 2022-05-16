import { AlertType, AlertOptions } from "./types"

export const DEFAULT_OPTIONS: AlertOptions = {
   type: AlertType.INFO,
   timeout: 10000,
   closed: true,
}
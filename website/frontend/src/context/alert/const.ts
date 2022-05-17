import { AlertType, AlertOptions } from "./types"

export const DEFAULT_OPTIONS: Required<AlertOptions> = {
   type: AlertType.INFO,
   timeout: 10000,
   closed: true,
}
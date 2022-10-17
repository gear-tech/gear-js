export function getTgCommands(): string {
  return "/uploadDapps" + "\n"
  + "/getUserId" + "\n"
  + "/uploadDapp [dappName]" + "\n"
  + "/uploadCodes" + "\n"
  + "/uploadCode [dappName]" + "\n"
  + "/addAccessUser [telegramUserId]" + "\n"
  + "/updateWasmUrlsWorkflow";
}

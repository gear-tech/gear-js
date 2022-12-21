import { Hex } from "@gear-js/api";
import { useCreateHandler, useMetadata, useSendMessage } from "@gear-js/react-hooks";
import metaAssets from '../assets/metaWasm/rock_paper_scissors.meta.wasm';


function useCreateRockPaperScissors() {
    const newHesh = process.env.REACT_APP_CODE_ADDRESS as Hex;
    const { metadata } = useMetadata(metaAssets);
    return useCreateHandler(newHesh, metadata);
}

function useRockPaperScissorsMessage(programID: Hex) {
    return useSendMessage(programID, metaAssets);
}

// function useCreateRockPaperScissors() {
//   const { codeHash, meta } = useWasm();
//   return useCreateHandler(codeHash, meta);
// }

// function useRockPaperScissorsMessage(programID: Hex) {
//   const { meta } = useWasm();
//   return useSendMessage(programID, meta)
// }
//  temporary


export { useCreateRockPaperScissors, useRockPaperScissorsMessage }
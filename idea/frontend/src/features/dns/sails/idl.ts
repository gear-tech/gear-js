export const idl = `type ActorId = struct {
    [u8, 32],
};

type ContractInfo = struct {
    admin: ActorId,
    program_id: ActorId,
    registration_time: str,
};

constructor {
    New : ();
};

service Dns {
    AddNewProgram : (name: str, program_id: ActorId) -> null;
    ChangeProgramId : (name: str, new_program_id: ActorId) -> null;
    DeleteMe : () -> null;
    DeleteProgram : (name: str) -> null;
    query AllContracts : () -> vec struct { str, ContractInfo };
    query GetAllAddresses : () -> vec ActorId;
    query GetAllNames : () -> vec str;
    query GetContractInfoByName : (name: str) -> opt ContractInfo;
    query GetNameByProgramId : (program_id: ActorId) -> opt str;
  
    events {
        NewProgramAdded: struct { name: str, contract_info: ContractInfo };
        ProgramIdChanged: struct { name: str, contract_info: ContractInfo };
        ProgramDeleted: struct { name: str };
    }
};`;

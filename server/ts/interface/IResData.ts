export default interface IResData {
    event: { header: { name: string; message_id: string; version: string; }; payload: object }
}
import ICapability from "./ICapability";
import ECategory from "../enum/ECategory";

export default interface ICategoryAndCapabilities{
    category: ECategory,
    capabilities: ICapability[]
}
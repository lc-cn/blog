import {Config} from "@/types";

export interface ConfigApis{
    '/config/all'():Config[]
}
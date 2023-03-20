import { AWS } from "@serverless/typescript";

export type FunctionConfig =  AWS['functions']['string'];
export type DocumentedFunctionConfig = FunctionConfig & {events: Array<{httpApi: {documentation: any}}>};
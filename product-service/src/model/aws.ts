import { AWS } from "@serverless/typescript";

export type DocumentedFunctionConfig = AWS['functions']['string'] & {events: Array<{httpApi: {documentation: any}}>};
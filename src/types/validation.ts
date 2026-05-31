export type ValidationError = {
  nodeId: string;
  message: string;
  field?: string;
};